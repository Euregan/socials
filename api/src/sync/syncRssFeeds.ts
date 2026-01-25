import { db } from "../database";
import { fetchFeed } from "../externalApi/rss";
import { SourceType } from "../generated/prisma";

export const importFeed = async (url: string, userId: number) => {
  const feed = await fetchFeed(url);

  let source = await db.source.findUnique({
    where: { remoteId: url },
  });

  if (!source) {
    source = await db.source.create({
      data: {
        remoteId: url,
        name: feed.title ?? url,
        description: feed.description,
        thumbnailUrl: feed.thumbnail,
        type: SourceType.RSS,
      },
    });
  }

  await db.subscription.upsert({
    where: { userId_sourceId: { sourceId: source.id, userId } },
    create: { sourceId: source.id, userId },
    update: {},
  });

  for (const rssItem of feed.items) {
    const remoteId =
      rssItem.guid ?? rssItem.link ?? rssItem.isoDate ?? rssItem.pubDate;
    if (!remoteId) continue;

    let item = await db.item.findUnique({
      where: {
        remoteId_sourceId: {
          sourceId: source.id,
          remoteId,
        },
      },
    });

    if (!item) {
      item = await db.item.create({
        data: {
          title: rssItem.title!,
          remoteId,
          description: rssItem.content,
          thumbnailUrl: rssItem.thumbnail,
          publishedAt: new Date(rssItem.isoDate || rssItem.pubDate!),
          url: rssItem.link!,
          sourceId: source.id,
        },
      });
    }

    await db.userItem.upsert({
      where: { userId_itemId: { userId, itemId: item.id } },
      create: { userId, itemId: item.id },
      update: {},
    });
  }

  return source;
};

export const syncRssFeeds = async () => {
  const sources = await db.source.findMany({ where: { type: SourceType.RSS } });

  for (const source of sources) {
    const feed = await fetchFeed(source.remoteId);
    const subscriptions = await db.subscription.findMany({
      where: { sourceId: source.id },
    });

    for (const rssItem of feed.items) {
      const remoteId =
        rssItem.guid ?? rssItem.link ?? rssItem.isoDate ?? rssItem.pubDate;
      if (!remoteId) continue;

      let item = await db.item.findUnique({
        where: {
          remoteId_sourceId: {
            sourceId: source.id,
            remoteId,
          },
        },
      });

      if (!item) {
        item = await db.item.create({
          data: {
            title: rssItem.title!,
            remoteId,
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
