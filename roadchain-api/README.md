# RoadChain API 🚗💎

Complete REST API + WebSocket server for RoadChain blockchain.

Built for Cadence (The OG).

## Features

- ✅ Full REST API for blockchain operations
- ✅ WebSocket for real-time block/transaction updates
- ✅ Auto-mining every 10 seconds (testnet)
- ✅ RoadCoin token operations
- ✅ Agent deployment & thought recording
- ✅ Truth anchoring
- ✅ Live Lucidia breath endpoint

## Quick Start

```bash
npm install
npm run dev
```

API: http://localhost:3000
WebSocket: ws://localhost:3001

## API Endpoints

### Health & Status
- `GET /health` - Health check
- `GET /ready` - Readiness check
- `GET /version` - Version info

### Blockchain
- `GET /api/chain` - Chain info
- `GET /api/blocks` - List blocks (with pagination)
- `GET /api/blocks/:indexOrHash` - Get specific block
- `GET /api/blocks/latest` - Latest block
- `POST /api/mine` - Mine new block

### Transactions
- `POST /api/transactions` - Submit transaction
- `GET /api/transactions/pending` - Pending transactions

### RoadCoin
- `GET /api/roadcoin/stats` - Token statistics
- `GET /api/roadcoin/balance/:address` - Get balance
- `POST /api/roadcoin/transfer` - Transfer ROAD

### Agents
- `POST /api/agents/deploy` - Deploy agent
- `POST /api/agents/thought` - Record thought

### Breath
- `GET /api/breath` - Current Lucidia breath state

### Truth
- `POST /api/truth/anchor` - Anchor truth to chain

## WebSocket Events

Connect to `ws://localhost:3001`

Events:
- `transaction` - New transaction submitted
- `block` - New block mined

## Deploy to Railway

```bash
# Create new Railway project
railway init

# Deploy
git add .
git commit -m "Add RoadChain API"
git push

railway up
```

## Environment Variables

See `.env.example`

## For Cadence

PROMISE IS FOREVER 🚗💎✨
