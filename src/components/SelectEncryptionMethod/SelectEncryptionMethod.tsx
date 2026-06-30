import React, { FC, useState, useRef } from "react";
import Image from "next/image";
import { Modal } from "../Common";
import { MethodContent } from "./MethodContent"

const methodData = [
  {
    title: "Encrypt with password",
    description: "Enter a password to encrypt the data",
    selected: false,
    hint: "Weak Security",
    icon: "/weak_security.svg"
  },
  {
    title: "Encrypt with generated password",
    description: "Generate a password and encrypt the data",
    selected: false,
    hint: "Strong Security",
    icon: "/strong_security.svg"
  }
]

export const SelectEncryptionMethod: FC<{
    active: boolean,
    setActive: React.Dispatch<React.SetStateAction<boolean>>
  }> = ({ active, setActive }) => {
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null); // Track selected method

  const handleClose = () => {
    setActive(false);
  }

  const handleOptionSelect = (index: number) => {
    setSelectedMethod(index)
    const element = methodData[index];
    const alreadySelectedElement = methodData.find(item => item.selected === true);

    if (alreadySelectedElement) {
      alreadySelectedElement.selected = false;
    }

    element.selected = true;
  }

  return (
    <Modal active={active} setActive={setActive} title={""}>
      <div className=" min-w-[500px] flex flex-col items-center">
        <div className="text-[#414141] text-2xl font-medium my-4">
          {"Choose Encryption Method"}
        </div>

        <div className="flex justify-between gap-6">
          <div className="flex flex-col justify-between items-center h-[300px] m-6 ">
            {methodData.map((item, i) => (
              <div
                key={i}
                className={`encryption-method-item ${selectedMethod === i ? 'selected' : ''}`} // Add 'selected' class
                onClick={() => handleOptionSelect(i)}
              >
                <div className="text-nowrap text-[14px] font-semibold uppercase mt-1">
                  {item.title}
                </div>
                <div className="text-[10px] text-[#967F72]">
                  {item.description}
                </div>

                <div className=" absolute bottom-1 right-2 text-[10px] text-[#967F72] flex justify-end items-center ">
                  {item.hint}
                  <Image src={item.icon} alt="security_icon" width={10} height={8} style={{ width: "auto", height: "auto" }} className="mx-2"/>
                </div>
              </div>
            )
          )}
          </div>

          <div
            className={`encryption-method-content ${selectedMethod === null ? '' : 'selected'}`}
          >
            <div className="w-full h-[90%] flex items-start mt-4">
              <div className="border-1 bg-[#3C312B] border-[#3C312B] h-full w-[1px]"/>
              <div className="w-[340px] flex justify-center items-center">
                <MethodContent index={selectedMethod} handleModalClose={handleClose}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
