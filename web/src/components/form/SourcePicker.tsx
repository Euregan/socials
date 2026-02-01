import { useSources, type Source } from "../../hooks/useSources";
import { SourceThumbnail } from "../data/SourceThumbnail";
import { Select } from "./Select";

type SourcePickerProps = {
  sources: Array<Source>;
  onChange: (sources: Array<Source>) => void;
};

export const SourcePicker = ({
  sources: selectedSources,
  onChange,
}: SourcePickerProps) => {
  const { sources } = useSources();

  return (
    <Select
      label="Sources"
      searchable
      values={selectedSources}
      onChange={onChange}
      options={sources}
      option={{
        label: (source) => (source ? source.name : "Pick a source"),
        value: (source) => source.id.toString(),
        icon: (source) => <SourceThumbnail id={source.id} />,
      }}
    />
  );
};
