import { useMemo, useState } from "react";
import type { SourceType } from "../api";
import { SourceThumbnail } from "../components/data/SourceThumbnail";
import { useSources } from "../hooks/useSources";
import { TextField } from "../components/form/TextField";
import { Button } from "../components/form/Button";
import { Trash2 } from "lucide-react";
import * as style from "./Settings.css";
import { useGroups } from "../hooks/useGroups";
import { NewGroup } from "../ui/NewGroup";

const sourceUrl = (source: { remoteId: string; type: SourceType }): string => {
  switch (source.type) {
    case "RSS":
      return source.remoteId;
    case "Youtube":
      return `https://www.youtube.com/channel/${source.remoteId}`;
  }
};

export const Settings = () => {
  const { sources, remove: removeSource } = useSources();
  const { groups, remove: removeGroup } = useGroups();

  const [filter, setFilter] = useState("");

  const filteredSources = useMemo(
    () =>
      sources
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter(
          (source) =>
            !filter ||
            source.name
              .toLocaleLowerCase()
              .includes(filter.toLocaleLowerCase()),
        ),
    [sources, filter],
  );

  return (
    <div className={style.settings}>
      <section className={style.section}>
        <h2>Sources</h2>
        <TextField label="Filter" value={filter} onChange={setFilter} />
        <ul className={style.sources}>
          {filteredSources.map((source) => (
            <li key={source.id} className={style.source}>
              <a
                href={sourceUrl(source)}
                target="_blank"
                className={style.link}
              >
                <SourceThumbnail id={source.id} />
                {source.name}
              </a>

              <Button onClick={() => removeSource(source.id)}>
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <section className={style.section}>
        <h2>Groups</h2>

        <NewGroup />

        <ul className={style.sources}>
          {groups.map((group) => (
            <li key={group.id} className={style.source}>
              {group.name}

              <Button onClick={() => removeSource(group.id)}>
                <Trash2 />
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
