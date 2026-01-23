import express from "express";
import validate from "express-zod-safe";
import xml from "xml2js";
import { z } from "zod";
import { db } from "../database";
import querystring from "querystring";
import { SourceType } from "../generated/prisma";

const youtubeRouter = express.Router();

youtubeRouter.get(
  "/pubsubhubbub",
  validate({
    query: z.object({
      "hub.challenge": z.string(),
      "hub.topic": z.string(),
      "hub.lease_seconds": z.coerce.number().int(),
    }),
  }),
  async (request, response) => {
    return response.send(request.query["hub.challenge"]);
  },
);

youtubeRouter.post(
  "/pubsubhubbub",
  validate({ body: z.any() }),
  async (request, response) => {
    try {
      const payload: {
        feed: {
          entry: [
            {
              id: [string];
              "yt:videoId": [string];
              "yt:channelId": [string];
              link: [string];
              title: [string];
              published: [string];
              updated: [string];
            },
          ];
        };
      } = await xml.parseStringPromise(request.body);

      if (payload.feed.entry[0].link[0].includes("/shorts/")) {
        response.status(200).end();
        return;
      }

      const source = await db.source.findUniqueOrThrow({
        where: { remoteId: payload.feed.entry[0]["yt:channelId"][0] },
      });

      const item = await db.item.upsert({
        where: {
          remoteId_sourceId: {
            remoteId: payload.feed.entry[0]["yt:videoId"][0],
            sourceId: source.id,
          },
        },
        create: {
          title: payload.feed.entry[0].title[0],
          remoteId: payload.feed.entry[0]["yt:videoId"][0],
          publishedAt: new Date(payload.feed.entry[0].published[0]),
          url: payload.feed.entry[0].link[0],
          thumbnailUrl: `https://i.ytimg.com/vi/${payload.feed.entry[0]["yt:videoId"][0]}/hqdefault.jpg`,
          description: "",
          source: { connect: { id: source.id } },
        },
        update: {
          title: payload.feed.entry[0].title[0],
          remoteId: payload.feed.entry[0]["yt:videoId"][0],
          publishedAt: new Date(payload.feed.entry[0].published[0]),
          url: payload.feed.entry[0].link[0],
          thumbnailUrl: `https://i.ytimg.com/vi/${payload.feed.entry[0]["yt:videoId"][0]}/hqdefault.jpg`,
          description: "",
        },
      });

      response.status(200).end();

      const subscriptions = await db.subscription.findMany({
        where: { sourceId: source.id },
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
    } catch (error) {
      console.log(
        JSON.stringify(request.body, null, 2),
        JSON.stringify(request.query, null, 2),
      );
      console.error(error);
      // We don't want Youtube to stop sending us updates if we error
      return response.status(200).end();
    }
  },
);

youtubeRouter.get("/refresh", async (request, response) => {
  const sources = await db.source.findMany({
    where: { type: SourceType.Youtube },
  });

  // TODO: Batch this to stay under 5 minutes (currently 4m20 for one user)
  for (const source of sources) {
    await fetch(`https://pubsubhubbub.appspot.com/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: querystring.stringify({
        "hub.mode": "subscribe",
        "hub.topic": `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${source.remoteId}`,
        "hub.callback": `${process.env.API_URL}/youtube/pubsubhubbub`,
      }),
    });
  }

  return response.status(200).json({});
});

export default youtubeRouter;
