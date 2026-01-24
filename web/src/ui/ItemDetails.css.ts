import { style } from "@vanilla-extract/css";
import { row, stack } from "../components/utilities.css";
import { theme } from "../theme.css";

export const details = style([
  stack({ gap: "medium", verticalAlignment: "split" }),
]);

export const item = style([stack({ gap: "small" })]);

export const source = style([row({ gap: "small" })]);

export const content = style({
  // display: "grid",
  // gridTemplateColumns: "1fr 1fr",
  // gap: theme.spacing.medium,
});

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
