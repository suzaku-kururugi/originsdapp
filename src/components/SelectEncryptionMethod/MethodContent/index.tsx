import React, { FC } from "react";
import { usePassword } from "../../../controllers";
import { GeneratePassword } from "./GeneratePassword";
import { CustomPassword } from "./CustomPassword";
import { WithoutPassword } from "./WithoutPassword";

export const MethodContent: FC<{
  index: number | null,
  handleModalClose: () => void;
}> = ({ index, handleModalClose }) => {
  const { setPassword } = usePassword();

  const handleCashUpdate = (isEncrypted: boolean, key?: string) => {
    try {
      if (!isEncrypted) {
        localStorage.setItem("encrypted", JSON.stringify(0));
      } else {
        localStorage.setItem("encrypted", JSON.stringify(1));
  
        if (key) {
          setPassword(key)
        }
      }
      handleModalClose()
    } catch (err) {
      throw new Error("Cash update error")
    }
  }

  switch (index) {
    case 0: 
      return (
        <div>
          <CustomPassword handleCashUpdate={handleCashUpdate} />
        </div>
      )

    case 1: 
      return (
        <div>
          <GeneratePassword handleCashUpdate={handleCashUpdate} />
        </div>
      )

    case 2:
      return (
        <div>
          <WithoutPassword handleCashUpdate={handleCashUpdate} />
        </div>
      )
    
    default: 
    return null
  }
}
