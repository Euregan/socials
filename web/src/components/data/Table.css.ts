import { createVar, style } from "@vanilla-extract/css";
import { theme } from "../../theme.css";
import { row } from "../utilities.css";

export const columnCount = createVar();

export const table = style({
  border: theme.border.default,
  borderRadius: 8,

  display: "grid",
  gridTemplateColumns: `repeat(${columnCount}, auto)`,
  overflow: "hidden",
});

export const nil = style({
  display: "contents",
});

export const header = style({
  padding: theme.spacing.small,
  background: "#F2F3F5",
});

export const cell = style([
  row({ verticalAlignment: "center" }),
  {
    padding: theme.spacing.small,
    borderTop: theme.border.default,
  },
]);
