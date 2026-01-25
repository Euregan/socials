import * as style from "./SourceThumbnail.css";

type SourceThumbnailProps = {
  id: number;
};

export const SourceThumbnail = ({ id }: SourceThumbnailProps) => (
  <img
    loading="lazy"
    src={`${import.meta.env.VITE_API_URL}/thumbnail/source/${id}`}
    className={style.thumbnail}
  />
);
