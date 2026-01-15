import type { MouseEvent } from "react";
import * as style from "./ItemCard.css";

type ItemCardProps = {
  item: {
    url: string;
    title: string;
    thumbnailUrl: string | null;
    publishedAt: Date;
    source: {
      thumbnailUrl: string | null;
    };
  };
  onClick?: (event: MouseEvent) => void;
};

export const ItemCard = ({ item, onClick }: ItemCardProps) => (
  <a href={item.url} target="_blank" className={style.item} onClick={onClick}>
    <h2 className={style.title}>
      {item.source.thumbnailUrl && (
        <img
          loading="lazy"
          src={item.source.thumbnailUrl}
          className={style.sourceThumbnail}
        />
      )}{" "}
      {item.title} - {new Date(item.publishedAt).toLocaleDateString()}
    </h2>
    {item.thumbnailUrl && (
      <img loading="lazy" src={item.thumbnailUrl} className={style.image} />
    )}
  </a>
);
