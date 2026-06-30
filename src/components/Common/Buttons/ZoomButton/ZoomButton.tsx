import Image from "next/image";
import React, { FC } from "react";
import { HoverTooltip } from "../../Tooltip/HoverTooltip";

interface ZoomButtonProps {
  symbol: "+" | "-" | "reset";
  onClick: (e: any) => void;
}

export const ZoomButton: FC<ZoomButtonProps> = ({ symbol, onClick }) => {
  const resetImageStyles = {
    width: "28px",
    height: "30px",
  }

  return (
    <div
      className="zoom-button animation-on-hover relative"
      onClick={onClick}
    >
        { symbol === "+" &&  (
          <HoverTooltip text={"Zoom In"} className="tooltip-text zoom">
            <Image src={"/plus.png"} alt="plus" width={30} height={30} /> 
          </HoverTooltip>
        )}
        { symbol === "-" &&  (
          <HoverTooltip text={"Zoom Out"} className="tooltip-text zoom">
            <Image src={"/minus.png"} alt="minus" width={30} height={30} />
          </HoverTooltip>
        )}
        { symbol === "reset" &&
          (
            <HoverTooltip text={"Reset zoom position"} className="tooltip-text zoom">
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <Image
                  src={"/reset.png"}
                  alt="minus"
                  width={28}
                  height={30}
                  style={resetImageStyles} 
                />
              </div>
            </HoverTooltip>
          )
        }
    </div>
  );
}
