# Arc Bridge UI

A web app for bridging USDC between Arc Testnet and other EVM chains (Ethereum Sepolia, Base Sepolia, Arbitrum Sepolia, Optimism Sepolia) using Circle's CCTP protocol.

Built by **wija** while exploring the Arc blockchain ecosystem.

## Warning — No Live Demo

This app is intentionally not deployed publicly. Even though it runs on testnet only, the bridge requires a private key on the server side. Sharing a live deployment would expose that key, which is bad practice regardless of network. **Run it locally following the steps below.**

## What it does

- Bridge USDC from any supported EVM chain to Arc Testnet
- Bridge USDC from Arc Testnet back to any supported EVM chain
- Send to a custom recipient address (optional)
- Real-time USDC balance display for Arc and source chain
- Transaction history with step-by-step CCTP progress (Approve, Burn, Attestation, Mint)

## How it works

The bridge uses Circle's Cross-Chain Transfer Protocol (CCTP) — USDC is burned on the source chain and minted natively on the destination chain. No wrapped tokens, no liquidity pools.

## Screenshots

![Arc Bridge UI](public/screenshots/001.png)
![Arc Bridge UI](public/screenshots/002.png)
![Arc Bridge UI](public/screenshots/003.png)
![Arc Bridge UI](public/screenshots/004.png)

## Built with

- [Next.js](https://nextjs.org/)
- [Wagmi](https://wagmi.sh/) + [Viem](https://viem.sh/)
- [RainbowKit](https://www.rainbowkit.com/)
- [Circle Bridge Kit](https://developers.circle.com/bridge-kit)
- [Arc Testnet](https://docs.arc.network/)

## Getting started

1. Clone the repo
```bash
   git clone https://github.com/marekma65/arc-bridge-ui.git
   cd arc-bridge-ui
```

2. Install dependencies
```bash
   npm install
```

3. Set up environment variables
```bash
   cp .env.example .env.local
```
   Edit `.env.local` and add the private key of a **testnet-only wallet**. Never use your main wallet.

4. Run the app
```bash
   npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Supported chains

- Arc Testnet
- Ethereum Sepolia
- Base Sepolia
- Arbitrum Sepolia
- Optimism Sepolia

## Important notes

- This app runs on **testnet only** — no real funds at risk
- The private key in `.env.local` should belong to a **dedicated testnet wallet** with no real value
- Never commit `.env.local` to version control
- Get free testnet USDC from [Circle Faucet](https://faucet.circle.com/)

## Network

Arc Testnet — Chain ID: 5042002 — Explorer: [testnet.arcscan.app](https://testnet.arcscan.app)