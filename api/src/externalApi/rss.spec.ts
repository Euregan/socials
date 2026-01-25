import { it, expect, vi } from "vitest";
import { fetchFeed } from "./rss";

it("Properly parses the favicon", async () => {
  const fetch = vi.fn().mockImplementation((url: string) => {
    switch (url) {
      case "http://www.smbc-comics.com/favicon.png":
        return {
          status: 200,
          headers: { get: () => "text/html; charset=UTF-8" },
        };
      case "http://www.smbc-comics.com/favicon.jpg":
        return {
          status: 200,
          headers: { get: () => "text/html; charset=UTF-8" },
        };
      case "http://www.smbc-comics.com/favicon.ico":
        return {
          status: 200,
          headers: { get: () => "image/vnd.microsoft.icon" },
        };
    }
  });

  vi.stubGlobal("fetch", fetch);
  vi.mock(import("rss-parser"), () => {
    return {
      default: class Parser {
        async parseURL() {
          return {
            items: [
              {
                content: `<![CDATA[<a href="https://www.smbc-comics.com/comic/fertile"><img src="https://www.smbc-comics.com/comics/1768948432-20260122.png" /><br /><br />Click here to go see the bonus panel!</a><p>Hovertext:<br/>Thank for the dense meals of carbohydrates and protein, offspring!</p><br />Today's News:<br />\n]]>`,
              },
            ],
          };
        }
      },
    } as any;
  });

  const feed = await fetchFeed("http://www.smbc-comics.com/rss.php");

  expect(fetch).toHaveBeenCalledTimes(3);
  expect(fetch).toHaveBeenCalledWith("http://www.smbc-comics.com/favicon.png");
  expect(fetch).toHaveBeenCalledWith("http://www.smbc-comics.com/favicon.jpg");
  expect(fetch).toHaveBeenCalledWith("http://www.smbc-comics.com/favicon.ico");

  expect(feed.thumbnail).toBe("http://www.smbc-comics.com/favicon.ico");
});

it("Properly parses a item content sarting with an image within a link", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation((url: string) => {
      switch (url) {
        case "http://www.smbc-comics.com/favicon.png":
          return {};
        case "http://www.smbc-comics.com/favicon.jpg":
          return {};
        case "http://www.smbc-comics.com/favicon.ico":
          return {};
      }
    }),
  );
  vi.mock(import("rss-parser"), () => {
    return {
      default: class Parser {
        async parseURL() {
          return {
            items: [
              {
                content: `<![CDATA[<a href="https://www.smbc-comics.com/comic/fertile"><img src="https://www.smbc-comics.com/comics/1768948432-20260122.png" /><br /><br />Click here to go see the bonus panel!</a><p>Hovertext:<br/>Thank for the dense meals of carbohydrates and protein, offspring!</p><br />Today's News:<br />\n]]>`,
              },
            ],
          };
        }
      },
    } as any;
  });

  const feed = await fetchFeed("http://www.smbc-comics.com/rss.php");

  expect(feed).toMatchObject({
    items: [
      {
        content:
          "Hovertext:  \nThank for the dense meals of carbohydrates and protein, offspring!\n\n  \nToday's News:  ",
        thumbnail: "https://www.smbc-comics.com/comics/1768948432-20260122.png",
      },
    ],
  });
});
