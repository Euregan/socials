import { useState } from "react";
import { useAddRssFeedMutation } from "../api";
import { TextField } from "../components/form/TextField";
import { Button } from "../components/form/Button";
import { Youtube } from "lucide-react";
import { useUser } from "../hooks/useUser";
import * as style from "./NewSource.css";
import { useSources } from "../hooks/useSources";

export const NewSource = () => {
  const { user } = useUser();

  const [addRssFeed] = useAddRssFeedMutation(["name"]);

  const [newRssFeedUrl, setNewRssFeedUrl] = useState("");

  const { sources } = useSources();

  return user ? (
    <>
      <form
        onSubmit={(event) => {
          event.stopPropagation();
          event.preventDefault();
          addRssFeed({ url: newRssFeedUrl });
        }}
        className={style.section}
      >
        <h2>Add new feed</h2>

        <TextField
          label="RSS URL"
          value={newRssFeedUrl}
          onChange={setNewRssFeedUrl}
        />

        <div className={style.actions}>
          <Button onClick={() => addRssFeed({ url: newRssFeedUrl })}>
            Add
          </Button>
        </div>
      </form>

      <section className={style.section}>
        <h2>Connect an integration</h2>

        <div className={style.integrations}>
          <a
            href={
              sources.some((source) => source.type === "Youtube")
                ? undefined
                : `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams(
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
                  )}`
            }
            className={style.button}
            aria-disabled={sources.some((source) => source.type === "Youtube")}
          >
            <Youtube />
          </a>
        </div>
      </section>
    </>
  ) : (
    <></>
  );
};
