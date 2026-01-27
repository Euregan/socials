import { useMemo, useState } from "react";
import type { SourceType } from "../api";
import { SourceThumbnail } from "../components/data/SourceThumbnail";
import { useSources } from "../hooks/useSources";
import { TextField } from "../components/form/TextField";
import { Button } from "../components/form/Button";
import { Trash2 } from "lucide-react";
import * as style from "./Settings.css";

const sourceUrl = (source: { remoteId: string; type: SourceType }): string => {
  switch (source.type) {
    case "RSS":
      return source.remoteId;
    case "Youtube":
      return `https://www.youtube.com/channel/${source.remoteId}`;
  }
};

export const Settings = () => {
  const { sources, remove } = useSources();

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
    <>
      <h2>Sources</h2>
      <TextField label="Filter" value={filter} onChange={setFilter} />
      <ul className={style.sources}>
        {filteredSources.map((source) => (
          <li key={source.id} className={style.source}>
            <a href={sourceUrl(source)} target="_blank" className={style.link}>
              <SourceThumbnail id={source.id} />
              {source.name}
            </a>

            <Button onClick={() => remove(source.id)}>
              <Trash2 />
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
};
