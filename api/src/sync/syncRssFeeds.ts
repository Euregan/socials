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
          description: rssItem.content,
          thumbnailUrl: rssItem.thumbnail,
          publishedAt: new Date(rssItem.pubDate!),
          url: rssItem.link!,
          sourceId: source.id,
        },
        update: {
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
        await db.userItem.upsert({
          where: {
            userId_itemId: { userId: subscription.userId, itemId: item.id },
          },
          create: { userId: subscription.userId, itemId: item.id },
          update: { userId: subscription.userId, itemId: item.id },
        });
      }
    }
  }
};
