import { createConfig, http } from "wagmi";
import { sepolia, baseSepolia, arbitrumSepolia, optimismSepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arcTestnet } from "./chains";

export const config = getDefaultConfig({
  appName: "Arc Bridge",
  projectId: "5da801378826acf33a1ae02038d78f58",
  chains: [arcTestnet, sepolia, baseSepolia, arbitrumSepolia, optimismSepolia],
  transports: {
    [arcTestnet.id]: http("https://rpc.testnet.arc.network"),
    [sepolia.id]: http(),
    [baseSepolia.id]: http(),
    [arbitrumSepolia.id]: http(),
    [optimismSepolia.id]: http(),
  },
});