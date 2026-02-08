import { style } from "@vanilla-extract/css";
import { theme } from "../theme.css";
import { row, stack } from "../components/utilities.css";
import * as button from "../components/form/Button.css";

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

export const itemsWrapper = style([
  stack(),
  {
    height: "100%",
    overflow: "hidden",
  },
]);

export const actions = style([
  row({ horizontalAlignment: "spread" }),
  {
    vars: { [button.height]: "24px", [button.iconSize]: "16px" },
  },
]);

export const items = style([
  stack(),
  {
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
