import { useState } from "react";
import { Button } from "../components/form/Button";
import { Checkbox } from "../components/form/Checkbox";
import { IconPicker, type Icon } from "../components/form/IconPicker";
import { TextField } from "../components/form/TextField";
import { stack } from "../components/utilities.css";
import { useCreateGroupMutation } from "../api";
import { SourcePicker } from "../components/form/SourcePicker";
import type { Source } from "../hooks/useSources";

type NewGroupProps = {
  onCreate: () => Promise<void>;
};

export const NewGroup = ({ onCreate }: NewGroupProps) => {
  const [name, setName] = useState("");
  const [icon, setIcon] = useState<null | Icon>(null);
  const [excludeFromGlobalView, setExcludeFromGlobalView] = useState(false);
  const [sources, setSources] = useState<Array<Source>>([]);

  const [createGroup] = useCreateGroupMutation(["id"]);

  return (
    <form className={stack()}>
      <TextField label="Group name" value={name} onChange={setName} />
      <IconPicker icon={icon} onChange={setIcon} />
      <Checkbox
        label="Exclude from global view"
        checked={excludeFromGlobalView}
        onChange={setExcludeFromGlobalView}
      />
      <SourcePicker sources={sources} onChange={setSources} />

      <Button
        onClick={async () => {
          await createGroup({
            name,
            icon: icon!,
            excludeFromGlobalView,
            // @ts-expect-error TODO: Fix enodia to infer the proper type here (an array)
            sourceIds: sources.map((source) => source.id),
          });

          setName("");
          setIcon(null);
          setExcludeFromGlobalView(false);
          setSources([]);

          await onCreate();
        }}
      >
        New group
      </Button>
    </form>
  );
};
