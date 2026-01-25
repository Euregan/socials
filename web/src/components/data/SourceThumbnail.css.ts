import { style } from "@vanilla-extract/css";

export const thumbnail = style({
  borderRadius: 4,
  overflow: "hidden",
  aspectRatio: "1/1",
  objectFit: "cover",
  height: "1lh",

  float: "left",
});
