import express from "express";
import validate from "express-zod-safe";
import { z } from "zod";
import { db } from "../database";
import { getSubscribedChannels } from "../externalApi/google";
import jsonwebtoken from "jsonwebtoken";
import { SourceType } from "../generated/prisma";
import querystring from "querystring";

const googleRouter = express.Router();

const query = z.object({
  code: z.string(),
  state: z.coerce.number(),
});
googleRouter.get("/auth", validate({ query }), async (request, response) => {
  try {
    const rawResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code: request.query.code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.API_URL}/google/auth`,
      }),
    }).then((response) => response.json());

    const parsedResponse = z
      .object({
        access_token: z.string(),
        expires_in: z.number(),
        refresh_token: z.string().optional(),
      })
      .safeParse(rawResponse);

    const sources = [];
    if (parsedResponse.success) {
      const rawGoogleProfile = await fetch(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${parsedResponse.data.access_token}`,
          },
        }
      ).then((response) => response.json());

      const googleProfile = z
        .object({
          id: z.string(),
          given_name: z.string(),
          family_name: z.string(),
          email: z.string(),
        })
        .parse(rawGoogleProfile);

      const user = await db.user.update({
        where: { id: request.query.state },
        data: {
          googleUserId: googleProfile.id,
          googleAccessToken: parsedResponse.data.access_token,
          googleRefreshToken: parsedResponse.data.refresh_token ?? undefined,
        },
      });

      const channels = await getSubscribedChannels(
        parsedResponse.data.refresh_token!
      );
      for (const channel of channels) {
        const source = await db.source.upsert({
          where: { remoteId: channel.snippet.resourceId.channelId },
          create: {
            name: channel.snippet.title,
            type: SourceType.Youtube,
            remoteId: channel.snippet.resourceId.channelId,
            description: channel.snippet.description,
            thumbnailUrl: channel.snippet.thumbnails.default.url,
          },
          update: {
            name: channel.snippet.title,
            type: SourceType.Youtube,
            remoteId: channel.snippet.resourceId.channelId,
            description: channel.snippet.description,
            thumbnailUrl: channel.snippet.thumbnails.default.url,
          },
        });

        await db.subscription.upsert({
          where: { userId_sourceId: { sourceId: source.id, userId: user.id } },
          create: { sourceId: source.id, userId: user.id },
          update: {},
        });

        sources.push(source);
      }
    }

    response.redirect(process.env.WEB_URL!);

    if (process.env.NODE_ENV !== "development") {
      for (const source of sources) {
        await fetch(`https://pubsubhubbub.appspot.com/subscribe`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: querystring.stringify({
            "hub.mode": "subscribe",
            "hub.topic": `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${source.remoteId}`,
            "hub.callback": `https://${process.env.API_URL}/api/webhook/youtube`,
          }),
        });
      }
    }
  } catch (error) {
    console.error(error);
    response.status(500).json({});
  }
});

export default googleRouter;
