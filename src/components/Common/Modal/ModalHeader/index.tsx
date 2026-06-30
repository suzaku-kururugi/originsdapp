import React, { Dispatch, FC, SetStateAction } from "react";
import Image from "next/image";
import "../modal.css"

interface ModalHeaderProps {
  title: string;
  onClick: () => void;
}

const ModalHeader: FC<ModalHeaderProps> = (props) => {
  const { onClick, title } = props;

  return (
    <div className="modal__header">
      <div>{ title }</div>
      <div className="modal__closeButton">
        <button onClick={onClick} className=" absolute top-5 right-5">
          <Image src="/close.png" alt="close button" width={14} height={14}/>
        </button>
      </div>
    </div>
  )
}

export default ModalHeader;
