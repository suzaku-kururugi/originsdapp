import React, { createContext, FC, PropsWithChildren, useContext, useState } from "react";
import { useWallet } from "../../../../controllers";
import type { WalletContextType } from "../../../../utils/types";

export const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [localCacheChanged, setLocalCacheChanged] = useState(false);

  const {
    error,
    sendTx,
    pending,
    isLoading,
    isConnected,
    userAddress,
    readContract,
    wipeContractData,
    disconnectWallet,
    checkPasswordIsCorrect,
  } = useWallet(setLocalCacheChanged);

  return (
    <WalletContext.Provider value={{
      error,
      sendTx,
      pending,
      isLoading,
      isConnected,
      userAddress,
      readContract,
      wipeContractData,
      disconnectWallet,
      localCacheChanged,
      setLocalCacheChanged,
      checkPasswordIsCorrect
    }}>
      { children }
    </WalletContext.Provider>
  )
}
