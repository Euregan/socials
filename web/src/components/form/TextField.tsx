import * as style from "./TextField.css";

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export const TextField = ({ label, value, onChange }: TextFieldProps) => (
  <label className={style.label}>
    {label}
    <input
      className={style.input}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </label>
);
