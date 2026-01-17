import { syncRssFeeds } from "./sync/syncRssFeeds";
import { syncSubscribedChannelsFromYoutube } from "./sync/syncSubscribedChannelsFromYoutube";
import { syncVideosFromChannel } from "./sync/syncVideosFromChannel";

export const sync = async () => {
  await syncSubscribedChannelsFromYoutube();
  // await syncVideosFromChannel();
  await syncRssFeeds();
};
