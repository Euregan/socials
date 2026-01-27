import { createVar, style, styleVariants } from "@vanilla-extract/css";
import { stack } from "../utilities.css";
import { theme } from "../../theme.css";
import { button } from "../form/Button.css";

export const menu = style([
  stack({ gap: "large" }),
  {
    padding: theme.spacing.medium,
    borderRight: theme.border.default,
    boxShadow: "0px 1px 2px 0px #1018280D",
    height: "min(100%, 100vh)",
    boxSizing: "border-box",
    overflow: "hidden",
  },
]);

export const sourceWrapper = style({
  overflow: "hidden",
  minHeight: 36,
  width: 36,
});

export const scrollableSources = style({
  overflowY: "scroll",
  height: "100%",
});

export const sourceType = style([button, {}]);

export const sourcesHeight = createVar();

const sourcesBase = style({
  padding: 0,
  margin: 0,
  listStyle: "none",
  position: "relative",
});
export const sources = styleVariants({
  inactive: [sourcesBase, {}],
  active: [
    sourcesBase,
    stack({ gap: "small" }),
    {
      marginTop: theme.spacing.small,
      alignItems: "center",
      overflow: "hidden",
    },
  ],
});

export const source = style([
  {
    position: "absolute",
    zIndex: -1,
    top: -20,
    opacity: 0,
    overflow: "hidden",
    transition:
      "top 0.2s ease-out, opacity 0.2s ease-out, filter 0.2s ease-out",
    borderRadius: 4,
    width: "fit-content",
    left: 8,

    selectors: {
      [`${sourceType}:hover + ${sources.inactive} &`]: {
        opacity: 1,
      },
      [`${sourceType}:hover +  ${sources.inactive} &:nth-child(1)`]: {
        top: -12,
        zIndex: -1,
      },
      [`${sourceType}:hover +  ${sources.inactive} &:nth-child(2)`]: {
        top: -4,
        filter: "contrast(66%) brightness(133%)",
        zIndex: -2,
      },
      [`${sourceType}:hover +  ${sources.inactive} &:nth-child(3)`]: {
        top: 4,
        filter: "contrast(33%) brightness(166%)",
        zIndex: -3,
      },
      [`${sources.active} &`]: {
        opacity: 1,
        position: "initial",
      },
    },
  },
]);

export const settings = style([
  stack({ gap: "medium", verticalAlignment: "bottom" }),
  { flexGrow: 1 },
]);

export const link = button;
