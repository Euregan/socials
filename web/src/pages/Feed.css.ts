import { style } from "@vanilla-extract/css";
import { theme } from "../theme.css";

export const feed = style({
  display: "grid",
  gridTemplateColumns: "1fr 4fr",
  gap: theme.spacing.large,
});

export const details = style({
  maxWidth: 800,
  margin: "0 auto",
});
