import { style } from "@vanilla-extract/css";
import { theme } from "../../theme.css";
import { row } from "../utilities.css";

export const label = style([
  row({ gap: "small", verticalAlignment: "center" }),
  { cursor: "pointer" },
]);

export const input = style({
  appearance: "none",
  margin: 0,

  width: 16,
  height: 16,

  borderRadius: 4,
  border: `1.5px solid ${theme.color.foreground.active}`,

  color: "white",
  background: "white",
  ":checked": {
    color: theme.color.foreground.active,
  },

  position: "relative",
  "::after": {
    content: "✓",
    display: "block",
    width: 14,
    height: 14,
    marginTop: -2,
    marginLeft: 2,
    fontWeight: 500,
  },
});
