import Parser from "rss-parser";

const rssParser = new Parser();

export const fetchFeed = async (url: string) => {
  const feed = await rssParser.parseURL(url);

  return feed;
};
