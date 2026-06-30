import React, { FC, PropsWithChildren } from "react";
import Image from "next/image";

interface AvatarPropsInterface {
  onClick?: () => void;
  image?: string;
}

export const Avatar: FC<PropsWithChildren<AvatarPropsInterface>> = ({image , onClick }) => {
  return (
    <div className="relative border-2 border-[#3C312B] bg-[#F1E0C5] h-[160px] w-[160px] rounded-[50%] ml-[2rem] flex flex-col justify-between items-center overflow-hidden">
      <Image
        src={image || "/avatar_default.png"}
        alt="avatar"
        width={500}
        height={500}
        style={{
          maxWidth: "160px",
          maxHeight: "160px",
          position: "absolute",
          top: "0",
          left: "0"
        }}
      />
      <div
        onClick={onClick}
        className="w-full bg-[#3c312b7a] h-[30px] cursor-pointer flex justify-center items-center absolute bottom-0"
      >
        <Image src="/edit.svg" alt="edit_icon" width={16} height={16} />
        <div className="font-medium text-xs text-[#F1E0C5] ml-2">{"Edit"}</div>
      </div>
    </div>
  );
};
