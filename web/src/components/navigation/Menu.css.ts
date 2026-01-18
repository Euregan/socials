import { style } from "@vanilla-extract/css";
import { stack } from "../utilities.css";
import { theme } from "../../theme.css";
export { button } from "../form/Button.css";

export const menu = style([
  stack({ gap: "large" }),
  {
    padding: theme.spacing.medium,
    borderRight: theme.border.default,
    boxShadow: "0px 1px 2px 0px #1018280D",
    height: "100%",
    overflow: "auto",
  },
]);

export const integration = style([
  stack({ gap: "small", horizontalAlignment: "center" }),
]);
