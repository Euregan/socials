import { it, expect, vi } from "vitest";
import { fetchFeed } from "./rss";

const mocks = vi.hoisted(() => {
  return {
    rssContent: vi.fn(),
  };
});

vi.mock(import("rss-parser"), () => {
  return {
    default: class Parser {
      async parseURL() {
        return {
          items: [
            {
              content: mocks.rssContent(),
            },
          ],
        };
      }
    },
  } as any;
});

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

  mocks.rssContent.mockReturnValue(
    `<![CDATA[<a href="https://www.smbc-comics.com/comic/fertile"><img src="https://www.smbc-comics.com/comics/1768948432-20260122.png" /><br /><br />Click here to go see the bonus panel!</a><p>Hovertext:<br/>Thank for the dense meals of carbohydrates and protein, offspring!</p><br />Today's News:<br />\n]]>`,
  );
  vi.stubGlobal("fetch", fetch);

  const feed = await fetchFeed("http://www.smbc-comics.com/rss.php");

  expect(fetch).toHaveBeenCalledTimes(3);
  expect(fetch).toHaveBeenCalledWith("http://www.smbc-comics.com/favicon.png");
  expect(fetch).toHaveBeenCalledWith("http://www.smbc-comics.com/favicon.jpg");
  expect(fetch).toHaveBeenCalledWith("http://www.smbc-comics.com/favicon.ico");

  expect(feed.thumbnail).toBe("http://www.smbc-comics.com/favicon.ico");
});

it("Properly parses an escaped item content starting with an image within a link", async () => {
  mocks.rssContent.mockReturnValue(
    `<![CDATA[<a href="https://www.smbc-comics.com/comic/fertile"><img src="https://www.smbc-comics.com/comics/1768948432-20260122.png" /><br /><br />Click here to go see the bonus panel!</a><p>Hovertext:<br/>Thank for the dense meals of carbohydrates and protein, offspring!</p><br />Today's News:<br />\n]]>`,
  );
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

it("Properly parses an item content starting with an image within a link", async () => {
  mocks.rssContent.mockReturnValue(
    `<img src="https://www.mothership.blog/content/images/2026/02/m7dRYp.png" alt="Why do cozy games keep asking us to work, and why does it feel so good?"><p>The word cozy has been worked very hard lately. It&#x2019;s an aesthetic, a lifestyle, a genre, a mood, a season, a personality trait. It&#x2019;s an oversized sweatshirt that&#x2019;s faded from too many washes. A hot mug of coffee or tea &#x2014; or maybe a joint &#x2014; warming your hands on a wintry day. It&#x2019;s the kind of quiet where no one expects anything from you, and you don&#x2019;t expect anything from yourself. It promises safety, softness, and time &#x2014; three things that are increasingly in short supply.</p><p>In video games, cozy means something else, sort of. Cozy is cleaning, tending, and loving a home that you&#x2019;d never be able to afford. It&#x2019;s paying rent at your leisure, not on the first of the month, because survival is never tethered to a work schedule or a paycheck. In cozy games, you always have money for creative projects and for building a life.</p><figure class="kg-card kg-image-card kg-card-hascaption"><img src="https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1055540/ss_a22817e259c4220cad0c25db315f417b6d3641b8.1920x1080.jpg?t=1755182478" class="kg-image" alt="Why do cozy games keep asking us to work, and why does it feel so good?" loading="lazy" width="1900" height="1080"><figcaption><span style="white-space: pre-wrap;">Image: </span><i><em class="italic" style="white-space: pre-wrap;">A Short Hike</em></i><span style="white-space: pre-wrap;"> (adamgryu) via Steam</span></figcaption></figure><p>Here, you can build abundance without overseers or deadlines. You have time to wing it. And no one demands your labor except you.</p><p>That framing is intentional, though the term &#x201C;cozy&#x201D; has been retroactively labeled on everything from <em>A Short Hike</em> to <em>Harvest Moon</em> to <em>The Sims</em>. In a recent <a href="https://www.ign.com/articles/stardew-valley-turns-10-the-big-concernedape-interview?ref=mothership.blog" rel="noreferrer">interview with IGN&apos;s Rebekah Valentine</a> marking the 10-year anniversary of <em>Stardew Valley</em> &#x2014; perhaps the game most responsible for mythologizing the modern micro-genre &#x2014; creator Eric Barone compared the game&#x2019;s allure to his own interest in<em> Harvest Moon</em>. &#x201C;Instead of going out on a huge adventure, you were at home,&#x201D; he said. &#x201C;It was domestic. It was just one little area, and just trying to go deep on that one area.&#x201D;</p><p>Usually away from violence, high stakes (for the most part), and competition, these games look toward the everyday: cooking, walking, meditating, caring for a home, hiking, cleaning, running a small business, building a dream life piece by piece. Sure, these games still revolve around progress and the accumulation of wealth and goods, but here, growth feels more personalized, internal. It&#x2019;s about acquiring resources, but developing them into something meaningful, and toward the ordinary life you want to live.</p><p>At their best, cozy games offer focus, creativity, space for self-expression, and the pursuit of creating without the tunnel vision of collecting capital. &#x201C;Cozy&#x201D; isn&#x2019;t a strict genre so much as a curated mood, a label claimed by developers and players to signal low stakes, safety and softness rather than mastery or challenge. They promise relief from daily pressure. That promise, though, carries a tension at the center of the gentle vibe.&#xA0;</p><p>To play cozy games is to relax. To play cozy games is also to work. It&#x2019;s a paradox.</p>`,
  );

  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation(() => {
      return {};
    }),
  );

  const feed = await fetchFeed("https://www.mothership.blog/latest/rss");

  expect(feed).toMatchObject({
    items: [
      {
        content: [
          "The word cozy has been worked very hard lately. It’s an aesthetic, a lifestyle, a genre, a mood, a season, a personality trait. It’s an oversized sweatshirt that’s faded from too many washes. A hot mug of coffee or tea — or maybe a joint — warming your hands on a wintry day. It’s the kind of quiet where no one expects anything from you, and you don’t expect anything from yourself. It promises safety, softness, and time — three things that are increasingly in short supply.",
          "",
          "In video games, cozy means something else, sort of. Cozy is cleaning, tending, and loving a home that you’d never be able to afford. It’s paying rent at your leisure, not on the first of the month, because survival is never tethered to a work schedule or a paycheck. In cozy games, you always have money for creative projects and for building a life.",
          "",
          "![Why do cozy games keep asking us to work, and why does it feel so good?](https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1055540/ss_a22817e259c4220cad0c25db315f417b6d3641b8.1920x1080.jpg?t=1755182478)",
          "",
          "Image: __A Short Hike_ (adamgryu) via Steam",
          "",
          "Here, you can build abundance without overseers or deadlines. You have time to wing it. And no one demands your labor except you.",
          "",
          "That framing is intentional, though the term “cozy” has been retroactively labeled on everything from _A Short Hike_ to _Harvest Moon_ to _The Sims_. In a recent [interview with IGN's Rebekah Valentine](https://www.ign.com/articles/stardew-valley-turns-10-the-big-concernedape-interview?ref=mothership.blog) marking the 10-year anniversary of _Stardew Valley_ — perhaps the game most responsible for mythologizing the modern micro-genre — creator Eric Barone compared the game’s allure to his own interest in _Harvest Moon_. “Instead of going out on a huge adventure, you were at home,” he said. “It was domestic. It was just one little area, and just trying to go deep on that one area.”",
          "",
          "Usually away from violence, high stakes (for the most part), and competition, these games look toward the everyday: cooking, walking, meditating, caring for a home, hiking, cleaning, running a small business, building a dream life piece by piece. Sure, these games still revolve around progress and the accumulation of wealth and goods, but here, growth feels more personalized, internal. It’s about acquiring resources, but developing them into something meaningful, and toward the ordinary life you want to live.",
          "",
          "At their best, cozy games offer focus, creativity, space for self-expression, and the pursuit of creating without the tunnel vision of collecting capital. “Cozy” isn’t a strict genre so much as a curated mood, a label claimed by developers and players to signal low stakes, safety and softness rather than mastery or challenge. They promise relief from daily pressure. That promise, though, carries a tension at the center of the gentle vibe. ",
          "",
          "To play cozy games is to relax. To play cozy games is also to work. It’s a paradox.",
        ].join("\n"),
        thumbnail:
          "https://www.mothership.blog/content/images/2026/02/m7dRYp.png",
      },
    ],
  });
});
