import * as style from "./TextField.css";

type TextFieldProps = {
  type?: "text" | "email" | "password" | "search";
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export const TextField = ({
  label,
  value,
  onChange,
  type = "text",
}: TextFieldProps) => (
  <label className={style.label}>
    {label}
    <input
      type={type}
      className={style.input}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </label>
);
