import express from "express";
import validate from "express-zod-safe";
import { z } from "zod";
import { db } from "../database";
import { Readable } from "node:stream";

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
          select: { thumbnailUrl: true },
        });
        url = item.thumbnailUrl;
        // 7 days
        response.setHeader("cache-control", "max-age=0, s-maxage=604800");
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
    // @ts-expect-error This works 🤷
    Readable.fromWeb(image.body!).pipe(response);
  },
);

export default thumbnailRouter;
