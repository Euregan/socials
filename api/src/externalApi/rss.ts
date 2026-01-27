import { NodeHtmlMarkdown } from "node-html-markdown";
import Parser from "rss-parser";

const rssParser = new Parser();

const getThumbnail = async (url: string) => {
  const origin = new URL(url).origin;

  const [png, jpg, ico] = await Promise.all([
    fetch(`${origin}/favicon.png`),
    fetch(`${origin}/favicon.jpg`),
    fetch(`${origin}/favicon.ico`),
  ]);

  return png.status === 200 &&
    png.headers.get("content-type")?.startsWith("image")
    ? `${origin}/favicon.png`
    : jpg.status === 200 && jpg.headers.get("content-type")?.startsWith("image")
      ? `${origin}/favicon.jpg`
      : ico.status === 200 &&
          ico.headers.get("content-type")?.startsWith("image")
        ? `${origin}/favicon.ico`
        : null;
};

export const fetchFeed = async (url: string) => {
  const feed = await rssParser.parseURL(url);

  return {
    ...feed,
    thumbnail: await getThumbnail(url),
    items: feed.items.map((item) => {
      const content = item["content:encoded"] ?? item.content;
      const markdown = content
        ? NodeHtmlMarkdown.translate(
            content.replace(/^\s*\<!\[CDATA\[(.*)\]\]\>\s*$/s, "$1"),
          )
        : "";

      const thumbnail =
        markdown.match(/^!\[\]\((.+?)\)/)?.[1] ??
        markdown.match(/^\[!\[.+?\]\((.+?)\)\]\(.+?\)/)?.[1] ??
        markdown.match(/^\[!\[\]\((.+?)\).*?\]\(.+?\)/)?.[1] ??
        null;

      return {
        ...item,
        content: markdown
          .replace(/^!\[\]\((.+?)\)/, "")
          .replace(/^\[!\[.+?\]\((.+?)\)\]\(.+?\)/, "")
          .replace(/^\[!\[\]\((.+?)\).*?\]\(.+?\)/, "")
          .replace(/^\s+/, ""),
        thumbnail,
      };
    }),
  };
};
