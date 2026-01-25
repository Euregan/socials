import { useCallback, useEffect, useMemo, useState } from "react";
import { useUnseenQuery, type SourceType } from "../api";
import { ItemCard } from "../ui/ItemCard";
import { ItemDetails, type Item } from "../ui/ItemDetails";
import { useSources } from "../hooks/useSources";
import * as style from "./Feed.css";

type FeedProps = {
  source?: SourceType;
};

export const Feed = ({ source }: FeedProps) => {
  const [, , items] = useUnseenQuery([
    "id",
    "title",
    "description",
    "hasThumbnail",
    "url",
    "publishedAt",
    { source: ["id", "name", "hasThumbnail", "type"] },
  ]);

  const { loading, sources } = useSources();

  const [selectedItem, setSelectedItem] = useState<null | Item>(null);

  const filteredItems = useMemo(
    () =>
      source ? items?.filter((item) => item.source.type === source) : items,
    [items, source],
  );

  const previous = useCallback(() => {
    if (!filteredItems || !selectedItem) return;

    const currentIndex = filteredItems?.findIndex(
      (item) => item.id === selectedItem.id,
    );
    const previousItem =
      currentIndex >= 0 ? filteredItems[currentIndex - 1] : null;
    if (previousItem) {
      setSelectedItem(previousItem);
    }
  }, [filteredItems, selectedItem]);

  const next = useCallback(() => {
    if (!filteredItems) return;

    if (!selectedItem) {
      setSelectedItem(filteredItems[0]);
      return;
    }

    const currentIndex = filteredItems?.findIndex(
      (item) => item.id === selectedItem.id,
    );
    const nextItem = currentIndex >= 0 ? filteredItems[currentIndex + 1] : null;
    if (nextItem) {
      setSelectedItem(nextItem);
    }
  }, [filteredItems, selectedItem]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          event.stopPropagation();
          previous();
          break;
        case "ArrowDown":
          event.preventDefault();
          event.stopPropagation();
          next();
          break;
      }
    };

    document.addEventListener("keyup", handler);
    return () => document.removeEventListener("keyup", handler);
  }, [next, previous]);

  return (
    <div className={sources && sources.length === 0 ? style.empty : style.feed}>
      {!loading && sources.length === 0 && (
        <>Nothing here yet, but you can start by adding a source on the left!</>
      )}

      {sources.length > 0 && (
        <>
          <ul className={style.items}>
            {filteredItems?.map((item) => (
              <li key={item.id}>
                <ItemCard
                  item={item}
                  onClick={(event) => {
                    event.stopPropagation();
                    event.preventDefault();
                    setSelectedItem(item);
                  }}
                />
              </li>
            ))}
          </ul>

          <div className={style.details}>
            {selectedItem && filteredItems && (
              <ItemDetails
                item={selectedItem}
                onPrevious={previous}
                onNext={next}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};
