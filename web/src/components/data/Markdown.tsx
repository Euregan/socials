import * as style from "./Markdown.css";

type MarkdownProps = {
  children: string;
};

export const Markdown = ({ children }: MarkdownProps) => (
  <div
    className={style.markdown}
    dangerouslySetInnerHTML={{
      __html: children
        .replace(/\n/g, "<br/>")
        .replace(/_(.+?)_/g, `<em class="${style.italic}">$1</em>`)
        .replace(/\*\*(.+?)\*\*/g, `<strong class="${style.bold}">$1</strong>`)
        .replace(
          /\[(.+?)\]\((.+?)\)/g,
          `<a class="${style.link}" href="$2" target="_blank">$1</a>`,
        )
        .replace(/!\[\]\((.+?)\)/g, `<img class="${style.image}" src="$1"/>`),
    }}
  />
);
