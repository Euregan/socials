import { recipe } from "@vanilla-extract/recipes";
import { theme } from "../theme.css";

export const stack = recipe({
  base: {
    display: "flex",
    flexDirection: "column",
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  variants: {
    gap: {
      small: { gap: theme.spacing.small },
      medium: { gap: theme.spacing.medium },
      large: { gap: theme.spacing.large },
    },
    verticalAlignement: {
      split: { justifyContent: "space-between" },
    },
  },
  defaultVariants: {
    gap: "medium",
  },
});

export const row = recipe({
  base: {
    display: "flex",
    flexDirection: "row",
  },
  variants: {
    gap: {
      small: { gap: theme.spacing.small },
      medium: { gap: theme.spacing.medium },
      large: { gap: theme.spacing.large },
    },
    verticalAlignement: {
      center: { alignItems: "center" },
      form: { alignItems: "flex-end" },
    },
    horizontalAlignement: {
      spread: { justifyContent: "space-between" },
      right: { justifyContent: "flex-end" },
    },
  },
  defaultVariants: {
    gap: "medium",
  },
});
