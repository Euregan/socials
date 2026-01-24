import { Plus, Rss } from "lucide-react";
import { Button } from "../form/Button";
import { useState } from "react";
import { Modal } from "../container/Modal";
import { NewSource } from "../../ui/NewSource";
import * as style from "./Menu.css";

export const Menu = () => {
  const [newFeedModalOpen, setNewFeedModalOpen] = useState(false);

  return (
    <>
      <nav className={style.menu}>
        <Button onClick={() => setNewFeedModalOpen(true)}>
          <Plus />
        </Button>
      </nav>

      <Modal open={newFeedModalOpen} onClose={() => setNewFeedModalOpen(false)}>
        <NewSource />
      </Modal>
    </>
  );
};
