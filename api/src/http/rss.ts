import express from "express";
import { syncRssFeeds } from "../sync/syncRssFeeds";

const rssRouter = express.Router();

rssRouter.get("/refresh", async (request, response) => {
  const count = await syncRssFeeds();

  console.log(`Synced ${count} rss feeds`);

  response.status(200).send();
});

export default rssRouter;
