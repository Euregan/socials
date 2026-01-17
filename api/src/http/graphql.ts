import express from "express";
import { server } from "../graphql";
import jsonwebtoken from "jsonwebtoken";
import { db } from "../database";
import { fetchFeed } from "../externalApi/rss";
import { SourceType } from "../generated/prisma";

const handler = server({
  instantiateContext: (request) => {
    const cookies = request.headers.cookie
      ?.split(";")
      .map((cookie) => cookie.split("="));

    const jwt = cookies?.find(([key]) => key === "jwt");

    if (!jwt) {
      // TODO: Handle this better
      throw new Error("No JWT");
    }

    const jwtPayload = jsonwebtoken.verify(jwt[1], process.env.JWT_SECRET!);

    return {
      userId: (jwtPayload as any).id,
    };
  },
})({
  Item: {
    source: (item) =>
      db.source.findFirstOrThrow({
        where: { items: { some: { id: item.id } } },
      }),
    seenAt: (item, { userId }) =>
      db.userItem
        .findUniqueOrThrow({
          where: { userId_itemId: { userId, itemId: item.id } },
        })
        .then(({ seenAt }) => seenAt ?? undefined),
  },
  Source: {
    user: (source, { userId }) =>
      db.user.findUniqueOrThrow({ where: { id: userId } }),
    items: (source, { userId }) =>
      db.item.findMany({
        where: { sourceId: source.id, users: { some: { userId } } },
      }),
  },
  User: {
    sources: (user) =>
      db.source.findMany({
        where: { subscriptions: { some: { userId: user.id } } },
      }),
  },
})({
  Query: {
    unseen: ({ userId }) =>
      db.item.findMany({
        where: { users: { some: { seenAt: null, userId } } },
        orderBy: { publishedAt: "desc" },
      }),
  },
  Mutation: {
    markAsSeen: async ({ itemId, seenAt }, { userId }) => {
      await db.userItem.updateMany({
        where: { itemId, userId, seenAt: null },
        data: { seenAt },
      });

      return db.item.findUniqueOrThrow({ where: { id: itemId } });
    },
    markAsUnseen: async ({ itemId }, { userId }) => {
      await db.userItem.updateMany({
        where: { itemId, userId },
        data: { seenAt: null },
      });

      return db.item.findUniqueOrThrow({ where: { id: itemId } });
    },
    addRssFeed: async ({ url }, { userId }) => {
      const feed = await fetchFeed(url);

      const source = await db.source.upsert({
        where: { remoteId: url },
        create: {
          remoteId: feed.feedUrl ?? url,
          name: feed.title ?? url,
          description: feed.description,
          type: SourceType.RSS,
        },
        update: {
          remoteId: feed.feedUrl ?? url,
          name: feed.title ?? url,
          description: feed.description,
          type: SourceType.RSS,
        },
      });

      await db.subscription.create({ data: { sourceId: source.id, userId } });

      const subscriptions = await db.subscription.findMany({
        where: { sourceId: source.id },
      });

      for (const rssItem of feed.items) {
        const item = await db.item.upsert({
          where: {
            remoteId_sourceId: {
              sourceId: source.id,
              remoteId: rssItem.guid!,
            },
          },
          create: {
            title: rssItem.title!,
            remoteId: rssItem.guid!,
            description: rssItem.content!,
            publishedAt: new Date(rssItem.pubDate!),
            url: rssItem.link!,
            sourceId: source.id,
          },
          update: {
            title: rssItem.title!,
            remoteId: rssItem.guid!,
            description: rssItem.content!,
            publishedAt: new Date(rssItem.pubDate!),
            url: rssItem.link!,
            sourceId: source.id,
          },
        });

        for (const subscription of subscriptions) {
          await db.userItem.upsert({
            where: {
              userId_itemId: { userId: subscription.userId, itemId: item.id },
            },
            create: { userId: subscription.userId, itemId: item.id },
            update: { userId: subscription.userId, itemId: item.id },
          });
        }
      }

      return source;
    },
  },
});

const graphqlRouter = express.Router();

graphqlRouter.post("/", async (request, response) => {
  const cookies = request.headers.cookie
    ?.split(";")
    .map((cookie) => cookie.split("="));

  const jwt = cookies?.find(([key]) => key === "jwt");

  if (!jwt) {
    response.status(401).json({});
    return;
  }

  try {
    await handler(request, response);
  } catch (error) {
    console.error(error);
    response.status(500).json({});
  }
});

export default graphqlRouter;
