import { useEffect, useRef } from "react";
import { useMarkAsSeenMutation, useMarkAsUnseenMutation } from "../api";
import * as style from "./ItemDetails.css";
import { Button } from "../components/form/Button";

export type Item = {
  id: number;
  title: string;
  url: string;
  description: string | null;
  thumbnailUrl: string | null;
  publishedAt: Date;
  source: {
    name: string;
    thumbnailUrl: string | null;
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
    <div>
      <div className={style.source}>
        {item.source.thumbnailUrl && (
          <img
            loading="lazy"
            src={item.source.thumbnailUrl}
            className={style.sourceThumbnail}
          />
        )}
        {item.source.name} - {new Date(item.publishedAt).toLocaleDateString()}
      </div>
      <h2>{item.title}</h2>
      {item.thumbnailUrl && (
        <img loading="lazy" src={item.thumbnailUrl} className={style.image} />
      )}
      <div>{item.description}</div>

      <div className={style.actions}>
        <Button onClick={onPrevious}>Previous</Button>
        <Button onClick={onMarkAsUnseen}>Mark as unseen</Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
};
