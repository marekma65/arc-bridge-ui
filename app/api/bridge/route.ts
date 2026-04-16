import { NextRequest, NextResponse } from "next/server";
import { BridgeKit } from "@circle-fin/bridge-kit";
import { createViemAdapterFromPrivateKey } from "@circle-fin/adapter-viem-v2";

const kit = new BridgeKit();

function serializeBigInt(obj: any): any {
  return JSON.parse(JSON.stringify(obj, (_, value) =>
    typeof value === "bigint" ? value.toString() : value
  ));
}

export async function POST(req: NextRequest) {
  try {
    const { fromChain, toChain, amount } = await req.json();

    if (!amount || !fromChain || !toChain) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const privateKey = process.env.PRIVATE_KEY as `0x${string}`;

    if (!privateKey) {
      return NextResponse.json({ error: "Server private key not configured" }, { status: 500 });
    }

    const adapter = createViemAdapterFromPrivateKey({ privateKey });

    const result = await kit.bridge({
      from: { adapter, chain: fromChain },
      to: { adapter, chain: toChain },
      amount,
    });

    return NextResponse.json({ success: true, result: serializeBigInt(result) });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Bridge failed" }, { status: 500 });
  }
}