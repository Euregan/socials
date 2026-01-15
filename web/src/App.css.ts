import { globalStyle, style } from "@vanilla-extract/css";
import { theme } from "./theme.css";
import { stack } from "./components/utilities.css";

export const app = style({
  fontFamily: theme.font.main,
  color: theme.color.foreground.default,

  display: "grid",
  gridTemplateColumns: "60px auto",
  height: "100vh",
});

export const content = style([stack({ gap: "large" })]);

globalStyle("h1, h2, h3, h4, h5, h6", {
  margin: 0,
});

globalStyle("body", { margin: 0 });
