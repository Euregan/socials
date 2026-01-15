import express from "express";
import { server } from "../graphql";
import jsonwebtoken from "jsonwebtoken";
import { db } from "../database";

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
