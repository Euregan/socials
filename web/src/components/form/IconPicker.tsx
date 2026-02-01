import { Select } from "./Select";
import { DynamicIcon, dynamicIconImports } from "lucide-react/dynamic";

export type Icon = keyof typeof dynamicIconImports;

const iconToLabel = (icon: Icon) =>
  icon.replace(/^./, (match) => match.toUpperCase()).replace(/-/g, " ");

type IconPickerProps = {
  icon: Icon | null;
  onChange: (icon: Icon) => void;
};

export const IconPicker = ({ icon, onChange }: IconPickerProps) => {
  return (
    <Select
      label="Icon"
      searchable
      value={icon}
      onChange={onChange}
      options={Object.keys(dynamicIconImports) as Array<Icon>}
      option={{
        label: (icon) => (icon ? iconToLabel(icon) : "Pick an icon"),
        value: (icon) => icon,
        icon: (icon) => <DynamicIcon name={icon} />,
      }}
    />
  );
};
