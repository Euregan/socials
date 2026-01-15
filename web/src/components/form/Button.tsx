import { useState } from "react";
import * as style from "./Button.css";
import type { LucideProps } from "lucide-react";

type ButtonProps = {
  children: string;
  onClick: () => unknown | Promise<unknown>;
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
};

export const Button = ({ children, onClick, icon: Icon }: ButtonProps) => {
  const [loading, setLoading] = useState(false);

  return (
    <button
      className={style.button}
      onClick={async () => {
        setLoading(true);
        await onClick();
        setLoading(false);
      }}
      disabled={loading}
    >
      {!loading && <span className={style.label}>{children}</span>}
      {!loading && Icon && <Icon />}
      {loading && "loading"}
    </button>
  );
};
