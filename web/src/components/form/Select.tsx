import { useRef } from "react";
import * as style from "./Select.css";

type SelectProps<Value> = {
  label: string;
  value: Value | null;
  options: Array<Value>;
  option: {
    value: (option: Value) => string;
    label: (option: Value | null) => string;
  };
  onChange: (value: Value) => void;
};

export const Select = <Value,>({
  label,
  value,
  options,
  option,
  onChange,
}: SelectProps<Value>) => {
  const dropdown = useRef<HTMLDialogElement>(null);

  const open = () => {
    dropdown.current?.showModal();
  };
  const close = () => {
    dropdown.current?.close();
  };

  return (
    <>
      <label className={style.select}>
        <span className={style.label}>{label}</span>
        <button className={style.button} onClick={open}>
          {option.label(value)}
        </button>
      </label>
      <dialog ref={dropdown}>
        <ul>
          {options.map((opt) => (
            <li key={option.label(opt)}>{option.label(opt)}</li>
          ))}
        </ul>
      </dialog>
    </>
  );
};
