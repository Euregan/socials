import { z } from "zod";
import { call } from "./call";
import { title } from "process";

const refreshAccessToken = async (refreshToken: string) => {
  const { access_token } = await call(
    "https://oauth2.googleapis.com/token",
    z.object({
      access_token: z.string(),
      expires_in: z.number(),
      scope: z.string(),
      token_type: z.literal("Bearer"),
    }),
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: [
        `client_id=${process.env.GOOGLE_CLIENT_ID}`,
        `client_secret=${process.env.GOOGLE_CLIENT_SECRET}`,
        `refresh_token=${refreshToken}`,
        "grant_type=refresh_token",
      ].join("&"),
    }
  );

  return access_token;
};

const subscriptionSchema = z.object({
  snippet: z.object({
    title: z.string(),
    description: z.string(),
    resourceId: z.object({
      channelId: z.string(),
    }),
    thumbnails: z.object({
      default: z.object({ url: z.string() }),
      medium: z.object({ url: z.string() }),
      high: z.object({ url: z.string() }),
    }),
  }),
});

export const getSubscribedChannels = async (refreshToken: string) => {
  const accessToken = await refreshAccessToken(refreshToken);

  const channels: Array<z.infer<typeof subscriptionSchema>> = [];
  let pageToken: null | string | undefined = null;
  do {
    const {
      items,
      // @ts-expect-error ???
      nextPageToken,
    } = await call(
      `https://www.googleapis.com/youtube/v3/subscriptions?${new URLSearchParams(
        {
          mine: "true",
          part: "snippet,id",
          maxResults: "50",
          pageToken: pageToken ?? "",
        }
      ).toString()}`,
      z.object({
        pageInfo: z.object({
          totalResults: z.number(),
          resultsPerPage: z.number(),
        }),
        nextPageToken: z.string().optional(),
        items: z.array(subscriptionSchema),
      }),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    channels.push(...items);
    pageToken = nextPageToken;
  } while (pageToken);

  return channels;
};

export const getChannelVideos = async (channelId: string) => {
  const { items } = await call(
    `https://www.googleapis.com/youtube/v3/search?${new URLSearchParams({
      channelId,
      part: "snippet,id",
      maxResults: "50",
      order: "date",
      type: "video",
      key: process.env.GOOGLE_API_KEY!,
    }).toString()}`,
    z.object({
      pageInfo: z.object({
        totalResults: z.number(),
        resultsPerPage: z.number(),
      }),
      nextPageToken: z.string().optional(),
      items: z.array(
        z.object({
          id: z.object({ videoId: z.string() }),
          snippet: z.object({
            publishedAt: z.coerce.date(),
            title: z.string(),
            description: z.string(),
            thumbnails: z.object({
              default: z.object({ url: z.string() }),
              medium: z.object({ url: z.string() }),
              high: z.object({ url: z.string() }),
            }),
          }),
        })
      ),
    })
  );

  return items;
};
