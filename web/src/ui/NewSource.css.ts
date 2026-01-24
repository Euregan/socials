import { style } from "@vanilla-extract/css";
import { row, stack } from "../components/utilities.css";
import { theme } from "../theme.css";

export { button } from "../components/form/Button.css";

export const section = style([stack({ gap: "medium" })]);

export const integrations = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(36px, 1fr))",
  gap: theme.spacing.medium,
});

export const actions = style([row({ horizontalAlignment: "right" })]);
