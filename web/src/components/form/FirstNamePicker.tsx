import * as style from "./FirstNamePicker.css";

type FirstNamePickerProps = {
  fullName: string;
  onPick: (firstName: string, lastName: string) => void;
};

export const FirstNamePicker = ({ fullName, onPick }: FirstNamePickerProps) => {
  const parts = fullName.split(" ");

  return (
    <div className={style.picker}>
      {parts.map((part, index) => (
        <span
          key={index}
          className={style.part}
          onClick={() =>
            onPick(
              parts.slice(0, index + 1).join(" "),
              parts.slice(index + 1).join(" ")
            )
          }
        >
          {part}
        </span>
      ))}
    </div>
  );
};
