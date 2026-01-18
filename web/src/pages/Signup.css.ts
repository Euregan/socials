import { style } from "@vanilla-extract/css";
import { stack } from "../components/utilities.css";

export const form = style([stack(), { maxWidth: 800, margin: "auto" }]);
