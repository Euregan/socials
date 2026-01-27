import { Plus, Rss, Settings, Volleyball, Youtube } from "lucide-react";
import { Button } from "../form/Button";
import { useMemo, useState, type ReactNode } from "react";
import { Modal } from "../container/Modal";
import { useSources } from "../../hooks/useSources";
import { NewSource } from "../../ui/NewSource";
import { Link, useLocation } from "wouter";
import { SourceThumbnail } from "../data/SourceThumbnail";
import type { SourceType } from "../../api";
import * as style from "./Menu.css";

const sourceIcons = {
  RSS: <Rss />,
  Youtube: <Youtube />,
} satisfies Record<SourceType, ReactNode>;

type SourceProps = {
  type: SourceType;
};

const Source = ({ type }: SourceProps) => {
  const { sources } = useSources();
  const [route] = useLocation();
  const sourceRoute = `/source/${type.toLocaleLowerCase()}`;
  const isSourceRoute = route.startsWith(sourceRoute);

  const allItems = useMemo(
    () =>
      sources
        .filter((source) => source.type === type)
        .sort((a, b) => a.name.localeCompare(b.name)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sources],
  );
  const filteredItems = useMemo(
    () => allItems.slice(0, isSourceRoute ? undefined : 3),
    [allItems, isSourceRoute],
  );

  return (
    <div className={style.sourceWrapper}>
      <Link
        className={style.sourceType}
        href={isSourceRoute ? "/" : sourceRoute}
      >
        {sourceIcons[type]}
      </Link>

      <div className={style.scrollableSources}>
        <ul className={style.sources[isSourceRoute ? "active" : "inactive"]}>
          {filteredItems.map((source) => (
            <li key={source.id} className={style.source}>
              <SourceThumbnail id={source.id} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const Menu = () => {
  const [newFeedModalOpen, setNewFeedModalOpen] = useState(false);

  return (
    <>
      <nav className={style.menu}>
        <Link href="/" className={style.link}>
          <Volleyball />
        </Link>

        <Button onClick={() => setNewFeedModalOpen(true)}>
          <Plus />
        </Button>

        <Source type="RSS" />
        <Source type="Youtube" />

        <div className={style.settings}>
          <Link href="/settings" className={style.link}>
            <Settings />
          </Link>
        </div>
      </nav>

      <Modal open={newFeedModalOpen} onClose={() => setNewFeedModalOpen(false)}>
        <NewSource />
      </Modal>
    </>
  );
};
