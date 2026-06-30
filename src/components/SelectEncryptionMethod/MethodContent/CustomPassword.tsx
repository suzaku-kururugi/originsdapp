import React, { FC, useEffect, useState } from "react";
import { Button, InputTextArea, Form } from "../../Common";
import { MethodContentProps } from "./types";
import { useWalletContext } from "../../../components/context";


export const CustomPassword: FC<MethodContentProps> = ({ handleCashUpdate }) => {
  const { sendTx, error } = useWalletContext();

  const [password, setPassword] = useState<string | undefined>();
  const [tryTxSent, setTxSent] = useState<boolean>(false);

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

  return (
    <div className="text-center px-4">
      <div className="encryption-method-content-title" style={{ marginBottom: 0 }}>
        {"Encrypt with Password"}
      </div>

      <div className="text-xs my-2">
        You can use a combination of <b>Latin letters</b>, <b>numbers</b> and special symbols <b>!~@#$%&-*</b> as your password. Length 8-50 symbols.
      </div>
      
      <Form onSubmit={handleSubmit}>
        <div className="w-[300px] mb-4">
            <InputTextArea
              label="Password"
              name="Password"
              rows={3}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              validate={[
                ["maxLength", 50],
                ["minLength", 8],
                "passwordRequiredSymbolsOnly"
              ]}
            />
        </div>

        <div className="flex justify-center">
          <Button name="Send Data" type="submit" disabled={!password}/>
        </div>
      </Form>
    </div>
  )
}
