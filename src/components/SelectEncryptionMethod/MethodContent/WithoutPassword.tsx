import React, { FC, useEffect, useState } from "react";
import { Button } from "../../Common";
import { MethodContentProps } from "./types";
import { useWalletContext } from "../../context";

export const WithoutPassword: FC<MethodContentProps> = ({ handleCashUpdate }) => {
  const [tryTxSent, setTxSent] = useState<boolean>(false);

  const { sendTx, error } = useWalletContext();

  const handleSubmit = () => {
    handleCashUpdate(false);

    try {
      sendTx();
      setTxSent(true)
    } catch (err) {
      console.log("Error caught in handleSubmit:", err);
    }
  }

  useEffect(() => {
    const errorName = error?.message.split(".")[0];

    if (tryTxSent && errorName === "User rejected the request") {
      localStorage.removeItem("encrypted");
      setTxSent(false)
    }
  }, [error])

  return (
    <div className="text-center px-5">
      <div className="encryption-method-content-title">
        {"Continue without encryption"}
      </div>
      <div className="flex flex-col justify-between items-center h-[250px]">
        <div className="text-base">
          {"I agree that my data will be available in an unencrypted form on the blockchain. I also acknowledge that the developers of this application are not responsible for any use of my data by third parties."}
        </div>

        <div className="flex justify-center">
          <Button
            name="Send Data"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}
