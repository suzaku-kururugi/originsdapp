import React, { FC } from "react";
import Image from "next/image";
import { HoverTooltip } from "../../index";

interface ZoomButtonProps {
  src: string;
  alt: string;
  onClick: (e: any) => void;
  disabled?: boolean;
  width?: number;
  height?: number;
  style?: {
    [key: string]: string;
  },
  tooltip?: string;
  highlited?: boolean;
}

export const IconButton: FC<ZoomButtonProps> = ({
  src,
  alt,
  onClick,
  style,
  tooltip,
  disabled,
  width = 20,
  height = 20,
  highlited = false
}) => {

  return (
    <HoverTooltip text={tooltip}>
      <div
        className={`icon-button animation-on-hover ${highlited ? "highlight" : "" } ${disabled ? "disabled-button" : ""}`}
        onClick={disabled ? () => null : onClick}
      >
        <Image src={src} alt={alt} width={width} height={height} style={style || { width: "auto", height: "auto" }}/>
      </div>
    </HoverTooltip>
  );
}
