import { style, styleVariants } from "@vanilla-extract/css";
import { stack } from "../components/utilities.css";
import { theme } from "../theme.css";

export const item = style([
  stack({ gap: "small" }),
  { textDecoration: "none", color: theme.color.foreground.default },
]);

export const title = style({ fontSize: 16, fontWeight: 500 });

export const sourceThumbnail = style({
  borderRadius: 4,
  overflow: "hidden",
  aspectRatio: "1/1",
  objectFit: "cover",
  height: "1lh",

  float: "left",
  marginRight: "0.5ch",
});

const imageBase = style({
  borderRadius: 8,
  overflow: "hidden",
  // For some reason, there is a thin black line on Youtube thumbnails with a ratio of 16/9
  aspectRatio: "16/8.9",
  objectFit: "cover",
  width: "100%",
  transition: "filter .2s ease-out",
});

export const image = styleVariants({
  default: [imageBase],
  seen: [
    imageBase,
    {
      filter: "grayscale(1) contrast(80%) brightness(80%)",
    },
  ],
});
