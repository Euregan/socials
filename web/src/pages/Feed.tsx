import { useState } from "react";
import { useUnseenQuery } from "../api";
import { ItemCard } from "../ui/ItemCard";
import { ItemDetails, type Item } from "../ui/ItemDetails";
import * as style from "./Feed.css";
import { useSources } from "../hooks/useSources";

export const Feed = () => {
  const [, , items] = useUnseenQuery([
    "id",
    "title",
    "description",
    "thumbnailUrl",
    "url",
    "publishedAt",
    { source: ["id", "name", "thumbnailUrl"] },
  ]);

  const { loading, sources } = useSources();

  const [selectedItem, setSelectedItem] = useState<null | Item>(null);

  return (
    <div className={sources && sources.length === 0 ? style.empty : style.feed}>
      {!loading && sources.length === 0 && (
        <>Nothing here yet, but you can start by adding a source on the left!</>
      )}

      {sources.length > 0 && (
        <>
          <ul className={style.items}>
            {items?.map((item) => (
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
            {selectedItem && items && (
              <ItemDetails
                item={selectedItem}
                onNext={() => {
                  const currentIndex = items?.findIndex(
                    (item) => item.id === selectedItem.id
                  );
                  const nextItem = currentIndex
                    ? items[currentIndex + 1]
                    : null;
                  if (nextItem) {
                    setSelectedItem(nextItem);
                  }
                }}
                onPrevious={() => {
                  const currentIndex = items?.findIndex(
                    (item) => item.id === selectedItem.id
                  );
                  const previousItem = currentIndex
                    ? items[currentIndex - 1]
                    : null;
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
