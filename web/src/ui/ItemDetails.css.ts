import { style } from "@vanilla-extract/css";
import { row, stack } from "../components/utilities.css";

export const details = style([
  stack({ gap: "medium", verticalAlignement: "split" }),
]);

export const content = style([stack({ gap: "small" })]);

export const source = style([row({ gap: "small" })]);

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
  // For some reason, there is a thin black line on Youtube thumbnails with a ratio of 16/9
  aspectRatio: "16/8.9",
  objectFit: "cover",
  width: "100%",
});

export const actions = style([
  row({ horizontalAlignement: "right", gap: "medium" }),
]);
