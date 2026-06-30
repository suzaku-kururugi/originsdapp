import { polygon, mainnet, sepolia, arbitrumSepolia, baseSepolia } from "wagmi/chains";
import { http, createConfig, cookieStorage, createStorage } from "wagmi";

export const config = createConfig({
  chains: [
    mainnet,
    // polygon,
    // arbitrumSepolia
    // baseSepolia,
    // sepolia,
  ],
  ssr: true,
  storage: createStorage({  
    storage: cookieStorage, 
  }),
  transports: {
    [mainnet.id]: http("https://0xrpc.io/eth"),
    // [polygon.id]: http(),
    // [arbitrumSepolia.id]: http(),
    // [baseSepolia.id]: http(),
    // [sepolia.id]: http("https://ethereum-sepolia-rpc.publicnode.com"),
  },
});
