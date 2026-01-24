import { style } from "@vanilla-extract/css";
import { row, stack } from "../components/utilities.css";
import { theme } from "../theme.css";
import * as button from "../components/form/Button.css";

export const details = style([
  stack({ gap: "medium", verticalAlignment: "split" }),
]);

export const item = style([stack({ gap: "small" })]);

export const header = style([
  row({
    gap: "small",
    horizontalAlignment: "spread",
    verticalAlignment: "center",
  }),
  {
    vars: { [button.height]: "24px" },
  },
]);

export const source = style([row({ gap: "small" })]);

export const link = style({
  textDecoration: "none",
  color: theme.color.foreground.active,
});

export const content = style({});

export const sourceThumbnail = style({
  borderRadius: 4,
  overflow: "hidden",
  aspectRatio: "1/1",
  objectFit: "cover",
  height: "1lh",
});

export const image = style({
  borderRadius: 16,
  overflow: "hidden",
  objectFit: "cover",
  width: "50%",
  float: "left",
  marginRight: theme.spacing.medium,
  marginBottom: theme.spacing.small,

  ":last-child": {
    width: "100%",
    float: "none",
  },
});

export const actions = style([
  row({ horizontalAlignment: "right", gap: "medium" }),
]);
