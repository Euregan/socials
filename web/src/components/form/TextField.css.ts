import { createVar, fallbackVar, style } from "@vanilla-extract/css";
import { stack } from "../utilities.css";
import { theme } from "../../theme.css";

export const label = style([
  stack({ gap: "small" }),
  {
    fontWeight: 500,
    fontSize: 14,
    lineHeight: 1,
    color: theme.color.foreground.default,
    cursor: "pointer",
  },
]);

export const height = createVar();

export const input = style({
  color: theme.color.foreground.default,
  fontWeight: 400,
  boxSizing: "border-box",
  fontSize: 16,
  padding: "0 12px",
  height: fallbackVar(height, "36px"),
  background: "white",
  border: theme.border.default,
  borderRadius: 8,
  boxShadow: "0px 1px 2px 0px #1018280D",
  transition: ".2s all",
  ":focus-within": {
    borderColor: "#6AE1F5",
    outline: "none",
    boxShadow: "0px 0px 0px 4px #0064B81A",
  },
});
