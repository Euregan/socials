import { globalStyle, style } from "@vanilla-extract/css";
import { theme } from "./theme.css";
import { stack } from "./components/utilities.css";

export const app = style({
  fontFamily: theme.font.main,
  color: theme.color.foreground.default,

  display: "grid",
  gridTemplateColumns: `calc(36px + 2 * ${theme.spacing.medium}) auto`,
  height: "100vh",
});

export const unauthentified = style([
  stack({ horizontalAlignment: "center" }),
  { width: "100vw" },
]);

export const content = style([
  stack({ gap: "large" }),
  {
    padding: theme.spacing.large,
    maxHeight: "100vh",
    boxSizing: "border-box",
    overflow: "hidden",
  },
]);

globalStyle("h1, h2, h3, h4, h5, h6", {
  margin: 0,
});

globalStyle("body", { margin: 0 });

globalStyle("h2", {
  fontWeight: 500,
});
