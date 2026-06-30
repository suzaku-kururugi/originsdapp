import React, { FC } from "react";
import { Container, Logo, SocialMediaLink } from "../../Common";
import { SocialMediaTitles } from "../../../utils/types";

const socialMedia: { name: SocialMediaTitles, href: string }[] = [
  {
    name: "X",
    href: "https://x.com/OriginsDapp"
  },
  {
    name: "github",
    href: "https://github.com/suzaku-kururugi/originsdapp"
  }
]

export const Footer: FC = () => {
  return (
    <div className="h-fit border-t-[1px] border-text-primary bg-[#F1E0C5]">
      <Container>
        <div className="flex justify-between items-center text-text-primary h-full">
          <div className="h-[100px] flex justify-between items-center">
            <Logo />
          </div>

          <div className="text-center text-sm leading-[1.2]">
            <span>{"All rights reserved"}</span>
            <br/>
            <span>{"© 2026 Origins dApp"}</span>
          </div>

          <div className="flex justify-between w-[20%]">
            <div>
              <div className=" font-semibold">{"Social Media"}</div>
              <div className="flex gap-3">
                {socialMedia.map((media) => (
                  <div key={media.name}>
                    <SocialMediaLink {...media} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}