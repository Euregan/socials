import express from "express";
import { DetailedResponse, server } from "../graphql";
import jsonwebtoken from "jsonwebtoken";
import { db } from "../database";
import { fetchFeed } from "../externalApi/rss";
import { SourceType } from "../generated/prisma";
import argon2 from "argon2";
import { XMLParser } from "fast-xml-parser";
import z from "zod";
import { importFeed } from "../sync/syncRssFeeds";

const handler = server({
  instantiateContext: (request) => {
    const cookies = request.headers.cookie
      ?.split(";")
      .map((cookie) => cookie.split("="));

    const jwt = cookies?.find(([key]) => key === "jwt");

    // if (!jwt) {
    //   // TODO: Handle this better
    //   throw new Error("No JWT");
    // }

    const jwtPayload = jwt
      ? jsonwebtoken.verify(jwt[1], process.env.JWT_SECRET!)
      : null;

    return {
      userId: jwtPayload ? ((jwtPayload as any).id as number) : null,
    };
  },
})({
  Item: {
    source: (item) =>
      db.source.findFirstOrThrow({
        where: { items: { some: { id: item.id } } },
      }),
    seenAt: async (item, { userId }) => {
      if (!userId) throw new Error("No JWT");

      const { seenAt } = await db.userItem.findUniqueOrThrow({
        where: { userId_itemId: { userId, itemId: item.id } },
      });

      return seenAt ?? undefined;
    },
    // @ts-expect-error TODO: Improve enodia to rely on the actual type sent back by the query
    hasThumbnail: (item) => !!item.thumbnailUrl,
  },
  Source: {
    user: (source, { userId }) => {
      if (!userId) throw new Error("No JWT");

      return db.user.findUniqueOrThrow({ where: { id: userId } });
    },
    items: (source, { userId }) => {
      if (!userId) throw new Error("No JWT");

      return db.item.findMany({
        where: { sourceId: source.id, users: { some: { userId } } },
      });
    },
    // @ts-expect-error TODO: Improve enodia to rely on the actual type sent back by the query
    hasThumbnail: (source) => !!source.thumbnailUrl,
    groups: (source, { userId }) => {
      if (!userId) throw new Error("No JWT");

      return db.group.findMany({
        where: {
          subscriptions: {
            some: {
              userId,
              sourceId: source.id,
            },
          },
        },
      });
    },
  },
  Group: {
    sources: (group, { userId }) => {
      if (!userId) throw new Error("No JWT");

      return db.source.findMany({
        where: {
          subscriptions: {
            some: { userId, groups: { some: { id: group.id } } },
          },
        },
      });
    },
  },
  User: {
    sources: (user) =>
      db.source.findMany({
        where: { subscriptions: { some: { userId: user.id } } },
      }),
  },
})({
  Query: {
    unseen: ({ userId }) => {
      if (!userId) throw new Error("No JWT");

      return db.item.findMany({
        where: { users: { some: { seenAt: null, userId } } },
        orderBy: { publishedAt: "desc" },
      });
    },
    sources: ({ userId }) => {
      if (!userId) throw new Error("No JWT");

      return db.source.findMany({
        where: { subscriptions: { some: { userId } } },
      });
    },
    youtubeChannels: async ({ userId }) => {
      if (!userId) throw new Error("No JWT");
      const user = await db.user.findUniqueOrThrow({ where: { id: userId } });

      if (!user.admin) throw new Error("Unauthorized");

      return db.source.findMany({ where: { type: SourceType.Youtube } });
    },
  },
  Mutation: {
    signup: async ({ email, password }) => {
      const hashedPassword = await argon2.hash(password);
      const user = await db.user.create({
        data: { email, password: hashedPassword },
      });

      return new DetailedResponse({
        content: user,
        cookies: {
          jwt: jsonwebtoken.sign(
            {
              id: user.id,
              email: user.email,
            },
            process.env.JWT_SECRET!,
          ),
        },
      });
    },
    login: async ({ email, password }) => {
      const user = await db.user.findUnique({
        where: { email },
      });
      if (!user) {
        throw new Error("User not found or password doesn't match");
      }

      const matches = await argon2.verify(user.password, password);
      if (!matches) {
        throw new Error("User not found or password doesn't match");
      }

      return new DetailedResponse({
        content: user,
        cookies: {
          jwt: jsonwebtoken.sign(
            {
              id: user.id,
              email: user.email,
            },
            process.env.JWT_SECRET!,
          ),
        },
      });
    },
    markAsSeen: async ({ itemId, seenAt }, { userId }) => {
      if (!userId) throw new Error("No JWT");

      await db.userItem.updateMany({
        where: { itemId, userId, seenAt: null },
        data: { seenAt },
      });

      return db.item.findUniqueOrThrow({ where: { id: itemId } });
    },
    markAsUnseen: async ({ itemId }, { userId }) => {
      if (!userId) throw new Error("No JWT");

      await db.userItem.updateMany({
        where: { itemId, userId },
        data: { seenAt: null },
      });

      return db.item.findUniqueOrThrow({ where: { id: itemId } });
    },
    addRssFeed: async ({ url }, { userId }) => {
      if (!userId) throw new Error("No JWT");

      return importFeed(url, userId);
    },
    uploadOpml: async ({ content }, { userId }) => {
      if (!userId) throw new Error("No JWT");

      const parser = new XMLParser({ ignoreAttributes: false });
      const raw = parser.parse(content);

      const validatedOpml = z
        .object({
          opml: z.object({
            body: z.object({
              outline: z.array(
                z.object({
                  outline: z
                    .union([
                      z.array(z.object({ "@_xmlUrl": z.string() })),
                      z.object({ "@_xmlUrl": z.string() }),
                    ])
                    .optional(),
                }),
              ),
            }),
          }),
        })
        .safeParse(raw);

      if (!validatedOpml.success) {
        console.error(validatedOpml.error.message);
        return [];
      }

      const feedUrls = validatedOpml.data.opml.body.outline.flatMap(
        ({ outline }) =>
          outline
            ? Array.isArray(outline)
              ? outline.map((outline) => outline["@_xmlUrl"])
              : [outline["@_xmlUrl"]]
            : [],
      );

      const sources = [];
      for (const url of feedUrls) {
        try {
          sources.push(await importFeed(url, userId));
        } catch (error) {
          console.error(url, error);
        }
      }
      return sources;
    },
    deleteSource: async ({ sourceId }, { userId }) => {
      if (!userId) throw new Error("No JWT");

      await db.subscription.delete({
        where: { userId_sourceId: { userId, sourceId } },
      });

      return db.source.findUniqueOrThrow({ where: { id: sourceId } });
    },
    createGroup: ({ sourceIds, excludeFromGlobalView, name }, { userId }) => {
      if (!userId) throw new Error("No JWT");

      return db.group.create({
        data: {
          excludeFromGlobalView,
          name,
          subscriptions: {
            connect: sourceIds.map((sourceId) => ({
              userId_sourceId: { userId, sourceId },
            })),
          },
        },
      });
    },
    updateGroup: (
      { groupId, sourceIds, excludeFromGlobalView, name },
      { userId },
    ) => {
      if (!userId) throw new Error("No JWT");

      return db.group.update({
        where: { id: groupId },
        data: {
          excludeFromGlobalView,
          name,
          subscriptions: {
            set: sourceIds.map((sourceId) => ({
              userId_sourceId: { userId, sourceId },
            })),
          },
        },
      });
    },
  },
});

const graphqlRouter = express.Router();

graphqlRouter.post("/", async (request, response) => {
  // const cookies = request.headers.cookie
  //   ?.split(";")
  //   .map((cookie) => cookie.split("="));

  // const jwt = cookies?.find(([key]) => key === "jwt");

  // if (!jwt) {
  //   response.status(401).json({});
  //   return;
  // }

  try {
    await handler(request, response);
  } catch (error) {
    console.error(error);
    response.status(500).json({});
  }
});

export default graphqlRouter;
