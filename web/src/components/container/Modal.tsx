import { useEffect, useRef, type ReactNode } from "react";
import * as style from "./Modal.css";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({ open, onClose, children }: ModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [open]);

  return (
    <dialog ref={ref} className={style.modal} onClose={onClose}>
      {children}
    </dialog>
  );
};
