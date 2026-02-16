import * as style from "./Markdown.css";

type MarkdownProps = {
  children: string;
};

export const Markdown = ({ children }: MarkdownProps) => (
  <div
    className={style.markdown}
    dangerouslySetInnerHTML={{
      __html: children
        .replace(
          /(>.*?)\n[^>]/gs,
          (match) =>
            `<blockquote class="${style.blockquote}">${match.replace(/(\n|^)>/g, "\n").trim()}</blockquote><br/>`,
        )
        .replace(/~~(.+?)~~/g, `<span class="${style.strikethrough}">$1</span>`)
        .replace(/\*\*(.+?)\*\*/g, `<strong class="${style.bold}">$1</strong>`)
        .replace(
          /!\[(.*?)\]\((.+?)\)/gs,
          `<img class="${style.image}" alt="$1" src="$2"/>`,
        )
        .replace(
          /(?![^<>]*>)(_(.+?)_)/gm,
          `<em class="${style.italic}">$2</em>`,
        )
        .replace(
          /\[(.+?)\]\((.+?)\)/g,
          `<a class="${style.link}" href="$2" target="_blank">$1</a>`,
        )
        .replace(/\n/g, "<br/>")
        .replace(/\\\[/g, "[")
        .replace(/\\\]/g, "]"),
    }}
  />
);
