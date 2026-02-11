import { style, styleVariants } from "@vanilla-extract/css";
import { stack } from "../components/utilities.css";
import { theme } from "../theme.css";

const itemBase = style([
  stack({ gap: "small" }),
  {
    textDecoration: "none",
    color: theme.color.foreground.default,
    transition: "background .1s ease-out, color .2s ease-out",
    padding: theme.spacing.small,
    borderRadius: `calc(4px + ${theme.spacing.small})`,
    overflow: "hidden",
  },
]);
export const item = styleVariants({
  default: [itemBase],
  highlighted: [
    itemBase,
    {
      background: theme.color.foreground.active,
      color: "white",
    },
  ],
});

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
