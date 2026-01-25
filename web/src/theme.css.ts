import { createTheme, fontFace } from "@vanilla-extract/css";
import inter from "./assets/inter.ttf";

const mainFont = fontFace({
  src: `url(${inter})`,
});

export const [themeClass, theme] = createTheme({
  color: {
    foreground: {
      default: "#33415C",
      subtle: "#667185",
      active: "#0D54D1",
      hover: "#6E98E3",
      disabled: "#667185",
      danger: "#C2352B",
    },
    background: {
      hover: "#E7EEFA",
      danger: "#E7AEAA",
      accent: "#B1C9F1",
    },
  },
  font: {
    main: mainFont,
  },
  spacing: {
    small: "8px",
    medium: "16px",
    large: "24px",
  },
  border: {
    default: "1px solid #CCD0D6",
  },
});
