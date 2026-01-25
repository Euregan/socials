import { style, styleVariants } from "@vanilla-extract/css";
import { row, stack } from "../utilities.css";
import { theme } from "../../theme.css";

export const container = style([stack({ gap: "small" })]);

export const label = style([
  {
    fontWeight: 500,
    fontSize: 14,
    lineHeight: 1,
    color: theme.color.foreground.default,
    cursor: "pointer",
  },
]);

const hints = style({
  fontWeight: 400,
  fontSize: "14px",
  lineHeight: 1,
});

export const error = style([
  hints,
  {
    color: theme.color.foreground.danger,
  },
]);

export const description = style([
  hints,
  {
    color: theme.color.foreground.subtle,
  },
]);

const baseInput = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing.small,
  padding: `${theme.spacing.medium} ${theme.spacing.large}`,
  border: theme.border.default,
  borderRadius: 8,
  background: "white",
  transition: "border-color .2s ease-out, background .2s ease-out",
});

export const input = styleVariants({
  default: [
    baseInput,
    {
      cursor: "pointer",
      ":hover": {
        borderColor: theme.color.foreground.active,
      },
    },
  ],
  error: [
    baseInput,
    {
      cursor: "pointer",
      borderColor: theme.color.foreground.danger,
      background: theme.color.background.danger,
    },
  ],
  uploadError: [
    baseInput,
    {
      borderColor: theme.color.foreground.danger,
      background: theme.color.background.danger,
    },
  ],
  externalError: [
    baseInput,
    {
      cursor: "pointer",
      borderColor: theme.color.foreground.danger,
      ":hover": {
        borderColor: theme.color.foreground.danger,
      },
    },
  ],
  dragging: [
    baseInput,
    {
      borderColor: theme.color.foreground.active,
      background: theme.color.background.hover,
    },
  ],
  filled: [
    baseInput,
    {
      alignItems: "stretch",
    },
  ],
});

export const icon = style({
  display: "flex",
  width: "40px",
  height: "40px",
  padding: "10px",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "50%",
  background: theme.color.background.hover,
  color: theme.color.foreground.active,
  fontSize: "20px",
  transition: "background .2s ease-out, color .2s ease-out",
  selectors: {
    [`.${input.error} &, .${input.uploadError} &`]: {
      color: theme.color.foreground.danger,
      background: theme.color.background.danger,
    },
    [`.${input.dragging} &`]: {
      background: theme.color.background.accent,
    },
  },
});

export const details = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: theme.spacing.small,
  color: theme.color.foreground.subtle,
  fontSize: "16px",
  fontWeight: 400,
  lineHeight: "24px",
  transition: "color .2s ease-out",
  selectors: {
    [`.${input.error} &, .${input.uploadError} &`]: {
      color: theme.color.foreground.danger,
    },
  },
});

export const rules = style({
  fontSize: "13px",
  lineHeight: "18px",
});

export const hidden = style({
  display: "none",
});

export const file = style({
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing.medium,
  selectors: {
    [`.${input.uploadError} &`]: {
      alignSelf: "stretch",
    },
  },
});

export const filename = style({
  color: theme.color.foreground.default,
  fontSize: "13px",
  fontWeight: 600,
  lineHeight: "18px",
});

export const filesize = style({
  color: theme.color.foreground.subtle,
  fontSize: "13px",
  fontWeight: 400,
  lineHeight: "18px",
});

export const actions = style([row({ gap: "small" })]);
