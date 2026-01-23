import { useYoutubeChannelsQuery } from "../api";

export const Admin = () => {
  const [, , channels] = useYoutubeChannelsQuery(["id", "name", "remoteId"]);

  return (
    <>
      <h2>Youtube channels</h2>
      <ul>
        {channels &&
          channels.map((channel) => (
            <li key={channel.id}>
              {channel.name}{" "}
              <a
                href={`https://pubsubhubbub.appspot.com/subscription-details?hub.callback=${encodeURI(
                  import.meta.env.VITE_API_URL + "/api/webhook/youtube",
                )}&hub.topic=${encodeURI(
                  `https://www.youtube.com/xml/feeds/videos.xml?channel_id=${channel.remoteId}`,
                )}&hub.secret=`}
                target="_blank"
              >
                status
              </a>
            </li>
          ))}
      </ul>
    </>
  );
};
