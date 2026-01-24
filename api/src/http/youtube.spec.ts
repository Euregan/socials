import { describe, it, expect } from "vitest";
import api from "./youtube";
import { randomUUID } from "node:crypto";
import { db } from "../database";
import { SourceType } from "../generated/prisma";
import request from "supertest";
import express from "express";

const trailerBody = (
  channelId: string,
  videoId: string,
) => `<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015"
         xmlns="http://www.w3.org/2005/Atom">
  <link rel="hub" href="https://pubsubhubbub.appspot.com"/>
  <link rel="self" href="https://www.youtube.com/xml/feeds/videos.xml?channel_id=${channelId}"/>
  <title>YouTube video feed</title>
  <updated>2021-06-11T16:00:01+00:00</updated>
  <entry>
    <id>yt:video:${videoId}</id>
    <yt:videoId>${videoId}</yt:videoId>
    <yt:channelId>${channelId}</yt:channelId>
    <title>Virgin River: Season 3 | Official Trailer | Netflix</title>
    <link rel="alternate" href="http://www.youtube.com/watch?v=${videoId}"/>
    <author>
     <name>Netflix</name>
     <uri>http://www.youtube.com/channel/${channelId}</uri>
    </author>
    <published>2021-06-11T16:00:01+00:00</published>
    <updated>2021-06-11T16:00:01+00:00</updated>
  </entry>
</feed>`;

const setup = async () => {
  const netflixYoutubeId = randomUUID();
  const paramountYoutubeId = randomUUID();

  await db.source.createMany({
    data: [
      {
        name: "Netflix",
        description:
          "Netflix is the world's leading streaming entertainment service with 204 million paid memberships in over 190 countries enjoying TV series, documentaries and ...",
        thumbnailUrl:
          "https://yt3.ggpht.com/ytc/AAUvwni_LdnpDi-SOIhjp4Kxo2l_yVBoYsfdDCpUM5VDzg=s88-c-k-c0xffffffff-no-rj-mo",
        remoteId: netflixYoutubeId,
        type: SourceType.Youtube,
      },
      {
        name: "Paramount Pictures",
        description: "The official YouTube channel for Paramount Pictures!",
        thumbnailUrl:
          "https://yt3.ggpht.com/XbN13L6NITWuU_iglB6q8a85sIY3YOtfaftg2_8oVWQ9Rxj4hu_BB7-XbvPOTZfNL8R9gKrN8EE=s88-c-k-c0xffffffff-no-rj-mo",
        remoteId: paramountYoutubeId,
        type: SourceType.Youtube,
      },
    ],
  });

  return {
    api: request(express().use(api)),
    netflixYoutubeId,
    paramountYoutubeId,
  };
};

// The two tests marked with concurrent will be run in parallel
describe("Youtube PubSub", () => {
  describe("Receiving videos", () => {
    it("Creates a trailer upon reception", async () => {
      const { netflixYoutubeId, api } = await setup();
      const trailerYoutubeId = randomUUID();

      const response = await api
        .post("/pubsubhubbub")
        .set("Content-Type", "application/xml")
        .send(trailerBody(netflixYoutubeId, trailerYoutubeId));
      expect(response.statusCode).toBe(200);

      const video = await db.item.findFirstOrThrow({
        where: { remoteId: trailerYoutubeId },
        include: { source: true },
      });

      expect(video).toMatchObject({
        title: "Virgin River: Season 3 | Official Trailer | Netflix",
        remoteId: trailerYoutubeId,
        source: { remoteId: netflixYoutubeId },
      });
    });

    it("Doesn't create a trailer upon reception if it already exists", async () => {
      const { netflixYoutubeId, api } = await setup();
      const trailerYoutubeId = randomUUID();

      await db.item.create({
        data: {
          source: {
            connect: {
              remoteId: netflixYoutubeId,
            },
          },
          title: "WOOOOOOOOOOOOOOOO, NEW TITLE",
          remoteId: trailerYoutubeId,
          description: "",
          publishedAt: new Date(),
          url: "",
        },
      });

      const response = await api
        .post("/pubsubhubbub")
        .set("Content-Type", "application/xml")
        .send(trailerBody(netflixYoutubeId, trailerYoutubeId));
      expect(response.statusCode).toBe(200);

      const videos = await db.item.findMany({
        where: { remoteId: trailerYoutubeId },
        include: { source: true },
      });

      expect(videos).toHaveLength(1);
      expect(videos).toMatchObject([
        {
          title: "Virgin River: Season 3 | Official Trailer | Netflix",
        },
      ]);
    });
  });
});
