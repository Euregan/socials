import { db } from "../database";
import { getSubscribedChannels } from "../externalApi/google";
import { SourceType } from "../generated/prisma";

export const syncSubscribedChannelsFromYoutube = async () => {
  // TODO: Paginate it to prevent OOM
  const users = await db.user.findMany({
    where: { googleRefreshToken: { not: null } },
  });

  for (const user of users) {
    const channels = await getSubscribedChannels(user.googleRefreshToken!);

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
    }
  }
};
