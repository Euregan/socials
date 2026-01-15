import { style } from "@vanilla-extract/css";
import { row, stack } from "../utilities.css";
import { theme } from "../../theme.css";

export const menu = style([
  stack({ gap: "large" }),
  {
    padding: theme.spacing.medium,
    borderRight: theme.border.default,
    boxShadow: "0px 1px 2px 0px #1018280D",
  },
]);

export const edition = style([stack()]);

export const header = style({
  fontSize: "1em",
  color: theme.color.foreground.default,
  fontWeight: 500,
});

export const navigation = style([stack()]);

export const link = style([
  row({ horizontalAlignement: "spread" }),
  {
    textDecoration: "none",
    color: theme.color.foreground.active,
    ":hover": {
      color: theme.color.foreground.hover,
    },
  },
]);
