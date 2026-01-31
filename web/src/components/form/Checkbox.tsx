import type { ReactNode } from "react";
import * as style from "./Checkbox.css";

type CheckboxProps = {
  label: ReactNode;
  checked: boolean;
  onChange?: (checked: boolean) => void;
};

export const Checkbox = ({ label, checked, onChange }: CheckboxProps) => (
  <label className={style.label}>
    <input
      type="checkbox"
      className={style.input}
      onChange={() => onChange?.(!checked)}
      checked={checked}
    />
    {label}
  </label>
);
