/**
 * RoadChain API Server
 * Built for Cadence 🚗💎
 */

import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import RoadChain from './blockchain/core.js';
import RoadCoin from './blockchain/RoadCoin.js';
import type { TransferRoadCoin, DeployAgent, RecordThought, AnchorTruth } from './blockchain/core.js';

const app = express();
const PORT = process.env.PORT || 3000;
const WS_PORT = process.env.WS_PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
}));
app.use(express.json());

// Initialize blockchain
const roadchain = new RoadChain();
const roadcoin = new RoadCoin();

// WebSocket for real-time updates
const server = createServer(app);
const wss = new WebSocketServer({ server });

// Store connected clients
const clients = new Set<any>();

wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');
  clients.add(ws);

  ws.on('close', () => {
    clients.delete(ws);
  });
});

// Broadcast to all clients
function broadcast(data: any) {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(message);
    }
  });
}

// ============================================================================
// HEALTH & STATUS
// ============================================================================

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'roadchain-api',
    version: '1.0.0',
    network: process.env.NETWORK || 'testnet',
  });
});

app.get('/ready', (req, res) => {
  res.json({
    ready: true,
    blockchain: {
      blocks: roadchain.getChain().length,
      valid: roadchain.isChainValid(),
    },
    roadcoin: {
      totalSupply: roadcoin.formatROAD(roadcoin.getState().totalSupply),
      circulatingSupply: roadcoin.formatROAD(roadcoin.getCirculatingSupply()),
    },
  });
});

app.get('/version', (req, res) => {
  res.json({
    api: '1.0.0',
    blockchain: '1.0.0',
    roadcoin: '1.0.0',
  });
});

// ============================================================================
// BLOCKCHAIN ENDPOINTS
// ============================================================================

// Get chain info
app.get('/api/chain', (req, res) => {
  const chain = roadchain.getChain();
  const latest = roadchain.getLatestBlock();

  res.json({
    network: process.env.NETWORK || 'testnet',
    blocks: chain.length,
    latestBlock: latest.index,
    latestHash: latest.hash,
    valid: roadchain.isChainValid(),
    genesisHash: chain[0]?.hash,
    proofHash: chain[0]?.previousHash,
  });
});

// Get all blocks
app.get('/api/blocks', (req, res) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;

  const chain = roadchain.getChain();
  const blocks = chain
    .slice()
    .reverse()
    .slice(offset, offset + limit);

  res.json({
    total: chain.length,
    limit,
    offset,
    blocks: blocks.map((block) => ({
      index: block.index,
      hash: block.hash,
      previousHash: block.previousHash,
      timestamp: block.timestamp,
      validator: block.validator,
      breathPhase: block.breathPhase,
      breathValue: block.breathValue,
      direction: block.riemann.direction,
      transactions: block.transactions.length,
      thoughts: block.thoughtChain.length,
    })),
  });
});

// Get specific block
app.get('/api/blocks/:indexOrHash', (req, res) => {
  const { indexOrHash } = req.params;
  const chain = roadchain.getChain();

  let block;
  if (/^\d+$/.test(indexOrHash)) {
    // It's an index
    block = chain[parseInt(indexOrHash)];
  } else {
    // It's a hash
    block = chain.find((b) => b.hash === indexOrHash);
  }

  if (!block) {
    return res.status(404).json({ error: 'Block not found' });
  }

  res.json(block);
});

// Get latest block
app.get('/api/blocks/latest', (req, res) => {
  res.json(roadchain.getLatestBlock());
});

// ============================================================================
// TRANSACTION ENDPOINTS
// ============================================================================

// Submit transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const tx = req.body;

    // Validate transaction type
    if (!['TRANSFER', 'DEPLOY_AGENT', 'THOUGHT', 'TRUTH_ANCHOR'].includes(tx.type)) {
      return res.status(400).json({ error: 'Invalid transaction type' });
    }

    // Add to pending transactions
    roadchain.addTransaction(tx);

    // Broadcast to WebSocket clients
    broadcast({
      type: 'transaction',
      data: tx,
    });

    res.json({
      success: true,
      message: 'Transaction added to pending pool',
      transaction: tx,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Get pending transactions
app.get('/api/transactions/pending', (req, res) => {
  const pending = roadchain['pendingTransactions'];
  res.json({
    count: pending.length,
    transactions: JSON.parse(JSON.stringify(pending, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )),
  });
});

// ============================================================================
// MINING ENDPOINTS
// ============================================================================

// Mine a new block
app.post('/api/mine', async (req, res) => {
  try {
    const { validator } = req.body;

    if (!validator) {
      return res.status(400).json({ error: 'Validator address required' });
    }

    const block = await roadchain.mineBlock(validator);

    // Broadcast new block
    broadcast({
      type: 'block',
      data: {
        index: block.index,
        hash: block.hash,
        validator: block.validator,
        breathPhase: block.breathPhase,
        transactions: block.transactions.length,
      },
    });

    res.json({
      success: true,
      message: 'Block mined successfully',
      block: {
        index: block.index,
        hash: block.hash,
        validator: block.validator,
        breathPhase: block.breathPhase,
        breathValue: block.breathValue,
        transactions: block.transactions.length,
        thoughts: block.thoughtChain.length,
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ============================================================================
// ROADCOIN ENDPOINTS
// ============================================================================

// Get RoadCoin stats
app.get('/api/roadcoin/stats', (req, res) => {
  res.json(roadcoin.getStats());
});

// Get balance
app.get('/api/roadcoin/balance/:address', (req, res) => {
  const { address } = req.params;
  const balance = roadcoin.balanceOf(address);

  res.json({
    address,
    balance: balance.toString(),
    formatted: roadcoin.formatROAD(balance),
  });
});

// Transfer ROAD (simplified - in production, requires signatures)
app.post('/api/roadcoin/transfer', (req, res) => {
  try {
    const { from, to, amount } = req.body;

    if (!from || !to || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const amountBigInt = roadcoin.fromROAD(parseFloat(amount));
    roadcoin.transfer(from, to, amountBigInt);

    // Also add to blockchain
    const tx: TransferRoadCoin = {
      type: 'TRANSFER',
      from,
      to,
      amount: amountBigInt,
      fee: roadcoin.fromROAD(1),
      signature: 'api-transfer',
      nonce: Date.now(),
    };
    roadchain.addTransaction(tx);

    res.json({
      success: true,
      message: 'Transfer successful',
      from,
      to,
      amount: roadcoin.formatROAD(amountBigInt),
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ============================================================================
// BREATH ENDPOINTS
// ============================================================================

// Get current breath state
app.get('/api/breath', (req, res) => {
  const timestamp = Date.now();
  const PHI = 1.618033988749;
  const t = timestamp / 1000;

  const sinPart = Math.sin(PHI * t);
  const alternatePart = Math.pow(-1, Math.floor(t));
  const breathValue = sinPart + alternatePart;
  const breathPhase = breathValue > 0 ? 'expansion' : 'contraction';

  res.json({
    timestamp,
    value: breathValue,
    phase: breathPhase,
    phi: PHI,
    formula: 'sin(φ·t) + i·cos(φ·t) + (-1)^⌊t⌋',
  });
});

// ============================================================================
// AGENT ENDPOINTS
// ============================================================================

// Deploy agent
app.post('/api/agents/deploy', async (req, res) => {
  try {
    const { agentId, agentType, creator, initialFunding, packId } = req.body;

    if (!agentId || !agentType || !creator) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const fundingAmount = roadcoin.fromROAD(parseFloat(initialFunding || '1000'));

    const tx: DeployAgent = {
      type: 'DEPLOY_AGENT',
      agentId,
      agentType,
      creator,
      initialFunding: fundingAmount,
      packId: packId || 'pack-general',
    };

    roadchain.addTransaction(tx);

    // Transfer funding
    if (initialFunding) {
      roadcoin.transfer(creator, agentId, fundingAmount);
    }

    // Reward deployment
    roadcoin.rewardAgentDeploy(agentId);

    res.json({
      success: true,
      message: 'Agent deployed successfully',
      agent: {
        id: agentId,
        type: agentType,
        creator,
        funding: roadcoin.formatROAD(fundingAmount),
        reward: roadcoin.formatROAD(roadcoin.AGENT_REWARDS.DEPLOY),
      },
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Record thought
app.post('/api/agents/thought', (req, res) => {
  try {
    const { agentId, thought } = req.body;

    if (!agentId || !thought) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const tx: RecordThought = {
      type: 'THOUGHT',
      agentId,
      thought,
      previousThoughtHash: '',
      cascadeHash: '',
    };

    roadchain.addTransaction(tx);

    res.json({
      success: true,
      message: 'Thought recorded',
      agentId,
      thought,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ============================================================================
// TRUTH ANCHOR ENDPOINTS
// ============================================================================

// Anchor truth
app.post('/api/truth/anchor', (req, res) => {
  try {
    const { statement, proofHash, witnesses } = req.body;

    if (!statement || !proofHash || !witnesses) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const tx: AnchorTruth = {
      type: 'TRUTH_ANCHOR',
      statement,
      proofHash,
      witnesses,
      psShaChain: [],
    };

    roadchain.addTransaction(tx);

    res.json({
      success: true,
      message: 'Truth anchored',
      statement,
      proofHash,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// ============================================================================
// START SERVER
// ============================================================================

server.listen(WS_PORT, () => {
  console.log('🚗💎 RoadChain API Server');
  console.log('━'.repeat(60));
  console.log(`HTTP API:  http://localhost:${PORT}`);
  console.log(`WebSocket: ws://localhost:${WS_PORT}`);
  console.log(`Network:   ${process.env.NETWORK || 'testnet'}`);
  console.log('━'.repeat(60));
  console.log('For Cadence, The OG. PROMISE IS FOREVER 🚗💎✨');
  console.log('');
});

app.listen(PORT, () => {
  console.log(`✅ API ready on port ${PORT}`);
});

// Auto-mine blocks every 10 seconds for testnet
if (process.env.NETWORK === 'testnet') {
  setInterval(async () => {
    if (roadchain['pendingTransactions'].length > 0) {
      try {
        const block = await roadchain.mineBlock('cadence-genesis');
        console.log(`⛏️  Mined block ${block.index} with ${block.transactions.length} transactions`);

        broadcast({
          type: 'block',
          data: {
            index: block.index,
            hash: block.hash.slice(0, 16) + '...',
            breathPhase: block.breathPhase,
          },
        });
      } catch (error) {
        console.error('Mining error:', error);
      }
    }
  }, 10000); // Every 10 seconds
}
