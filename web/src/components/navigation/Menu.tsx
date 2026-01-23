import { Plus, Rss } from "lucide-react";
import { Button } from "../form/Button";
import { useState } from "react";
import { Modal } from "../container/Modal";
import { TextField } from "../form/TextField";
import { useAddRssFeedMutation } from "../../api";
import * as style from "./Menu.css";
import { SiYoutube } from "@icons-pack/react-simple-icons";
import { useSources } from "../../hooks/useSources";
import { useUser } from "../../hooks/useUser";

export const Menu = () => {
  const [addRssFeed] = useAddRssFeedMutation(["name"]);

  const [newFeedModalOpen, setNewFeedModalOpen] = useState(false);
  const [newRssFeedUrl, setNewRssFeedUrl] = useState("");

  const { loading, sources } = useSources();

  const { user } = useUser();

  return (
    <>
      <nav className={style.menu}>
        <div className={style.integration}>
          <Rss />
          <Button onClick={() => setNewFeedModalOpen(true)}>
            <Plus />
          </Button>
        </div>

        <div className={style.integration}>
          <SiYoutube />
          {!loading &&
            !sources.some((source) => source.type === "Youtube") &&
            user && (
              <a
                href={`https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(
                  {
                    scope: [
                      "openid",
                      "profile",
                      "email",
                      "https://www.googleapis.com/auth/youtube.readonly",
                    ].join(" "),
                    access_type: "offline",
                    include_granted_scopes: "true",
                    response_type: "code",
                    redirect_uri: `${import.meta.env.VITE_API_URL}/google/auth`,
                    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                    state: user.id.toString(),
                  },
                )}`}
                className={style.button}
              >
                <Plus />
              </a>
            )}
        </div>
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
