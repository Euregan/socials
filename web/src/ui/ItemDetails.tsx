import { useEffect, useRef } from "react";
import { useMarkAsSeenMutation, useMarkAsUnseenMutation } from "../api";
import * as style from "./ItemDetails.css";
import { Button } from "../components/form/Button";
import { Markdown } from "../components/data/Markdown";

export type Item = {
  id: number;
  title: string;
  url: string;
  description: string | null;
  hasThumbnail: boolean;
  publishedAt: Date;
  source: {
    id: number;
    name: string;
    hasThumbnail: boolean;
  };
};

type ItemDetailsProps = {
  item: Item;
  onPrevious: () => void;
  onNext: () => void;
};

export const ItemDetails = ({ item, onPrevious, onNext }: ItemDetailsProps) => {
  const [markAsSeen] = useMarkAsSeenMutation(["seenAt"]);
  const [markAsUnseen] = useMarkAsUnseenMutation(["id"]);
  const markingAsSeen = useRef<null | Promise<unknown>>(null);

  useEffect(() => {
    markingAsSeen.current = markAsSeen({ itemId: item.id, seenAt: new Date() });
  }, [item.id]);

  const onMarkAsUnseen = async () => {
    await markingAsSeen.current;
    await markAsUnseen({ itemId: item.id });
  };

  return (
    <div className={style.details}>
      <div className={style.item}>
        <div className={style.source}>
          {item.source.hasThumbnail && (
            <img
              loading="lazy"
              src={`${import.meta.env.VITE_API_URL}/thumbnail/source/${item.source.id}`}
              className={style.sourceThumbnail}
            />
          )}
          {item.source.name} - {new Date(item.publishedAt).toLocaleDateString()}
        </div>
        <h2>{item.title}</h2>

        <div className={style.content}>
          {item.hasThumbnail && (
            <img
              loading="lazy"
              src={`${import.meta.env.VITE_API_URL}/thumbnail/item/${item.id}`}
              className={style.image}
            />
          )}
          {item.description && <Markdown>{item.description}</Markdown>}
        </div>
      </div>

      <div className={style.actions}>
        <Button onClick={onPrevious}>Previous</Button>
        <Button onClick={onMarkAsUnseen}>Mark as unseen</Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
};
