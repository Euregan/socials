import { style } from "@vanilla-extract/css";
import { theme } from "../../theme.css";
export { link } from "../navigation/Link.css";

export const markdown = style({});

export const bold = style({ fontWeight: 600 });

export const italic = style({});

export const strikethrough = style({ textDecorationLine: "line-through" });

export const blockquote = style({
  margin: 0,
  paddingLeft: theme.spacing.small,
  borderLeft: `2px solid ${theme.color.foreground.subtle}`,
});

export const image = style({
  width: "100%",
  borderRadius: 16,
});
