import { style, keyframes } from "@vanilla-extract/css";
import { theme } from "../../theme.css";

const spinnerRotation = keyframes({
  "0%": {
    transform: "rotate(0deg)",
  },
  "100%": {
    transform: "rotate(360deg)",
  },
});

export const spinner = style({
  animation: `4s linear 0s infinite normal none running ${spinnerRotation}`,
});

const spinnerCircleRotation = keyframes({
  "0%": {
    strokeDasharray: "1px, 200px",
    strokeDashoffset: "0px",
  },
  "50%": {
    strokeDasharray: "100px, 200px",
    strokeDashoffset: "-15px",
  },
  "100%": {
    strokeDasharray: "100px, 200px",
    strokeDashoffset: "-125px",
  },
});

const circleBase = style({
  strokeWidth: 6,
});

export const spinnerCircle = style([
  circleBase,
  {
    strokeDasharray: "80px, 200px",
    strokeDashoffset: "0px",
    stroke: theme.color.foreground.active,
    animation: `1.6s ease-in-out 0s infinite normal none running ${spinnerCircleRotation}`,
  },
]);

export const backgroundCircle = style([
  circleBase,
  {
    stroke: theme.color.background.accent,
  },
]);
