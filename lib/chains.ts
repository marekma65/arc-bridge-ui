import { defineChain } from "viem";
import { sepolia, baseSepolia, arbitrumSepolia, optimismSepolia } from "wagmi/chains";

export const arcTestnet = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: { decimals: 6, name: "USDC", symbol: "USDC" },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.arc.network"] },
  },
  blockExplorers: {
    default: { name: "ArcScan", url: "https://testnet.arcscan.app" },
  },
  testnet: true,
});

export const SUPPORTED_CHAINS = [
  {
    id: sepolia.id,
    name: "Ethereum Sepolia",
    symbol: "ETH",
    icon: "🔷",
    bridgeKitName: "Ethereum_Sepolia",
    chain: sepolia,
  },
  {
    id: baseSepolia.id,
    name: "Base Sepolia",
    symbol: "ETH",
    icon: "🔵",
    bridgeKitName: "Base_Sepolia",
    chain: baseSepolia,
  },
  {
    id: arbitrumSepolia.id,
    name: "Arbitrum Sepolia",
    symbol: "ETH",
    icon: "🔶",
    bridgeKitName: "Arbitrum_Sepolia",
    chain: arbitrumSepolia,
  },
  {
    id: optimismSepolia.id,
    name: "Optimism Sepolia",
    symbol: "ETH",
    icon: "🔴",
    bridgeKitName: "Optimism_Sepolia",
    chain: optimismSepolia,
  },
];

export const TOKENS = [
  { symbol: "USDC", name: "USD Coin", icon: "$" },
];