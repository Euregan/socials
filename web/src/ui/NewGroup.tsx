import { Button } from "../components/form/Button";
import { Checkbox } from "../components/form/Checkbox";
import { IconPicker } from "../components/form/IconPicker";
import { TextField } from "../components/form/TextField";

export const NewGroup = () => {
  return (
    <form>
      <TextField label="Group name" />
      <IconPicker />
      <Checkbox label="Exclude from global view" />
      <Button>New group</Button>
    </form>
  );
};
