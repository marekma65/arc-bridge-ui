"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSwitchChain } from "wagmi";
import { useState, useEffect, useCallback } from "react";
import { SUPPORTED_CHAINS } from "../lib/chains";

const CHAIN_KEYS: Record<number, string> = {
  5042002: "arc",
  11155111: "sepolia",
  84532: "baseSepolia",
  421614: "arbitrumSepolia",
  11155420: "optimismSepolia",
};

interface TxRecord {
  steps: any[];
  from: string;
  to: string;
  amount: string;
  recipient: string;
  time: string;
}

export default function Home() {
  const { isConnected, address } = useAccount();
  const { switchChain } = useSwitchChain();

  const [fromChain, setFromChain] = useState(SUPPORTED_CHAINS[0]);
  const [toArc, setToArc] = useState(true);
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [txHistory, setTxHistory] = useState<TxRecord[]>([]);
  const [arcUsdc, setArcUsdc] = useState("0.00");
  const [fromUsdc, setFromUsdc] = useState("0.00");

  const fetchBalances = useCallback(() => {
    if (!address) return;
    const chainKey = CHAIN_KEYS[fromChain.id] ?? "sepolia";
    fetch("/api/balances?address=" + address + "&chain=arc")
      .then((r) => r.json())
      .then((d) => setArcUsdc(d.usdc ?? "0.00"));
    fetch("/api/balances?address=" + address + "&chain=" + chainKey)
      .then((r) => r.json())
      .then((d) => setFromUsdc(d.usdc ?? "0.00"));
  }, [address, fromChain]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  function swapDirection() {
    setToArc(!toArc);
  }

  async function handleBridge() {
    if (!amount) return;
    setStatus("pending");
    setStatusMsg("Switching network...");

    const fromChainName = toArc ? fromChain.bridgeKitName : "Arc_Testnet";
    const toChainName = toArc ? "Arc_Testnet" : fromChain.bridgeKitName;
    const fromLabel = toArc ? fromChain.name : "Arc Testnet";
    const toLabel = toArc ? "Arc Testnet" : fromChain.name;
    const recipientAddress = recipient.trim() || address;

    try {
      await switchChain({ chainId: toArc ? fromChain.chain.id : 5042002 });
      setStatusMsg("Initiating bridge...");

      const res = await fetch("/api/bridge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromChain: fromChainName,
          toChain: toChainName,
          amount,
          token: "USDC",
          recipient: recipientAddress,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const record: TxRecord = {
        steps: data.result?.steps ?? [],
        from: fromLabel,
        to: toLabel,
        amount,
        recipient: recipientAddress as string,
        time: new Date().toLocaleTimeString(),
      };

      setTxHistory((prev) => [record, ...prev]);
      setStatus("success");
      setStatusMsg("Bridge completed!");
      setTimeout(() => setStatus("idle"), 5000);
      setAmount("");
      setRecipient("");
      fetchBalances();
    } catch (e: any) {
      setStatus("error");
      setStatusMsg(e?.message ?? "Bridge failed");
      setTimeout(() => setStatus("idle"), 7000);
    }
  }

  const fromLabel = toArc ? fromChain.name : "Arc Testnet";
  const toLabel = toArc ? "Arc Testnet" : fromChain.name;
  const explorerUrl = "https://testnet.arcscan.app";

  return (
    <main style={{ minHeight: "100vh", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", fontFamily: "system-ui, sans-serif" }}>

      {status !== "idle" && (
        <div style={{ position: "fixed", top: "24px", right: "24px", zIndex: 1000, background: status === "success" ? "#166534" : status === "error" ? "#991B1B" : "#1D3461", color: "#fff", borderRadius: "14px", padding: "16px 20px", fontSize: "14px", fontWeight: 600, maxWidth: "320px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          <div style={{ marginBottom: "4px" }}>{status === "success" ? "Success" : status === "error" ? "Error" : "Pending"}</div>
          <div style={{ fontWeight: 400, fontSize: "13px", opacity: 0.9 }}>{statusMsg}</div>
          <button onClick={() => setStatus("idle")} style={{ marginTop: "8px", fontSize: "12px", color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer" }}>Dismiss</button>
        </div>
      )}

      <div style={{ width: "100%", maxWidth: "500px", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ background: "#1E293B", borderRadius: "24px", border: "1px solid #334155", padding: "2rem" }}>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <div>
              <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#F8FAFC", margin: "0 0 2px" }}>Arc Bridge</h1>
              <p style={{ fontSize: "13px", color: "#64748B", margin: 0 }}>Bridge USDC to and from Arc</p>
            </div>
            <ConnectButton showBalance={false} />
          </div>

          {isConnected && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Balances */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                <div style={{ background: "#0F172A", borderRadius: "12px", padding: "12px 16px", border: "1px solid #334155" }}>
                  <p style={{ fontSize: "11px", color: "#64748B", margin: "0 0 4px" }}>Arc Testnet</p>
                  <p style={{ fontSize: "15px", fontWeight: 700, color: "#60A5FA", margin: 0 }}>{arcUsdc} USDC</p>
                </div>
                <div style={{ background: "#0F172A", borderRadius: "12px", padding: "12px 16px", border: "1px solid #334155" }}>
                  <p style={{ fontSize: "11px", color: "#64748B", margin: "0 0 4px" }}>{fromChain.name}</p>
                  <p style={{ fontSize: "15px", fontWeight: 700, color: "#60A5FA", margin: 0 }}>{fromUsdc} USDC</p>
                </div>
              </div>

              {/* Route */}
              <div>
                <p style={{ fontSize: "13px", color: "#64748B", margin: "0 0 8px" }}>Route</p>
                <div style={{ background: "#0F172A", borderRadius: "16px", padding: "16px", border: "1px solid #334155" }}>
                  <div style={{ marginBottom: "12px" }}>
                    <p style={{ fontSize: "11px", color: "#64748B", margin: "0 0 6px" }}>FROM</p>
                    {toArc ? (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px" }}>
                        {SUPPORTED_CHAINS.map((c) => (
                          <button key={c.id} onClick={() => setFromChain(c)} style={{ border: fromChain.id === c.id ? "2px solid #3B82F6" : "1px solid #334155", borderRadius: "10px", padding: "8px 12px", textAlign: "left", background: fromChain.id === c.id ? "#1D3461" : "#1E293B", cursor: "pointer", fontSize: "13px", color: "#F8FAFC" }}>
                            {c.icon} {c.name}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div style={{ padding: "8px 12px", background: "#1E293B", borderRadius: "10px", border: "1px solid #334155", fontSize: "13px", color: "#F8FAFC" }}>Arc Testnet</div>
                    )}
                  </div>

                  <div style={{ display: "flex", justifyContent: "center", margin: "8px 0" }}>
                    <button onClick={swapDirection} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: "50%", width: "36px", height: "36px", cursor: "pointer", fontSize: "16px", color: "#60A5FA" }}>↕</button>
                  </div>

                  <div>
                    <p style={{ fontSize: "11px", color: "#64748B", margin: "0 0 6px" }}>TO</p>
                    {!toArc ? (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px" }}>
                        {SUPPORTED_CHAINS.map((c) => (
                          <button key={c.id} onClick={() => setFromChain(c)} style={{ border: fromChain.id === c.id ? "2px solid #3B82F6" : "1px solid #334155", borderRadius: "10px", padding: "8px 12px", textAlign: "left", background: fromChain.id === c.id ? "#1D3461" : "#1E293B", cursor: "pointer", fontSize: "13px", color: "#F8FAFC" }}>
                            {c.icon} {c.name}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div style={{ padding: "8px 12px", background: "#1E293B", borderRadius: "10px", border: "1px solid #334155", fontSize: "13px", color: "#F8FAFC" }}>Arc Testnet</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div>
                <p style={{ fontSize: "13px", color: "#64748B", margin: "0 0 8px" }}>Amount</p>
                <input type="number" placeholder="Amount in USDC" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ width: "100%", boxSizing: "border-box" as const, padding: "12px 16px", borderRadius: "12px", border: "1px solid #334155", fontSize: "15px", background: "#0F172A", color: "#F8FAFC", outline: "none" }} />
              </div>

              {/* Recipient */}
              <div>
                <p style={{ fontSize: "13px", color: "#64748B", margin: "0 0 4px" }}>
                  Recipient address
                  <span style={{ fontSize: "11px", color: "#475569", marginLeft: "8px" }}>optional – leave empty to send to yourself</span>
                </p>
                <input type="text" placeholder="0x... (optional)" value={recipient} onChange={(e) => setRecipient(e.target.value)} style={{ width: "100%", boxSizing: "border-box" as const, padding: "12px 16px", borderRadius: "12px", border: "1px solid #334155", fontSize: "14px", background: "#0F172A", color: "#F8FAFC", outline: "none", fontFamily: "monospace" }} />
              </div>

              {/* Bridge Button */}
              <button onClick={handleBridge} disabled={!amount || status === "pending"} style={{ width: "100%", background: !amount || status === "pending" ? "#1E293B" : "linear-gradient(135deg, #3B82F6, #6366F1)", color: !amount || status === "pending" ? "#475569" : "#fff", border: "1px solid #334155", borderRadius: "14px", padding: "15px", fontSize: "15px", fontWeight: 700, cursor: !amount || status === "pending" ? "not-allowed" : "pointer" }}>
                {status === "pending" ? "Bridging..." : "Bridge USDC from " + fromLabel + " to " + toLabel}
              </button>

              <p style={{ fontSize: "12px", color: "#475569", textAlign: "center", margin: 0 }}>Powered by Circle CCTP</p>

            </div>
          )}
        </div>

        {/* Transaction History */}
        {txHistory.length > 0 && (
          <div style={{ background: "#1E293B", borderRadius: "24px", border: "1px solid #334155", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#94A3B8", margin: 0 }}>Transaction History</h2>
              <button onClick={() => setTxHistory([])} style={{ fontSize: "12px", color: "#EF4444", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Clear</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {txHistory.map((tx, i) => (
                <div key={i} style={{ background: "#0F172A", borderRadius: "12px", padding: "12px 14px", border: "1px solid #334155" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#F8FAFC" }}>{tx.amount} USDC</span>
                    <span style={{ fontSize: "11px", color: "#64748B" }}>{tx.time}</span>
                  </div>
                  <p style={{ fontSize: "11px", color: "#64748B", margin: "0 0 4px" }}>{tx.from} → {tx.to}</p>
                  <p style={{ fontSize: "11px", color: "#475569", margin: "0 0 8px", fontFamily: "monospace" }}>
                    To: {tx.recipient.slice(0, 10) + "..." + tx.recipient.slice(-6)}
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    {tx.steps.map((step, j) => (
                      <div key={j} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", color: "#94A3B8", textTransform: "capitalize" }}>{step.name}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "11px", color: step.state === "success" ? "#4ADE80" : "#94A3B8" }}>{step.state === "success" ? "done" : "pending"}</span>
                          {step.txHash && (
                            <a href={explorerUrl + "/tx/" + step.txHash} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", color: "#60A5FA" }}>View</a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}