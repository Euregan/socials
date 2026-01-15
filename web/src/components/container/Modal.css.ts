import { style } from "@vanilla-extract/css";

export const modal = style({
  outline: "none",
  border: "none",
  maxHeight: "90vh",
  maxWidth: "90vw",
  boxShadow:
    "1px 1px 0px rgba(126, 138, 164, 0.05), 2px 4px 8px rgba(50, 62, 83, 0.08)",
  padding: 24,
  borderRadius: 8,
  overflow: "hidden",
  background: "white",

  selectors: {
    "&[open]": {
      display: "flex",
      flexDirection: "column",
      gap: 16,
    },
  },

  "::backdrop": {},
});
