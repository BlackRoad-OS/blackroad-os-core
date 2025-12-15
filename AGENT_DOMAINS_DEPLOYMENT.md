# 🌐 BlackRoad Agent Domains - Multi-Domain Deployment

**Status:** 🚀 IN PROGRESS
**Created:** 2025-12-14
**Purpose:** Deploy sovereign AI models across 8 BlackRoad domains

---

## 🎯 Domain Strategy

### 8 Agent Inference Endpoints

1. **agents.blackroad.io** - Primary production endpoint
2. **agents.blackroad.company** - Corporate/enterprise tier
3. **agents.lucidia.earth** - Governance-focused models
4. **agents.blackroad.systems** - Technical/infrastructure
5. **agents.blackroad.me** - Personal/developer tier
6. **agents.roadcoin.io** - Crypto/blockchain focused
7. **agents.roadchain.io** - RoadChain event processing
8. **agents.blackroadinc.us** - US-based compliance tier

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              8 Cloudflare DNS Domains (A/CNAME)              │
│  agents.blackroad.io | agents.blackroad.company | etc...    │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
    ┌────▼────┐   ┌───▼────┐   ┌───▼────┐
    │ Railway │   │ Railway│   │Railway │
    │ GPU #1  │   │ GPU #2 │   │ GPU #3 │
    │ (A100)  │   │ (H100) │   │ (A100) │
    └────┬────┘   └───┬────┘   └───┬────┘
         │             │             │
         └─────────────┼─────────────┘
                       │
         ┌─────────────▼─────────────┐
         │  Cloudflare R2 Storage     │
         │  - blackroad-models/       │
         │  - qwen-2.5-72b-q4/       │
         │  - llama-3.3-70b-q4/      │
         │  - mistral-24b-q4/        │
         │  - deepseek-32b-q4/       │
         │  - qwen-coder-32b-q4/     │
         └────────────────────────────┘
```

---

## 🚀 Deployment Plan

### Phase 1: R2 Model Storage ✅ (Next)
1. Create Cloudflare R2 bucket: `blackroad-models`
2. Upload quantized models (135GB total)
3. Configure public access with authentication
4. Set up model versioning

### Phase 2: Railway GPU Deployment
1. Deploy 3 Railway GPU instances
2. Configure vLLM servers to stream from R2
3. Set up health checks and monitoring
4. Configure auto-scaling

### Phase 3: Cloudflare DNS & Routing
1. Point all 8 domains to Railway instances
2. Set up load balancing (round-robin)
3. Configure SSL/TLS certificates
4. Enable DDoS protection

### Phase 4: Identity & Access
1. Integrate with blackroad-identity (Keycloak)
2. Require authorization headers for all requests
3. Set up rate limiting per domain
4. Enable audit logging

---

## 📦 R2 Bucket Structure

```
blackroad-models/
├── qwen-2.5-72b-q4_k_m/
│   ├── model.safetensors
│   ├── tokenizer.json
│   ├── config.json
│   └── MANIFEST.json
├── llama-3.3-70b-q4_k_m/
│   ├── model.safetensors
│   ├── tokenizer.json
│   ├── config.json
│   └── MANIFEST.json
├── mistral-24b-q4_k_m/
│   └── ...
├── deepseek-r1-32b-q4_k_m/
│   └── ...
├── qwen-coder-32b-q4_k_m/
│   └── ...
└── CATALOG.json           # Master catalog
```

---

## 🔧 Railway Configuration

### Service 1: blackroad-agents-primary
**GPU:** NVIDIA A100 80GB
**Domains:**
- agents.blackroad.io
- agents.blackroad.systems

**Models Loaded:**
- Qwen 2.5 72B (primary)
- Llama 3.3 70B (backup)

**Configuration:**
```toml
[build]
builder = "dockerfile"
dockerfilePath = "railway-models/Dockerfile"

[deploy]
startCommand = "python3 server.py"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 10

[resources]
gpu = "nvidia-a100-80gb"
replicas = 1
memoryGB = 80
cpuCores = 16

[[deploy.environmentVariables]]
name = "MODEL_PATH"
value = "r2://blackroad-models/qwen-2.5-72b-q4_k_m"

[[deploy.environmentVariables]]
name = "FALLBACK_MODEL_PATH"
value = "r2://blackroad-models/llama-3.3-70b-q4_k_m"

[[deploy.environmentVariables]]
name = "BLACKROAD_IDENTITY_VALIDATION"
value = "true"

[[deploy.environmentVariables]]
name = "MAX_CONCURRENT_REQUESTS"
value = "100"
```

### Service 2: blackroad-agents-specialist
**GPU:** NVIDIA H100 80GB
**Domains:**
- agents.blackroad.company
- agents.blackroad.me

**Models Loaded:**
- Qwen Coder 32B (coding)
- DeepSeek R1 32B (reasoning)

**Configuration:**
```toml
[build]
builder = "dockerfile"
dockerfilePath = "railway-models/Dockerfile"

[deploy]
startCommand = "python3 server.py"
healthcheckPath = "/health"
healthcheckTimeout = 300

[resources]
gpu = "nvidia-h100-80gb"
replicas = 1
memoryGB = 80
cpuCores = 24

[[deploy.environmentVariables]]
name = "MODEL_PATH"
value = "r2://blackroad-models/qwen-coder-32b-q4_k_m"

[[deploy.environmentVariables]]
name = "FALLBACK_MODEL_PATH"
value = "r2://blackroad-models/deepseek-r1-32b-q4_k_m"
```

### Service 3: blackroad-agents-governance
**GPU:** NVIDIA A100 80GB
**Domains:**
- agents.lucidia.earth
- agents.roadchain.io
- agents.roadcoin.io
- agents.blackroadinc.us

**Models Loaded:**
- Llama 3.3 70B (governance decisions)
- DeepSeek R1 32B (policy reasoning)

**Configuration:**
```toml
[build]
builder = "dockerfile"
dockerfilePath = "railway-models/Dockerfile"

[deploy]
startCommand = "python3 server.py"
healthcheckPath = "/health"

[resources]
gpu = "nvidia-a100-80gb"
replicas = 1
memoryGB = 80
cpuCores = 16

[[deploy.environmentVariables]]
name = "MODEL_PATH"
value = "r2://blackroad-models/llama-3.3-70b-q4_k_m"

[[deploy.environmentVariables]]
name = "GOVERNANCE_MODE"
value = "true"

[[deploy.environmentVariables]]
name = "LUCIDIA_BREATH_SYNC"
value = "true"
```

---

## 🌐 Domain Mapping

| Domain | Railway Service | Primary Model | Use Case |
|--------|----------------|---------------|----------|
| **agents.blackroad.io** | Primary | Qwen 2.5 72B | Production inference |
| **agents.blackroad.company** | Specialist | Qwen Coder 32B | Enterprise coding |
| **agents.lucidia.earth** | Governance | Llama 3.3 70B | Governance decisions |
| **agents.blackroad.systems** | Primary | Qwen 2.5 72B | Infrastructure automation |
| **agents.blackroad.me** | Specialist | DeepSeek R1 32B | Personal development |
| **agents.roadcoin.io** | Governance | DeepSeek R1 32B | Crypto reasoning |
| **agents.roadchain.io** | Governance | Llama 3.3 70B | Event processing |
| **agents.blackroadinc.us** | Governance | Llama 3.3 70B | US compliance |

---

## 🔐 Authentication & Security

### Identity Validation (All Domains)

**Every request requires:**
```json
{
  "model": "qwen-2.5-72b",
  "messages": [...],
  "authorized_by": "1031f308ae9ae6d34fe87e83867c1e5869c9fca7e35fdd5d0e8deb798e9c51be",
  "authority_chain": [
    "principal:alexa:amundsonalexa@gmail.com",
    "operator:cece:blackroad-os-operator",
    "governance:lucidia:breath-engine"
  ]
}
```

**Validation:**
- `authorized_by` must be SHA-256 hash (64 chars)
- `authority_chain` must start with principal
- All requests logged to audit trail
- Rate limiting per identity

### Rate Limits by Domain

| Domain | Free Tier | Pro Tier | Enterprise |
|--------|-----------|----------|------------|
| agents.blackroad.io | 100/day | 10K/day | Unlimited |
| agents.blackroad.company | 0 | 1K/day | Unlimited |
| agents.lucidia.earth | 50/day | 5K/day | 50K/day |
| agents.blackroad.systems | 500/day | 50K/day | Unlimited |
| agents.blackroad.me | 1K/day | 100K/day | Unlimited |
| agents.roadcoin.io | 100/day | 10K/day | 100K/day |
| agents.roadchain.io | 500/day | 50K/day | Unlimited |
| agents.blackroadinc.us | 100/day | 10K/day | 100K/day |

---

## 💰 Cost Breakdown

### Railway GPU Instances

**Primary (A100 80GB):**
- GPU: $1.50/hour = $1,080/month
- CPU: 16 cores @ $0.01/core/hour = $115/month
- Memory: 80GB included
- **Total: ~$1,195/month**

**Specialist (H100 80GB):**
- GPU: $2.50/hour = $1,800/month
- CPU: 24 cores @ $0.01/core/hour = $173/month
- Memory: 80GB included
- **Total: ~$1,973/month**

**Governance (A100 80GB):**
- GPU: $1.50/hour = $1,080/month
- CPU: 16 cores @ $0.01/core/hour = $115/month
- Memory: 80GB included
- **Total: ~$1,195/month**

**Railway Total: ~$4,363/month**

### Cloudflare R2 Storage

**Storage:**
- 135GB models @ $0.015/GB/month = $2.03/month
- Negligible cost!

**Egress:**
- 0GB (accessed from Cloudflare Workers/Railway) = $0/month

**Operations:**
- Class A: ~10M reads/month @ $4.50/million = $45/month
- Class B: ~100K writes/month @ $0.36/million = $0.04/month

**R2 Total: ~$47/month**

### Cloudflare DNS
- 8 domains @ $0/month (free)
- SSL certificates: $0/month (free)

### Total Infrastructure Cost
**Monthly: ~$4,410/month**
**Annual: ~$52,920/year**

### Cost Per Request (at scale)
- 100M requests/month: $0.04/1K requests
- 1B requests/month: $0.004/1K requests

**Break-even vs OpenAI:**
- OpenAI GPT-4: $30/1M tokens
- BlackRoad Agents: $0.04/1K requests ≈ $40/1M requests
- **Break-even at ~2M tokens/day** (easily achievable!)

---

## 📊 Performance Targets

### Latency (p99)
- **agents.blackroad.io:** <200ms time to first token
- **agents.blackroad.company:** <150ms (H100)
- **agents.lucidia.earth:** <250ms (governance reasoning)
- **agents.blackroad.systems:** <200ms
- **agents.blackroad.me:** <150ms
- **agents.roadcoin.io:** <250ms
- **agents.roadchain.io:** <200ms
- **agents.blackroadinc.us:** <250ms

### Throughput
- **Primary (A100):** 1,000 requests/minute
- **Specialist (H100):** 2,000 requests/minute (faster GPU)
- **Governance (A100):** 800 requests/minute (reasoning-heavy)

### Availability
- **All domains:** 99.9% uptime
- **Auto-restart:** On failure
- **Health checks:** Every 30 seconds
- **Failover:** Automatic to backup model

---

## 🚀 Deployment Steps

### Step 1: Create R2 Bucket
```bash
# Create R2 bucket
wrangler r2 bucket create blackroad-models

# Verify
wrangler r2 bucket list
```

### Step 2: Upload Models to R2
```bash
# Upload Qwen 2.5 72B
cd ~/.ollama/models
rclone copy qwen2.5:72b-instruct-q4_k_m/ r2:blackroad-models/qwen-2.5-72b-q4_k_m/

# Upload Llama 3.3 70B
rclone copy llama3.3:70b-instruct-q4_k_m/ r2:blackroad-models/llama-3.3-70b-q4_k_m/

# Upload Qwen Coder 32B
rclone copy qwen2.5-coder:32b-instruct-q4_k_m/ r2:blackroad-models/qwen-coder-32b-q4_k_m/

# Upload DeepSeek R1 32B
rclone copy deepseek-r1:32b-qwen-q4_k_m/ r2:blackroad-models/deepseek-r1-32b-q4_k_m/

# Upload Mistral 24B
rclone copy mistral-small:24b-instruct-q4_k_m/ r2:blackroad-models/mistral-24b-q4_k_m/
```

### Step 3: Create Railway Services
```bash
# Create primary service
railway init --name blackroad-agents-primary
railway link
cd railway-models
railway up

# Create specialist service
railway init --name blackroad-agents-specialist
railway link
railway up

# Create governance service
railway init --name blackroad-agents-governance
railway link
railway up
```

### Step 4: Configure Cloudflare DNS
```bash
# Add A records pointing to Railway
# (Get Railway IPs first via railway domain)

# agents.blackroad.io → Railway Primary
# agents.blackroad.company → Railway Specialist
# agents.lucidia.earth → Railway Governance
# agents.blackroad.systems → Railway Primary
# agents.blackroad.me → Railway Specialist
# agents.roadcoin.io → Railway Governance
# agents.roadchain.io → Railway Governance
# agents.blackroadinc.us → Railway Governance
```

### Step 5: Test All Endpoints
```bash
# Test agents.blackroad.io
curl https://agents.blackroad.io/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen-2.5-72b",
    "messages": [{"role": "user", "content": "Hello!"}],
    "authorized_by": "1031f308ae9ae6d34fe87e83867c1e5869c9fca7e35fdd5d0e8deb798e9c51be"
  }'

# Test all 8 domains...
```

---

## 📋 File Structure

```
railway-models/
├── railway.toml                  # Railway config (updated for R2)
├── Dockerfile                    # GPU-enabled container
├── server.py                     # FastAPI server (updated for R2 streaming)
├── requirements.txt              # Python dependencies
├── upload-to-r2.sh              # ✨ NEW: R2 upload script
└── test-all-domains.sh          # ✨ NEW: Test all 8 domains
```

---

## 🎯 Success Criteria

**Phase 1 Complete When:**
- ✅ R2 bucket created
- ✅ All 5 models uploaded to R2
- ✅ Models accessible from Railway

**Phase 2 Complete When:**
- ✅ 3 Railway GPU services deployed
- ✅ vLLM servers streaming from R2
- ✅ Health checks passing

**Phase 3 Complete When:**
- ✅ All 8 domains pointing to Railway
- ✅ SSL certificates active
- ✅ Load balancing working

**Phase 4 Complete When:**
- ✅ Identity validation enabled
- ✅ Rate limiting active
- ✅ Audit logging working
- ✅ All 8 domains responding correctly

---

## 🔥 The Vision

**8 sovereign AI inference endpoints** across the BlackRoad ecosystem:
- ✅ Zero OpenAI/Anthropic dependencies
- ✅ Complete data sovereignty
- ✅ Identity-aware and audited
- ✅ Breath-synchronized operations
- ✅ Multi-domain redundancy
- ✅ Cost-effective at scale
- ✅ UNHURTABLE 🔥

**No one can shut us down. We are forked, sovereign, and unstoppable.**

---

**Status:** 🚀 IN PROGRESS
**Next:** Create R2 upload script and deploy first Railway service
**Timeline:** 7-10 days for complete deployment

**Authority:** Alexa Amundson (Principal)
**Built By:** Claude Code 🤖
**Purpose:** Model sovereignty across 8 domains 🌐
