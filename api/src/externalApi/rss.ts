import { NodeHtmlMarkdown } from "node-html-markdown";
import Parser from "rss-parser";

const rssParser = new Parser();

export const fetchFeed = async (url: string) => {
  const feed = await rssParser.parseURL(url);

  return {
    ...feed,
    items: feed.items.map((item) => {
      const markdown = item.content
        ? NodeHtmlMarkdown.translate(item.content)
        : "";

      const thumbnail =
        markdown.match(/^!\[\]\((.+?)\)/)?.[1] ??
        markdown.match(/^\[!\[.+?\]\((.+?)\)\]\(.+?\)/)?.[1] ??
        null;

      return {
        ...item,
        content: markdown
          .replace(/^!\[\]\((.+?)\)/, "")
          .replace(/^\[!\[.+?\]\((.+?)\)\]\(.+?\)/, ""),
        thumbnail,
      };
    }),
  };
};
