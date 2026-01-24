import { style } from "@vanilla-extract/css";
import { theme } from "../../theme.css";

export const link = style({
  textDecoration: "none",
  color: theme.color.foreground.active,
  fontWeight: 600,
  ":hover": {
    color: theme.color.foreground.hover,
  },
});
