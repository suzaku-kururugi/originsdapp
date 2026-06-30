import React, { FC } from "react";
import Image from "next/image";
import { Container, Button } from "../../Common";
import { useRouter } from "next/navigation";

import { ItemInterface } from "../types";

const items: ItemInterface[] = [
  {
    icon: "/landing/briefcase.svg",
    title: "Easy Interface",
    description:
      "Navigate your family tree with ease using our user-friendly interface designed for everyone.",
  },
  {
    icon: "/landing/shield.svg",
    title: "Encrypted Data",
    description:
      "Your family data can be encrypted and securely stored, ensuring privacy and peace of mind.",
  },
  {
    icon: "/landing/eth.svg",
    title: "Backed by Ethereum",
    description:
      "By storing your data onchain, your family records remain decentralized and resilient—never dependent on any single company or server.",
  },
];

export const WhyChoseSection: FC = () => {
  const router = useRouter();
  return (
    <div className="bg-[url(/landing/why-choose-pattern.svg)] bg-auto bg-no-repeat w-full py-10">
      <Container>
        <div className=" w-full h-fit py-6">
          <div className="bg-[#F1E0C5BF] h-[800px] p-[1rem] rounded-xl flex flex-row-reverse justify-between items-center border-[1px] border-[#3C312B] backdrop-blur-sm">
            <div className="text-text-primary w-[48%] max-w-[535px] max-h-[860px]">
              <div className="w-[80%] ">
                <div className="text-[46px] leading-[1] font-medium py-4">
                  {"What is Origins dApp?"}
                </div>
                <div className="text-[#958672] font-medium text-base leading-[20px]">
                  {
                    "We provide a reliable, comprehensive platform for exploring and preserving family history."
                  }
                </div>
                <div className="my-6">
                  {items.map((item) => (
                    <div key={item.title} className="pb-6">
                      <div className="w-full my-[8px] flex justify-start items-center">
                        <Image
                          src={item.icon}
                          alt={`icon_${item.title}`}
                          width="0"
                          height="0"
                          style={{ width: "24px", height: "auto" }}
                        />
                        <div className="text-2xl py-1 ml-2 leading-[24px] font-medium">
                          {item.title}
                        </div>
                      </div>
                      <div className="text-[#958672] font-medium text-base leading-[20px]">
                        {item.description}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-start">
                  <Button
                    name={"Try It"}
                    onClick={() => router.push("/dApp")}
                  />
                </div>
              </div>
            </div>
            <div className="relative w-[52%] h-full">
              <Image
                src={"/landing/chose-1.svg"}
                alt="chose_section_picure"
                width="0"
                height="0"
                className="rounded-lg"
                style={{
                  width: "540px",
                  height: "auto",
                  position: "absolute",
                  top: "0px",
                  left: "-10px",
                  zIndex: 10,
                }}
              />
              <Image
                src={"/landing/chose-2.svg"}
                alt="chose_section_picure"
                width="0"
                height="0"
                className="rounded-lg"
                style={{
                  width: "540px",
                  height: "auto",
                  position: "absolute",
                  top: "340px",
                  left: "60px",
                  zIndex: 5,
                }}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
