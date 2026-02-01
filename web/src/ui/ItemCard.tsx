import type { MouseEvent } from "react";
import * as style from "./ItemCard.css";

type ItemCardProps = {
  item: {
    id: number;
    url: string;
    title: string;
    hasThumbnail: boolean;
    publishedAt: Date;
    seenAt: Date | null;
    source: {
      id: number;
      hasThumbnail: boolean;
    };
  };
  onClick?: (event: MouseEvent) => void;
  highlighted?: boolean;
};

export const ItemCard = ({
  item,
  onClick,
  highlighted = false,
}: ItemCardProps) => (
  <a
    href={item.url}
    target="_blank"
    className={highlighted ? style.item.highlighted : style.item.default}
    onClick={onClick}
  >
    <h2 className={style.title}>
      {item.source.hasThumbnail && (
        <img
          loading="lazy"
          src={`${import.meta.env.VITE_API_URL}/thumbnail/source/${
            item.source.id
          }`}
          className={style.sourceThumbnail}
        />
      )}
      {item.title}
    </h2>
    {item.hasThumbnail && (
      <img
        loading="lazy"
        src={`${import.meta.env.VITE_API_URL}/thumbnail/item/${item.id}`}
        className={item.seenAt ? style.image.seen : style.image.default}
      />
    )}
  </a>
);
