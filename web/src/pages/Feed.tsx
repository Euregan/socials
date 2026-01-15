import { useState } from "react";
import { useUnseenQuery } from "../api";
import { stack } from "../components/utilities.css";
import { ItemCard } from "../ui/ItemCard";
import { ItemDetails, type Item } from "../ui/ItemDetails";
import * as style from "./Feed.css";

export const Feed = () => {
  const [loading, error, items] = useUnseenQuery([
    "id",
    "title",
    "description",
    "thumbnailUrl",
    "url",
    "publishedAt",
    { source: ["id", "name", "thumbnailUrl"] },
  ]);

  const [selectedItem, setSelectedItem] = useState<null | Item>(null);

  return (
    <div className={style.feed}>
      <ul className={stack({ gap: "large" })}>
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
              const nextItem = currentIndex ? items[currentIndex + 1] : null;
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
    </div>
  );
};
