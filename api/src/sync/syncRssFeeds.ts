import { db } from "../database";
import { fetchFeed } from "../externalApi/rss";
import { SourceType } from "../generated/prisma";

export const syncRssFeeds = async () => {
  const sources = await db.source.findMany({ where: { type: SourceType.RSS } });

  for (const source of sources) {
    const feed = await fetchFeed(source.remoteId);
    const subscriptions = await db.subscription.findMany({
      where: { sourceId: source.id },
    });

    for (const rssItem of feed.items) {
      let item = await db.item.findUnique({
        where: {
          remoteId_sourceId: {
            sourceId: source.id,
            remoteId: rssItem.guid!,
          },
        },
      });

      if (!item) {
        item = await db.item.create({
          data: {
            title: rssItem.title!,
            remoteId: rssItem.guid!,
            description: rssItem.content,
            thumbnailUrl: rssItem.thumbnail,
            publishedAt: new Date(rssItem.pubDate!),
            url: rssItem.link!,
            sourceId: source.id,
          },
        });

        for (const subscription of subscriptions) {
          await db.userItem.create({
            data: { userId: subscription.userId, itemId: item.id },
          });
        }
      }
    }
  }

  return sources.length;
};
