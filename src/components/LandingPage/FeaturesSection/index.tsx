import React, { FC } from "react";
import Image from "next/image";
import { Container, Button } from "../../Common";

import { ItemInterface } from "../types";

const items: ItemInterface[] = [
  {
    icon: "/landing/hourglass.svg",
    title: "Decentralization and Longevity",
    description: "By leveraging the Ethereum blockchain, our app operates in a decentralized manner. This enhances the app's longevity, making it resistant to corporate shutdowns or policy changes that could threaten the availability of centralized services."
  },
  {
    icon: "/landing/wall.svg",
    title: "Data Immutability",
    description: "Storing family trees on the blockchain ensures that the records are immutable and tamper-proof. Once data is added to the blockchain, it cannot be altered or deleted by any entity, preserving the accuracy of historical family data over generations"
  },
  {
    icon: "/landing/lock.svg",
    title: "Ownership and Privacy Control",
    description: "Our app allows users to control access to their family trees via their private keys and passwords, ensuring that only authorized individuals can view or modify the data."
  },
];

export const FeaturesSection: FC = () => (
  <div className="bg-[#F1E0C5] w-full">
    <Container>
      <div className="w-full h-[500px] text-text-primary ">
        <div className="text-5xl pt-12 font-medium">{"Explore Features"}</div>
        <div className="text-xl my-4 font-medium">
          {
            "Origins dApp offers the following features to build, organize, and preserve your family's history."
          }
        </div>

        <div className="flex justify-between items-start pt-7">
          {items.map((item) => (
            <div
              key={item.title}
              className="max-w-[340px] h-[300px] flex flex-col justify-start"
            >
              <div className="h-[70px] flex justify-start items-center">
                <div className="relative my-4 w-12 h-[10%] flex justify-center items-center">
                  <Image
                    src={item.icon}
                    alt={`icon_${item.title}`}
                    width={50}
                    height={50}
                    style={{ width: "auto", height: "auto" }}
                  />
                </div>
                <div className="text-xl ml-4 leading-5 font-medium">{item.title}</div>
              </div>

              <div className="h-[70%] mt-1">
                <div>{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  </div>
);
