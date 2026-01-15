import { globalStyle, style } from "@vanilla-extract/css";
import { theme } from "../../theme.css";

export const button = style({
  background: "white",
  color: theme.color.foreground.active,
  fontWeight: 500,
  fontSize: 14,
  lineHeight: 1,
  height: 36,
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  padding: "7px 12px",
  gap: 8,
  border: "1px solid #B1C9F1",
  boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
  borderRadius: 8,
  cursor: "pointer",
  transition: ".2s all",
  whiteSpace: "nowrap",
  textDecoration: "none",
  selectors: {
    "&:not(:disabled):hover": {
      borderColor: theme.color.foreground.hover,
      background: theme.color.background.hover,
    },
    "table &": {
      height: 24,
      width: 24,
      padding: 0,
    },
  },
  ":disabled": {
    cursor: "default",
    borderColor: theme.color.foreground.disabled,
    color: theme.color.foreground.disabled,
  },
});

export const label = style({
  selectors: {
    "table &": {
      display: "none",
    },
  },
});

globalStyle(`${button} .lucide`, {
  width: "1em",
  height: "1em",
});
