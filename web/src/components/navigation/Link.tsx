import { Link as WouterLink } from "wouter";
import * as style from "./Link.css";

type LinkProps = {
  to: string;
  children: string;
};

export const Link = ({ to, children }: LinkProps) => (
  <WouterLink href={to} className={style.link}>
    {children}
  </WouterLink>
);
