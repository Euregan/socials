import { style } from "@vanilla-extract/css";
import { stack } from "../components/utilities.css";
import { theme } from "../theme.css";

export const form = style([stack(), { maxWidth: 800, margin: "auto" }]);

export const actions = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: theme.spacing.medium,
});
