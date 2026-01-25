import express from "express";
import validate from "express-zod-safe";
import { z } from "zod";
import { db } from "../database";
import { Readable } from "node:stream";
import sharp from "sharp";
import { SourceType } from "../generated/prisma";
import { ReadableStream } from "node:stream/web";

const thumbnailRouter = express.Router();

thumbnailRouter.get(
  "/:type/:id",
  validate({
    params: z.object({
      type: z.union([z.literal("item"), z.literal("source")]),
      id: z.coerce.number(),
    }),
  }),
  async (request, response) => {
    let url: string | null = null;
    switch (request.params.type) {
      case "item":
        const item = await db.item.findUniqueOrThrow({
          where: { id: request.params.id },
          select: { thumbnailUrl: true, source: { select: { type: true } } },
        });
        url = item.thumbnailUrl;
        // 7 days
        response.setHeader("cache-control", "max-age=0, s-maxage=604800");

        if (url && item.source.type === SourceType.Youtube) {
          const imageResponse = await fetch(url);
          response.setHeader(
            "Content-Type",
            imageResponse.headers.get("content-type")!,
          );
          const image = await imageResponse.arrayBuffer();

          const sharpImage = sharp(image);
          const processing = await sharpImage.metadata().then((metadata) => {
            const rawCroppedHeight = Math.floor(metadata.width / (16 / 9));
            const margin = Math.ceil((metadata.height - rawCroppedHeight) / 2);

            return sharpImage.extract({
              top: margin,
              height: metadata.height - 2 * margin,
              left: 0,
              width: metadata.width,
            });
          });
          processing.pipe(response);
          return;
        }

        break;
      case "source":
        const source = await db.source.findUniqueOrThrow({
          where: { id: request.params.id },
          select: { thumbnailUrl: true },
        });
        url = source.thumbnailUrl;
        // 1 month
        response.setHeader("cache-control", "max-age=0, s-maxage=2592000");
        break;
    }

    if (!url) {
      response.sendStatus(404);
      return;
    }

    const image = await fetch(url);

    response.setHeader("Content-Type", image.headers.get("content-type")!);

    Readable.fromWeb(image.body as ReadableStream<any>).pipe(response);
  },
);

export default thumbnailRouter;
