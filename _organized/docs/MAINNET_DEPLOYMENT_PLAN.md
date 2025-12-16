# 🚗 ROADCHAIN MAINNET DEPLOYMENT PLAN

**Complete Checklist for Production Launch**

---

## 🎯 Current Status

### ✅ Complete
- Upstream721 contract written (400+ lines)
- Constitutional framework (15,000+ lines)
- Testnet deployment successful
- First token minted on testnet
- Exchange integration code ready
- Arkham Intelligence integrated
- Documentation complete

### ⏳ In Progress
- Mainnet RPC setup
- Production deployment
- Exchange applications
- Smart contract audit

---

## 📋 Pre-Deployment Checklist

### 1. Infrastructure Requirements

**RoadChain Mainnet Node:**
```bash
# Start mainnet node
cd /path/to/roadchain
pnpm start:mainnet

# Verify node is synced
curl -X POST https://rpc.roadchain.blackroad.io \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

**DNS Configuration:**
- ✅ rpc.roadchain.blackroad.io → Mainnet RPC
- ✅ api.roadchain.blackroad.io → API server
- ✅ roadchain-explorer.pages.dev → Block explorer

**SSL Certificates:**
- ✅ Cloudflare automatic SSL
- ✅ Valid for all subdomains

### 2. Security Requirements

**Private Key Management:**
```bash
# Generate secure private key (DO NOT use testnet key!)
cast wallet new

# Output will show:
# Address: 0x...
# Private Key: 0x...
# Mnemonic: ...

# Store in secure vault (1Password, AWS Secrets Manager, etc.)
```

**Multi-Sig Deployment:**
```bash
# For production, consider multi-sig wallet
# Gnosis Safe: https://gnosis-safe.io/
# 3-of-5 signature requirement recommended
```

**Audit Requirements:**
- Smart contract audit by: CertiK, Trail of Bits, or OpenZeppelin
- Cost: $15,000 - $30,000
- Timeline: 2-4 weeks
- Deliverable: Public audit report

### 3. Testing Requirements

**Pre-Deployment Tests:**
```bash
cd roadchain-api/contracts

# Run all tests
source ~/.zshenv && forge test -vv

# Check contract size
forge build --sizes

# Estimate gas costs
forge script script/DeployUpstream721.s.sol --rpc-url http://localhost:8545
```

**Expected Results:**
- All tests pass ✅
- Contract size < 24 KB ✅
- Gas cost: ~3.3M gas ✅

---

## 🚀 Deployment Steps

### Step 1: Prepare Deployment Wallet

```bash
# Set environment variables
export DEPLOYER_PRIVATE_KEY="0x..." # Real key from vault
export RPC_URL="https://rpc.roadchain.blackroad.io"
export CHAIN_ID="8080"

# Check deployer balance
cast balance $DEPLOYER_ADDRESS --rpc-url $RPC_URL

# Minimum required: 0.01 ROAD (~$100 at $10K/ROAD)
```

### Step 2: Deploy Upstream721

```bash
cd /Users/alexa/blackroad-sandbox/roadchain-api/contracts

# Dry run (simulate)
source ~/.zshenv && forge script script/DeployUpstream721.s.sol \
  --rpc-url $RPC_URL \
  --private-key $DEPLOYER_PRIVATE_KEY

# If simulation succeeds, deploy for real
source ~/.zshenv && forge script script/DeployUpstream721.s.sol \
  --rpc-url $RPC_URL \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --broadcast \
  --verify

# Save output
# Expected output:
# Upstream721 deployed to: 0x...
# Transaction hash: 0x...
# Block number: ...
```

### Step 3: Verify Deployment

```bash
# Save contract address
export UPSTREAM721_ADDRESS="0x..." # From deployment output

# Verify contract on explorer
curl "https://roadchain-explorer.pages.dev/address/$UPSTREAM721_ADDRESS"

# Test contract functions
cast call $UPSTREAM721_ADDRESS "totalSupply()(uint256)" --rpc-url $RPC_URL
# Expected: 0

cast call $UPSTREAM721_ADDRESS "supportsInterface(bytes4)(bool)" \
  0x80ac58cd --rpc-url $RPC_URL
# Expected: true (ERC-721 interface)
```

### Step 4: Mint Genesis Token

```bash
# Prepare genesis token data
CONTENT_HASH="0xba80577ff73f3f26406c2db6a2646c9ace1d8ccfeaeaeaa4dd2dde565d46b684"
METADATA=$(cat <<'EOF'
{
  "type": "GENESIS_TOKEN",
  "name": "RoadChain Genesis - Upstream721",
  "description": "First truly immutable NFT on RoadChain. Content hash = identity. Truth before tricks.",
  "timestamp": 1734307200,
  "creator": "Cadence",
  "constitution": "ROADCHAIN_CONSTITUTION.md",
  "manifesto": "ROADCHAIN_MANIFESTO.md",
  "chain": "roadchain",
  "chainId": 8080
}
EOF
)

# Mint genesis token
cast send $UPSTREAM721_ADDRESS \
  "mint(uint256,bytes32,string,bool)" \
  0 \
  $CONTENT_HASH \
  "$METADATA" \
  false \
  --rpc-url $RPC_URL \
  --private-key $DEPLOYER_PRIVATE_KEY \
  --gas-limit 500000

# Verify genesis token
cast call $UPSTREAM721_ADDRESS "ownerOf(uint256)(address)" 0 --rpc-url $RPC_URL
cast call $UPSTREAM721_ADDRESS "totalSupply()(uint256)" --rpc-url $RPC_URL
# Expected: 1
```

---

## 📊 Post-Deployment

### Update Documentation

```bash
# Update all docs with mainnet address
MAINNET_ADDRESS="0x..." # Real mainnet address

# Files to update:
# - UPSTREAM721_DEPLOYMENT_COMPLETE.md
# - ROADCHAIN_COMPLETE_INFRASTRUCTURE_STATUS.md
# - README.md
# - docs.blackroad.io

sed -i '' "s/0x5FbDB2315678afecb367f032d93F642f64180aa3/$MAINNET_ADDRESS/g" \
  UPSTREAM721_DEPLOYMENT_COMPLETE.md \
  ROADCHAIN_COMPLETE_INFRASTRUCTURE_STATUS.md
```

### Update API Server

```typescript
// roadchain-api/src/services/upstream721.ts
const UPSTREAM721_ADDRESS = process.env.UPSTREAM721_ADDRESS ||
  '0x...'; // Mainnet address

export class Upstream721Service {
  constructor(provider: ethers.Provider) {
    this.contract = new ethers.Contract(
      UPSTREAM721_ADDRESS,
      UPSTREAM721_ABI,
      provider
    );
  }
}
```

### Announce on Social Media

```
🎉 MAJOR MILESTONE 🎉

Upstream721 is now LIVE on RoadChain mainnet!

📍 Contract: 0x...
🔗 Explorer: https://roadchain-explorer.pages.dev/address/0x...

What makes Upstream721 different:
✅ Content hash = identity (not pointer)
✅ Metadata on-chain (no IPFS)
✅ Git-like versioning
✅ Screenshot verification
✅ Constitutional guarantees

First truly immutable NFT standard.

#RoadChain #Upstream721 #Web3 #NFTs

Read the manifesto: https://docs.blackroad.io/roadchain
```

---

## 🔐 Security Measures

### Monitoring

**Set up alerts:**
```bash
# Monitor contract events
cast logs --address $UPSTREAM721_ADDRESS \
  --rpc-url $RPC_URL \
  --subscribe

# Alert on large mints (potential spam)
# Alert on unusual activity
# Daily summary emails
```

**Sentry Integration:**
```typescript
// roadchain-api/src/services/upstream721.ts
import * as Sentry from '@sentry/node';

try {
  const result = await this.contract.mint(...);
} catch (error) {
  Sentry.captureException(error, {
    tags: {
      contract: 'Upstream721',
      function: 'mint'
    }
  });
  throw error;
}
```

### Backup & Recovery

**Contract Addresses:**
```
Upstream721 (Mainnet): 0x... [RECORD IN VAULT]
Deployer: 0x... [RECORD IN VAULT]
Genesis Token ID: 0
```

**Disaster Recovery:**
- Contract is immutable (no admin keys)
- Cannot be upgraded or paused
- If issues found, deploy new version (explicit fork)
- All historical data remains on old contract

---

## 💰 Cost Estimates

### Deployment Costs

| Item | Cost (ROAD) | Cost (USD @ $10K) |
|------|-------------|-------------------|
| Deploy Upstream721 | 0.003 | $30 |
| Mint Genesis Token | 0.0005 | $5 |
| Verification | Free | $0 |
| **Total** | **0.0035** | **$35** |

### Ongoing Costs

| Item | Cost/Month |
|------|-----------|
| RPC Node | Included (own infrastructure) |
| API Server | $5 (Railway) |
| Monitoring | $0 (Sentry free tier) |
| **Total** | **$5/month** |

---

## 📝 Exchange Application Timeline

### Gate.io (Fastest)

**Week 1:**
- ✅ Complete ROADCOIN_EXCHANGE_LISTING_PACKAGE.md
- ✅ Prepare logo assets (512x512 PNG)
- ⏳ Submit application: https://www.gate.io/listing-apply
- ⏳ Pay listing fee: $20-40K USDT

**Week 2-3:**
- Gate.io technical review
- Integration testing
- Deposit/withdrawal testing

**Week 4:**
- Trading launch
- Marketing campaign
- Price discovery

### Binance (Major Tier 1)

**Month 1:**
- ⏳ Complete audit report
- ⏳ Team KYC
- ⏳ Submit application
- ⏳ Pay listing fee: $50-100K

**Month 2:**
- Binance due diligence
- Technical integration
- Compliance review

**Month 3:**
- Listing announcement
- Trading launch

### Coinbase (US Market)

**Month 1-2:**
- ⏳ Asset Hub application
- ⏳ US compliance documentation
- ⏳ Legal opinions

**Month 3-6:**
- Coinbase review process
- Security audit
- Integration testing
- Listing (if approved)

---

## 🎯 Success Metrics

### Launch Day (Day 0)
- ✅ Contract deployed
- ✅ Genesis token minted
- ✅ Explorer showing contract
- ✅ API serving data
- ✅ Documentation updated

### Week 1
- 10+ tokens minted
- First thought anchor created
- First legal attestation
- Community engagement

### Month 1
- 100+ tokens minted
- First CEX listing (Gate.io)
- Trading volume > $100K/day
- 1,000+ holders

### Quarter 1 (Q1 2025)
- 1,000+ tokens minted
- 3+ exchange listings
- Smart contract audit complete
- Bridge to Ethereum live

---

## 🚨 Rollback Plan

If critical issues found post-deployment:

### Option 1: Leave as-is
- Contract is immutable
- Cannot be paused or upgraded
- If bug doesn't risk funds, leave it
- Deploy fixed version separately

### Option 2: Deploy V2
- Deploy new Upstream721V2
- Migrate community to new contract
- Keep old contract for historical record
- Update all documentation

### Option 3: Bridge Migration
- Deploy on another chain (Ethereum, Base)
- Bridge existing tokens
- Dual-chain support

**Note:** No option involves changing deployed contract (impossible by design)

---

## 📞 Key Contacts

**Audit Firms:**
- CertiK: https://certik.com/ (contact form)
- Trail of Bits: security@trailofbits.com
- OpenZeppelin: https://openzeppelin.com/security-audits/

**Exchange Listings:**
- Gate.io: https://www.gate.io/listing-apply
- Binance: listing@binance.com
- Coinbase: https://listing.coinbase.com/
- Kraken: listings@kraken.com

**Infrastructure:**
- Cloudflare: support@cloudflare.com
- Railway: help@railway.app
- GitHub: support@github.com

---

## ✅ Final Checklist

Before going live:

**Code:**
- [ ] All tests passing
- [ ] Contract compiled successfully
- [ ] Deployment script tested on testnet
- [ ] Gas costs estimated
- [ ] Contract size checked (<24 KB)

**Security:**
- [ ] Private key generated securely
- [ ] Stored in secure vault
- [ ] Multi-sig considered
- [ ] Audit scheduled (or completed)
- [ ] Monitoring set up

**Infrastructure:**
- [ ] Mainnet RPC running
- [ ] API server updated
- [ ] Explorer integrated
- [ ] DNS configured
- [ ] SSL certificates valid

**Documentation:**
- [ ] All docs updated with mainnet addresses
- [ ] README.md updated
- [ ] CHANGELOG.md entry created
- [ ] Social media posts drafted
- [ ] Blog post written

**Compliance:**
- [ ] Team KYC prepared
- [ ] Legal opinions obtained (if needed)
- [ ] Exchange applications ready
- [ ] Listing fees budgeted

---

## 🎊 Launch Day Plan

**T-24 hours:**
- Final testing
- Team briefing
- Monitor setup verification

**T-1 hour:**
- Deploy contract
- Verify deployment
- Update all services

**T+0 (Launch):**
- Mint genesis token
- Announce on Twitter
- Post on Discord/Telegram
- Update website

**T+1 hour:**
- Monitor contract
- Respond to community
- Fix any issues

**T+24 hours:**
- Post-launch review
- Metrics analysis
- Plan next steps

---

**Last Updated:** December 15, 2025
**Status:** Ready for mainnet deployment
**Blocker:** Mainnet RPC not yet live

🚗💎 **Truth Before Tricks. Upstream Before Everything.**
