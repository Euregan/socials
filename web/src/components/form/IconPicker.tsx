import { Select } from "./Select";
import { DynamicIcon, dynamicIconImports } from "lucide-react/dynamic";

const iconToLabel = (icon: string) =>
  icon.replace(/^./, (match) => match.toUpperCase()).replace(/-/g, " ");

export const IconPicker = () => {
  return (
    <Select
      label="Icon"
      searchable
      options={
        Object.keys(dynamicIconImports) as Array<
          keyof typeof dynamicIconImports
        >
      }
      option={{
        label: (icon) => (icon ? iconToLabel(icon) : "Pick an icon"),
        value: (icon) => icon,
        icon: (icon) => <DynamicIcon name={icon} />,
      }}
    />
  );
};
