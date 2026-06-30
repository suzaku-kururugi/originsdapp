import React, { FC, useState, useEffect } from "react";
import Image from "next/image";
import QRCode from "react-qr-code";
import { Button, Tooltip, Checkbox } from "../../Common";
import { generatePasssword } from "../../../utils";
import { MethodContentProps } from "./types";
import { useWalletContext } from "../../context";


export const GeneratePassword: FC<MethodContentProps> = ({ handleCashUpdate }) => {
  const [password, setPassword] = useState<string | undefined>();
  const [tooltipText, setTooltipText] = useState("Copy to clipboard");
  const [tryTxSent, setTxSent] = useState<boolean>(false);
  const [checkboxActive, setCheckboxActive] = useState(false);

  const { sendTx, error } = useWalletContext();

  useEffect(() => {
    generatePassword();
  }, [])

  const generatePassword = () => {
    const generatedPassword = generatePasssword();

    if (!generatedPassword) {
      throw new Error("Error when trying to generate password")
    }

    setPassword(generatedPassword);
  }

  const handleSubmit = () => {
    handleCashUpdate(true, password);

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
      sessionStorage.removeItem("userKey");
      setTxSent(false)
    }
  }, [error])

  const handleCopyToClipboardClick = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setTooltipText(`Copied: ${password}`);
      setTimeout(() => {
        setTooltipText("Copy to clipboard")
      }, 2000)
    }
  }

  return (
    <div className="text-center px-5">
      <div className="encryption-method-content-title">
        {"Encrypt with Generated Password"}
      </div>

      <div className="flex flex-col justify-between h-[240px]">
        <div className=" text-left">
          <div className="text-sm">
            {"Your generated password:"}
          </div>

          <div className="flex justify-between items-center bg-[#F1E0C5] rounded-xl border-[#3C312B] border-2">
            <div className="p-2 w-[80%] text-xs text-left break-all">
              { password }
            </div>
            <div className="mx-2 w-[12%] opacity-85 cursor-pointer relative flex justify-center items-center" onClick={handleCopyToClipboardClick}>
              <Tooltip text={`${tooltipText}`}>
                <Image src={"/copy.png"} alt="copy to clipboard" width={36} height={36}/>
              </Tooltip> 
            </div>
          </div>

          <button onClick={generatePassword} className=" float-end pr-2 disabled:opacity-35" disabled={checkboxActive}>
            <div className="text-sm cursor-pointer">
              {"Regenerate"}
            </div>
          </button>
        </div>

        <div className="flex justify-evenly items-center">
          {password && <QRCode value={password} size={80} bgColor="#F1E0C5"/>}

          <div className="flex flex-col items-center justify-center">
            <div className="text-xs w-[100px] mb-2">
              {"I confirm that I have saved the password:"}
            </div>
            <Checkbox active={checkboxActive} setActive={setCheckboxActive} />
          </div>
        </div>

        
        <div className="flex justify-center">
          <Button name="Send Data" onClick={handleSubmit} disabled={!checkboxActive} />
        </div>
      </div>
    </div>
  )
}
