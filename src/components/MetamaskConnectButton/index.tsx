"use client";

import React, { FC, useState } from "react";
import { Button } from "../Common";

interface MetamaskConnectButtonProps {
  isMetaMask?: boolean;
  handleConnect?: () => void;
}

export const MetamaskConnectButton: FC<MetamaskConnectButtonProps> = (props) => {
  const { isMetaMask, handleConnect } = props;

  return (
    <>
      <Button
        name={"Connect MetaMask"}
        disabled={!isMetaMask}
        onClick={handleConnect}
      />
    </>
  );
};
