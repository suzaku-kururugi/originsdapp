import React, { FC } from "react";
import Image from "next/image";
import { SocialMediaTitles } from "@/utils/types";

interface SocialMedialLinkProps {
  name: SocialMediaTitles;
  href: string;
}

export const SocialMediaLink: FC<SocialMedialLinkProps> = ({ name, href }) => {

  const handleLinkClick = () => {
    window.open(href, "_blank");
  }

  return (
    <div onClick={handleLinkClick} className=" cursor-pointer">
      <Image src={`/socialMedia/${name}.svg`} alt={`icon_${name}`} width={20} height={20} />
    </div>
  );
}