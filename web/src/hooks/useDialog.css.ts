import { createVar, style } from "@vanilla-extract/css";
import { theme } from "../theme.css";

export const anchorName = createVar();

export const dialogTop = createVar();
export const dialogBottom = createVar();
export const dialogLeft = createVar();
export const dialogRight = createVar();

export const anchor = style({
  anchorName: anchorName,
});

export const dialog = style({
  transitionBehavior: "allow-discrete",
  opacity: 0,

  vars: {
    [dialogTop]: "auto",
    [dialogBottom]: "auto",
    [dialogLeft]: "auto",
    [dialogRight]: "auto",
  },

  selectors: {
    "&[open]": {
      zIndex: 1,
      opacity: 1,
    },
    "table &": {
      // The anchor positioning does not work with virtualized tables because of the tr tranformations
      marginTop: dialogTop,
      marginBottom: dialogBottom,
      marginLeft: dialogLeft,
      marginRight: dialogRight,
    },
  },

  "@supports": {
    [`(position-anchor: ${anchorName})`]: {
      selectors: {
        // The anchor positioning does not work with virtualized tables because of the tr tranformations
        "&:not(table *)": {
          positionAnchor: anchorName,
          positionArea: "bottom span-right",
          positionTryFallbacks:
            "bottom span-right, bottom span-left, top span-right, top span-left",
          width: "max-content",
          maxWidth: "max-content",
          // We override the default <dialog> margins
          margin: 0,
          // We add some distance between the dialog and the anchor
          marginTop: theme.spacing.small,
          marginBottom: theme.spacing.small,
        },
      },
    },
    [`not (position-anchor: ${anchorName})`]: {
      // Manual positioning for Firefox & Safari
      marginTop: dialogTop,
      marginBottom: dialogBottom,
      marginLeft: dialogLeft,
      marginRight: dialogRight,
    },
  },
});
