import { style } from "@vanilla-extract/css";
import { theme } from "../theme.css";
import { stack } from "../components/utilities.css";

export const empty = style({
  height: "100%",
  textAlign: "center",
  maxWidth: 800,
  margin: "auto",
  fontSize: 18,
});

export const feed = style({
  display: "grid",
  gridTemplateColumns: "300px auto",
  gap: theme.spacing.large,
  height: "100%",
  overflow: "hidden",
});

export const items = style([
  stack(),
  {
    height: "100%",
    overflow: "auto",
    // Small hack to keep the scrollbar away from the content
    paddingRight: `calc(${theme.spacing.large} / 2)`,
    marginRight: `calc(${theme.spacing.large} / -2)`,
    gap: `calc(${theme.spacing.large} - 2 * ${theme.spacing.small})`,
  },
]);

export const details = style({
  maxWidth: 800,
  margin: "0 auto",
  width: "100%",
});
