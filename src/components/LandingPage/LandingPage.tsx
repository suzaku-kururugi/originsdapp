"use client"
import React, { FC } from "react";
import { Header, Providers, Footer } from "../Common";

import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { WhyChoseSection } from "./WhyChoseSection";
import { FAQSection } from "./FAQSection";

export const LandingPage: FC = () => {

  return (
    <Providers>
      <div style={{ width: "100vw" }}>
        <Header />
        <div className="mt-[72px] flex flex-col items-center">
          <div className="w-full max-w-[1920px]">
            <HeroSection />
            <FeaturesSection />
            <WhyChoseSection />
            <FAQSection />
          </div>
        </div>

        <Footer />
      </div>
    </Providers>
  );
}