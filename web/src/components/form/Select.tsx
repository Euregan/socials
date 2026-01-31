import { useRef, useState, type ReactNode } from "react";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { ChevronDown } from "lucide-react";
import { useDialog } from "../../hooks/useDialog";
import { Checkbox } from "./Checkbox";
import { TextField } from "./TextField";
import * as style from "./Select.css";

type SelectProps<Value> = {
  label: string;
  value: Value;
  options: Array<Value>;
  option: {
    value: (option: Value) => string;
    label: (option: Value) => string;
    icon?: (option: Value) => ReactNode;
  };
  onChange: (value: Value) => void;
  searchable?: boolean;
};

export const Select = <Value,>({
  label,
  value,
  options,
  option,
  onChange,
  searchable = false,
}: SelectProps<Value>) => {
  const button = useRef<HTMLButtonElement>(null);
  const dropdown = useRef<HTMLDialogElement>(null);

  const [search, setSearch] = useState("");

  const { anchorName, dialogTop, dialogLeft } = useDialog({
    anchor: button,
    dialog: dropdown,
    closeOnClick: false,
  });

  return (
    <>
      <label className={style.select}>
        <span className={style.label}>{label}</span>
        <button
          type="button"
          className={style.button}
          ref={button}
          onClick={() => dropdown.current?.showModal()}
        >
          {option.label(value)}
          <ChevronDown />
        </button>
      </label>

      <dialog
        ref={dropdown}
        className={style.dropdown}
        style={assignInlineVars({
          [style.anchorName]: anchorName,
          [style.dialogTop]: dialogTop,
          [style.dialogLeft]: dialogLeft,
        })}
      >
        {searchable && (
          <TextField
            label="Search"
            type="search"
            onChange={setSearch}
            value={search}
          />
        )}

        <ul className={style.options}>
          {options
            .filter(
              (opt) =>
                !searchable ||
                option
                  .label(opt)
                  .toLocaleLowerCase()
                  .includes(search.toLocaleLowerCase()),
            )
            .map((opt) => (
              <li
                key={option.value(opt)}
                role="option"
                value={option.value(opt)}
                className={style.option}
                onClick={() => {
                  onChange(opt);
                  dropdown.current?.close();
                }}
              >
                <Checkbox
                  label={
                    <>
                      {option.icon && option.icon(opt)}
                      {option.label(opt)}
                    </>
                  }
                  checked={option.value(value) === option.value(opt)}
                />
              </li>
            ))}
        </ul>
      </dialog>
    </>
  );
};
