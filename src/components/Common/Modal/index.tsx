import React, { Dispatch, FC, PropsWithChildren, SetStateAction, useEffect } from "react";
import ModalHeader from "./ModalHeader";
import "./modal.css";

export interface ModalProps {
  active: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
  onClose?: () => void; 
  title?: string;
}

export const Modal: FC<PropsWithChildren<ModalProps>> = ({
  children,
  ...props
}) => {
  const { active, setActive, onClose, title = "" } = props;

  useEffect(() => {
    if (active) {
      document.body.classList.add("modal-active");
    } else {
      document.body.classList.remove("modal-active");
    }
  }, [active]);

  return (
    <div
      className={ active ? "modal active" : "modal" }
      // onClick={() => setActive(false)} // Click out of modal close it
    >
      <div
        className={ active ? "modal__content active" : "modal__content" }
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" rounded-2xl border-2 border-[#3C312B]">
          <ModalHeader
            title={title}
            onClick={() => {
              onClose ? onClose() : setActive(false);
            }}
          />
          {children}
        </div>
      </div>
    </div>
  );
};
