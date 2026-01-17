import { Plus } from "lucide-react";
import { Button } from "../form/Button";
import * as style from "./Menu.css";
import { useState } from "react";
import { Modal } from "../container/Modal";
import { TextField } from "../form/TextField";
import { useAddRssFeedMutation } from "../../api";

export const Menu = () => {
  const [addRssFeed] = useAddRssFeedMutation(["name"]);

  const [newFeedModalOpen, setNewFeedModalOpen] = useState(false);
  const [newRssFeedUrl, setNewRssFeedUrl] = useState("");

  return (
    <>
      <nav className={style.menu}>
        <Button onClick={() => setNewFeedModalOpen(true)}>
          <Plus />
        </Button>
      </nav>
      <Modal open={newFeedModalOpen} onClose={() => setNewFeedModalOpen(false)}>
        <h2>Add new feed</h2>
        <form
          onSubmit={(event) => {
            event.stopPropagation();
            event.preventDefault();
            addRssFeed({ url: newRssFeedUrl });
          }}
        >
          <TextField
            label="RSS URL"
            value={newRssFeedUrl}
            onChange={setNewRssFeedUrl}
          />
          <Button onClick={() => addRssFeed({ url: newRssFeedUrl })}>
            Add
          </Button>
        </form>
      </Modal>
    </>
  );
};
