import React, { FC } from "react";
import Image from "next/image";
import { Container } from "../../Common";

import { ItemInterface } from "../types";

const items: Omit<ItemInterface, "icon">[] = [
  {
    title: "What happens if the Origins dApp goes offline?",
    description:
      "Because Origins dApp is decentralized, the platform does not rely on a central server or entity. Even if the platform were to go offline, the family trees and data stored on the Ethereum blockchain would remain accessible. Additionally, you can run the dApp yourself, as it's open-source (check our GitHub page).",
  },
  {
    title: "Is my family data private?",
    description:
      "While data on the Ethereum blockchain is publicly accessible, we provide encryption options to ensure that only you can decrypt and access your information. Other than that we do not operate any backend servers, we do not collect, store, or process user data, all data encryption happens locally in your browser, we do not have access to your data or encryption keys.",
  },
  {
    title: "Is it free to use?",
    description:
      "Gas fees are required to cover Ethereum network usage. Additionally we charge a small fee (~1-5 USD) per interaction with our smart contract. The exact amount depends on the current Ethereum price.",
  },
  {
    title: "What else should I know before using the dApp?",
    description:
      "By using this software, you acknowledge and understand that data written to the blockchain cannot be deleted or altered. Users are solely responsible for the content they choose to encrypt and store. We strongly discourage storing identifiable personal information about living individuals without their explicit consent.",
  },
];

export const FAQSection: FC = () => (
  <div className="bg-[url(/landing/faq-pattern.svg)] bg-auto bg-no-repeat w-full max-h-[750px]">
    <Container>
      <div className="bg-[#F1E0C5BF] backdrop-blur-[8px] w-full text-text-primary flex justify-between pt-12 pb-10">
        <div className="w-[30%] max-w-[300px] pl-[40px]">
          <div className="text-5xl h-[44%] leading-[54px] font-medium">
            {"Frequently Asked Questions"}
          </div>
          <div className="text-xl">
            {
              "Common questions to help you get the most out of Origins dApp features and services."
            }
          </div>
        </div>

        <div className="flex flex-col justify-between w-[70%] pr-[60px]">
          {items.map((item) => (
            <div key={item.title} className="pb-7">
              <div className="text-xl pb-2 font-medium">{item.title}</div>
              <div className="text-base w-[90%]">{item.description}</div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  </div>
);
