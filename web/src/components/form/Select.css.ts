import { globalStyle, style } from "@vanilla-extract/css";
import * as dialogStyle from "../../hooks/useDialog.css";
import * as textFieldStyle from "./TextField.css";
import { row, stack } from "../utilities.css";
import { theme } from "../../theme.css";

export const select = style({});

export const label = style({});

export const button = style([
  row({ verticalAlignment: "center", gap: "small" }),
  {
    background: "none",
    fontSize: 16,
    cursor: "pointer",
    height: 36,
    padding: "0 12px",
    border: theme.border.default,
    borderRadius: 8,
    boxSizing: "border-box",
    boxShadow: "0px 1px 2px 0px #1018280D",
  },
]);

export const anchorName = dialogStyle.anchorName;
export const dialogTop = dialogStyle.dialogTop;
export const dialogLeft = dialogStyle.dialogLeft;

export const dropdown = style([
  dialogStyle.dialog,
  {
    padding: 0,
    border: "none",
    "::backdrop": {
      opacity: 0,
    },

    boxShadow:
      "1px 1px 0px rgba(126, 138, 164, 0.05), 2px 4px 8px rgba(50, 62, 83, 0.08)",
    borderRadius: 8,

    vars: {
      [textFieldStyle.height]: "30px",
    },
  },
]);

export const search = style({
  margin: theme.spacing.small,
});

export const options = style([
  stack(),
  {
    gap: 0,
  },
]);

export const option = style([
  row({ gap: "small" }),
  {
    padding: "6px 16px",
    cursor: "pointer",
    fontSize: 14,

    ":hover": {
      background: theme.color.background.hover,
    },
  },
]);

globalStyle(`${option} .lucide`, {
  width: 14,
});
