import { style } from "@vanilla-extract/css";
import { row } from "../utilities.css";
import { input } from "./TextField.css";
import { theme } from "../../theme.css";

export const picker = style([
  input,
  row({ verticalAlignment: "center" }),
  { gap: 0 },
]);

export const part = style({
  cursor: "pointer",
  padding: "2px 4px",
  ":first-child": {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  ":hover": {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  selectors: {
    "&:hover, &:has(~ *:hover)": {
      color: theme.color.foreground.hover,
      background: theme.color.background.hover,
    },
  },
});
