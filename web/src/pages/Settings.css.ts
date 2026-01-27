import { style } from "@vanilla-extract/css";
import { row, stack } from "../components/utilities.css";
import { link as linkStyle } from "../components/navigation/Link.css";
import * as button from "../components/form/Button.css";

export const sources = style([
  stack({ gap: "medium" }),
  {
    overflow: "scroll",
  },
]);

export const source = style([
  row({ gap: "small" }),
  {
    vars: {
      [button.height]: "20px",
      [button.iconSize]: "12px",
    },
  },
]);

export const link = style([linkStyle, row({ gap: "small" })]);
