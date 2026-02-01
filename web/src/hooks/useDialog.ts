import { type RefObject, useEffect, useId, useState } from "react";
import { theme } from "../theme.css";

type UseDialogParameters = {
  anchor: RefObject<HTMLElement | null>;
  dialog: RefObject<HTMLDialogElement | null>;
  closeOnClick?: boolean;
};

export const useDialog = ({
  anchor,
  dialog,
  closeOnClick = true,
}: UseDialogParameters) => {
  const id = useId();

  const [dialogTop, setDialogTop] = useState("0px");
  const [dialogBottom, setDialogBottom] = useState("0px");
  const [dialogLeft, setDialogLeft] = useState("0px");
  const [dialogRight, setDialogRight] = useState("0px");

  const anchorName = `--${id}`;

  const updateDialogPosition = () => {
    if (anchor.current && dialog.current) {
      const anchorBoundingBox = anchor.current.getBoundingClientRect();

      const anchorPosition = {
        x: anchorBoundingBox.left + window.scrollX,
        y: anchorBoundingBox.bottom + window.scrollY,
      };

      setDialogTop(`calc(${anchorPosition.y}px + ${theme.spacing.small})`);
      setDialogBottom(
        `calc(100vh - ${anchorPosition.y - anchorBoundingBox.height}px + ${
          theme.spacing.small
        })`
      );
      setDialogLeft(`${anchorPosition.x}px`);
      setDialogRight(
        `calc(100vw - ${anchorPosition.x + anchorBoundingBox.width}px)`
      );
    }
  };

  useEffect(() => {
    updateDialogPosition();

    if (dialog.current) {
      const dialogElement = dialog.current;
      const handler = (event: MouseEvent) => {
        const rect = dialogElement.getBoundingClientRect();
        const isInDialog =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;

        if (!isInDialog) {
          event.preventDefault();
          event.stopPropagation();
        }

        if (!isInDialog || closeOnClick) {
          dialogElement.close();
        }
      };

      dialogElement.addEventListener("click", handler);

      return () => {
        dialogElement.removeEventListener("click", handler);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog]);

  return {
    anchorName,
    dialogTop,
    dialogBottom,
    dialogLeft,
    dialogRight,
  };
};
