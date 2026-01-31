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
    "seenAt",
    {
      source: [
        "id",
        "name",
        "hasThumbnail",
        "type",
        { groups: ["id", "name", "excludeFromGlobalView"] },
      ],
    },
  ]);

  const { loading, sources } = useSources();

  const [selectedItem, setSelectedItem] = useState<null | Item>(null);

  const filteredItems = useMemo(
    () =>
      items?.filter(
        (item) =>
          (!source || item.source.type === source) &&
          !item.source.groups.some((group) => group.excludeFromGlobalView),
      ),
    [items, source],
  );
  const [displayedItems, setDisplayedItems] = useState(filteredItems);

  useEffect(() => {
    setDisplayedItems(filteredItems);
  }, [filteredItems]);

  const previous = useCallback(() => {
    if (!displayedItems || !selectedItem) return;

    const currentIndex = displayedItems?.findIndex(
      (item) => item.id === selectedItem.id,
    );
    const previousItem =
      currentIndex >= 0 ? displayedItems[currentIndex - 1] : null;
    if (previousItem) {
      setSelectedItem(previousItem);
    }
  }, [displayedItems, selectedItem]);

  const next = useCallback(() => {
    if (!displayedItems) return;

    if (!selectedItem) {
      setSelectedItem(displayedItems[0]);
      return;
    }

    const currentIndex = displayedItems?.findIndex(
      (item) => item.id === selectedItem.id,
    );
    const nextItem =
      currentIndex >= 0 ? displayedItems[currentIndex + 1] : null;
    if (nextItem) {
      setSelectedItem(nextItem);
    }
  }, [displayedItems, selectedItem]);

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
            {displayedItems?.map((item) => (
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
            {selectedItem && (
              <ItemDetails
                item={selectedItem}
                onPrevious={previous}
                onNext={next}
                onSeen={() => {
                  setDisplayedItems((items) =>
                    items?.map((item) =>
                      item.id === selectedItem.id
                        ? { ...item, seenAt: new Date() }
                        : item,
                    ),
                  );
                  setSelectedItem({ ...selectedItem, seenAt: new Date() });
                }}
                onUnseen={() => {
                  setDisplayedItems((items) =>
                    items?.map((item) =>
                      item.id === selectedItem.id
                        ? { ...item, seenAt: null }
                        : item,
                    ),
                  );
                  setSelectedItem({ ...selectedItem, seenAt: null });
                }}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};
