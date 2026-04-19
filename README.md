# BlockFund

A full-stack blockchain web application built on the Ethereum **Sepolia testnet**. Created as a portfolio project to explore Web3 development, DeFi mechanics, and real-time cryptocurrency data.

🌐 **Live demo:** https://blockfund.onrender.com

## Features

- 🔐 **Wallet-based login** — authenticate using your Ethereum public key, verified on-chain via the Etherscan API
- 📰 **Live crypto news** — real-time news feed powered by the CryptoCompare API (holders only)
- 📈 **Live charts** — BF transaction history chart + TradingView widgets for BTC, ETH, SOL and more (holders only)
- 💬 **Group chat** — real-time chat room for BF token holders
- 🔄 **DeFi swap** — swap Sepolia ETH for BF tokens via a SourceHat liquidity pool
- 🌙 **Dark/light mode** — persistent theme toggle across all pages

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express |
| Blockchain | Ethereum Sepolia Testnet (ERC-20) |
| APIs | Etherscan API, CryptoCompare API, TradingView |
| Deployment | Render |

## Token Details

- **Name:** BlockFund (BF)
- **Network:** Ethereum Sepolia Testnet
- **Contract:** `0xbC1AA1F461ac8B7359fC833F957c355F19BB4144`
- **Total supply:** 1,000,000 BF
- **Value:** None — strictly educational

## Local Setup

```bash
git clone https://github.com/georgeded/BlockFund.git
cd BlockFund/BlockFund-main/backend
npm install
node server.js
```

Open http://localhost:8080

## Authors

**Georgios Dedempilis** — [LinkedIn](https://www.linkedin.com/in/georgios-dedempilis) · [GitHub](https://github.com/georgeded)

**Dean Kok** — [LinkedIn](https://www.linkedin.com/in/dean-kok) · [GitHub](https://github.com/DeanKok)

---

*This project was built for educational purposes only and holds no monetary value.*
