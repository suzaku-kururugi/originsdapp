import React, { FC, useEffect, useState } from "react";
import { Modal, ModalProps } from "../Modal";
import { Button } from "../";
import { usePassword } from "../../../controllers";
import { toast } from "react-toastify";


interface PasswordModalProps extends Omit<ModalProps, "title"> {
  handleReadContract: () => void;
  submitPassword: (password: string) => Promise<boolean>;
  shouldSendTx?: boolean;
}


export const PasswordModal: FC<PasswordModalProps> = (props) => {
  const {
    active,
    setActive,
    submitPassword,
    onClose,
    handleReadContract
  } = props;
  const { setPassword } = usePassword();

  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined)
  const [fieldValue, setFieldValue] = useState("");
  const [isDecrypting, setDecrypting] = useState(false);

  const handleSubmit = async () => {
    const isCorrect = await submitPassword(fieldValue);

    if (isCorrect) {
      setPassword(fieldValue);

      try {
        // sendTx();
        setActive(false);
        setFieldValue("");
        setDecrypting(false);
        handleReadContract()
      } catch (err: any) {
        throw new Error(`Error when try to send transaction: ${err.message}`)
      }
    } else {
      setErrorMessage("Wrong password")
      setDecrypting(false);
      toast.error("Wrong password");
    }
  }

  useEffect(() => {
    setErrorMessage(undefined);
  }, [fieldValue]);

  return (
    <>
      <Modal
        active={active}
        setActive={setActive}
        title="Enter your password"
        onClose={onClose}
      >
        <div className="w-[440px] h-[140px] flex flex-col justify-between items-center p-4">
          <div className="w-full">
            <input
              type="text"
              value={fieldValue}
              onChange={(e) => setFieldValue(e.target.value)}
              className="placeholders text-black font-semibold w-full bg-[#F1E0C5] rounded-2xl border-solid border-2 border-[#3C312B] border-#4a4aac pl-4 h-10"
            />
            <div style={{
              fontSize: "x-small",
              height: "16px",
              color: "red",
              padding: "4px 0 0 10px"
            }}>
              {errorMessage}
            </div>
          </div>
          <Button
            name={isDecrypting ? "Decrypt" : "Submit"}
            onClick={() => {
              setDecrypting(true);
              handleSubmit();
            }}
            disabled={isDecrypting}
          />
        </div>
      </Modal>
    </>
  )
}
