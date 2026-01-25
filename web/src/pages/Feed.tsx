import { useState } from "react";
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

  const filteredItems = source
    ? items?.filter((item) => item.source.type === source)
    : items;

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
                onNext={() => {
                  const currentIndex = filteredItems?.findIndex(
                    (item) => item.id === selectedItem.id,
                  );
                  const nextItem =
                    currentIndex >= 0 ? filteredItems[currentIndex + 1] : null;
                  if (nextItem) {
                    setSelectedItem(nextItem);
                  }
                }}
                onPrevious={() => {
                  const currentIndex = filteredItems?.findIndex(
                    (item) => item.id === selectedItem.id,
                  );
                  const previousItem =
                    currentIndex >= 0 ? filteredItems[currentIndex - 1] : null;
                  if (previousItem) {
                    setSelectedItem(previousItem);
                  }
                }}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};
