import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http, erc20Abi } from "viem";
import { sepolia, baseSepolia, arbitrumSepolia, optimismSepolia } from "wagmi/chains";
import { arcTestnet } from "../../../lib/chains";

const USDC: Record<string, `0x${string}`> = {
  arc: "0x3600000000000000000000000000000000000000",
  sepolia: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
  baseSepolia: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  arbitrumSepolia: "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d",
  optimismSepolia: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7",
};

const CLIENTS: Record<string, any> = {
  arc: createPublicClient({ chain: arcTestnet, transport: http("https://rpc.testnet.arc.network") }),
  sepolia: createPublicClient({ chain: sepolia, transport: http() }),
  baseSepolia: createPublicClient({ chain: baseSepolia, transport: http() }),
  arbitrumSepolia: createPublicClient({ chain: arbitrumSepolia, transport: http() }),
  optimismSepolia: createPublicClient({ chain: optimismSepolia, transport: http() }),
};

async function getBalance(chainKey: string, tokenAddress: `0x${string}`, address: `0x${string}`) {
  try {
    const client = CLIENTS[chainKey];
    const raw = await client.readContract({
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [address],
    });
    return (Number(raw) / 1e6).toFixed(2);
  } catch {
    return "0.00";
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address") as `0x${string}`;
  const chainKey = searchParams.get("chain") ?? "arc";

  if (!address) return NextResponse.json({ error: "Missing address" }, { status: 400 });

  const usdc = await getBalance(chainKey, USDC[chainKey] ?? USDC.arc, address);

  return NextResponse.json({ usdc });
}