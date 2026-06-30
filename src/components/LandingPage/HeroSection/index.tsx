import React, { FC } from "react";
import Image from "next/image";
import { Container, Button } from "../../Common";
import { useRouter } from "next/navigation";

export const HeroSection: FC = () => {
  const router = useRouter();

  return (
    <div className=" w-full max-w-[1920px] justify-center">
      <div className="w-full bg-[url(/landing/hero-pattern.svg)] bg-no-repeat bg-auto">
        <Container>
          <div className="flex justify-between px-20 items-center w-full h-[93vh] max-h-[1104px] bg-[#F1E0C5BF] backdrop-blur-md">
            <div className="text-text-primary max-w-[50%] h-[60%] pt-[40px]">
              <div className=" text-[56px] pb-6 leading-[0.9] font-medium w-[439px]">
                {"Discover Your Roots: Build Your Family Tree On-chain."}
              </div>
              <div className="text-xl pb-16 leading-[21px] font-medium">
                {
                  "Create a lasting legacy for future generations by harnessing the decentralization and immutability of the Ethereum blockchain"
                }
              </div>
              <div>
                <Button name="Open dApp" onClick={() => router.push("/dApp")} />
              </div>
            </div>
            <div className="max-w-[45%]">
              <Image
                src="/landing/hero.svg"
                alt="hero_image"
                width="0"
                height="0"
                className="w-[526px] h-auto"
                />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};
