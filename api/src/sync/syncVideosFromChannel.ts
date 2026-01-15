import { db } from "../database";
import { getChannelVideos, getSubscribedChannels } from "../externalApi/google";
import { SourceType } from "../generated/prisma";

export const syncVideosFromChannel = async () => {
  // TODO: Paginate it to prevent OOM
  const channels = await db.source.findMany({
    where: { type: SourceType.Youtube },
  });

  for (const channel of channels) {
    const videos = await getChannelVideos(channel.remoteId);
    const subscriptions = await db.subscription.findMany({
      where: { sourceId: channel.id },
    });

    for (const video of videos) {
      const item = await db.item.upsert({
        where: {
          remoteId_sourceId: {
            sourceId: channel.id,
            remoteId: video.id.videoId,
          },
        },
        create: {
          // TODO: Change the HTNL entities into their actual character
          title: video.snippet.title,
          remoteId: video.id.videoId,
          description: video.snippet.description,
          thumbnailUrl: video.snippet.thumbnails.high.url,
          publishedAt: video.snippet.publishedAt,
          url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
          sourceId: channel.id,
        },
        update: {
          // TODO: Change the HTNL entities into their actual character
          title: video.snippet.title,
          remoteId: video.id.videoId,
          description: video.snippet.description,
          thumbnailUrl: video.snippet.thumbnails.high.url,
          publishedAt: video.snippet.publishedAt,
          url: `https://www.youtube.com/watch?v=${video.id.videoId}`,
          sourceId: channel.id,
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
