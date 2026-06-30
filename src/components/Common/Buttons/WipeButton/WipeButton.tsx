import React, { FC, useState } from "react";
import { Button } from "../Button";
import { IconButton } from "../IconButton/IconButton";
import Image from "next/image";

interface WipeButtonProps {
  wipeContract: (
    onModalClose: React.Dispatch<React.SetStateAction<boolean>>,
    clearLocalData: () => void
  ) => void;
  clearLocalCache: () => void; 
}

export const WipeButton: FC<WipeButtonProps> = ({ wipeContract, clearLocalCache }) => {
  const [isWipeOpen, setWipeOpen] = useState(false);

  const handleClickWipeButton = () => {
    setWipeOpen(!isWipeOpen);
  }

  return (
    <div className="relative">
      <IconButton
        src="/wipe.svg"
        alt="read_icon"
        onClick={() => handleClickWipeButton()}
        width={30}
        height={30}
        tooltip="Wipe contract data"
      />
      <div
        className={`absolute text-text-primary  bg-[#F1E0C5] bottom-[40px] left-[60px] wipe-window ${ isWipeOpen ? "visible" : "" }`}
      >
        <div className="absolute w-10 h-10 top-2 right-[-20px] cursor-pointer" onClick={() => setWipeOpen(!isWipeOpen)}>
          <Image src="/close.png" alt="close_button" width={20} height={20} style={{ width: "auto", height: "auto" }}/>
        </div>
        <div className="p-4 pt-6 px-8 w-[360px]">
          <div className="text-center flex justify-evenly items-center outline-dashed outline-yellow-600">
            <div className="w-10 h-10">
              <Image
                src="/warning.svg"
                alt="warning-icon"
                width={40}
                height={40}
                style={{ width: "auto", height: "auto" }}
              />
            </div>
            <div className="max-w-[70%]">
              {
                "Are you sure you want to wipe the contract? All your data will be deleted."
              }
            </div>
          </div>
          
          <div className="flex justify-center mt-4">
            <Button
              name={"Yes, delete my data"}
              onClick={() => {
                wipeContract(setWipeOpen, clearLocalCache)
              }}
              className="custom-button wipe"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
