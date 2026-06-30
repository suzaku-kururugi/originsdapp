"use client";

import React, { FC, PropsWithChildren } from "react";
import { darkTheme, getDefaultConfig, lightTheme, RainbowKitProvider, Theme } from "@rainbow-me/rainbowkit";
import { State, WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { config } from "./config";

import { WalletContextProvider } from "./WalletContextProvider/WalletContextProvider";

import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

// export const config = getDefaultConfig({
//   appName: 'My RainbowKit App',
//   projectId: projectId,
//   chains: [mainnet, polygon, sepolia, arbitrumSepolia],
//   ssr: false, // If your dApp uses server side rendering (SSR)
// });

// const myCustomTheme = {
//   lightMode: lightTheme({
//     accentColor: "#776344",
//     accentColorForeground: "white",
//     connectButtonBackground: "rgb(241, 224, 197)", 
//   }),
//   darkMode: darkTheme({
//     accentColor: "#776344",
//     accentColorForeground: "white",
//     connectButtonBackground: "rgb(241, 224, 197)",
//   })
// }

const Providers: FC<PropsWithChildren<{initialState?: State | undefined}>> = ({ children, initialState }) => {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          showRecentTransactions={true}
          locale="en-US"
          theme={
            // myCustomTheme
          {
            lightMode: lightTheme({
              accentColor: "#776344",
              accentColorForeground: "white",
            }),
            darkMode: darkTheme({
              accentColor: "#776344",
              accentColorForeground: "white",
            })
          }
        }
        >
          <WalletContextProvider>
            { children }
          </WalletContextProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Providers;
