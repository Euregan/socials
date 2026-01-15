import * as style from "./Checkbox.css";

type CheckboxProps = {
  label: string;
};

export const Checkbox = ({ label }: CheckboxProps) => (
  <label className={style.label}>
    <input type="checkbox" className={style.input} />
    {label}
  </label>
);
