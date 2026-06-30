import { WalletContext } from "../components/Common/Providers/WalletContextProvider/WalletContextProvider"
import React, { useContext } from "react";

import type { WalletContextType } from "../utils/types";

export const useWalletContext = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletContext must be used within a WalletContextProvider");
  }
  return context;
};