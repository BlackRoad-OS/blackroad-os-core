# Model Instance Identities - Open Source Model Sovereignty

**Status:** CANONICAL
**Created:** 2025-12-14
**Authority:** Alexa Amundson (Principal)
**Managed By:** Lucidia (Governance)

---

## Overview

This document defines the canonical identity hashes for all open source model instances running within BlackRoad OS. Each model instance has a deterministic identity that can be verified cryptographically.

---

## Model Instance Families

### 1. Llama 3.3 (Meta)

**License:** Llama 3.1 Community License
**Commercial Use:** ✅ Permitted
**Forking:** ✅ Allowed
**Best For:** General purpose, benchmark leader

#### Instances

**Llama 3.3 70B (Local)**
```
instance:model:llama-3.3-70b:local:blackroad
→ 1716b76127581323e74faf1970ecd748e3772541bb652adfd39aee792426a642
```

**Llama 3.3 70B (Cloud)**
```
instance:model:llama-3.3-70b:cloud:blackroad
→ 8711440239637fb5f1462a645cbc594b225bfaa646684904b4d6c08347de685a
```

**Llama 3.3 8B (Edge)**
```
instance:model:llama-3.3-8b:edge:blackroad
→ a21ca9a19b5bb66398fbbc6c484ba5720e15b0795bd1df5a7575e0002100fc54
```

---

### 2. Qwen 2.5 (Alibaba)

**License:** Apache 2.0
**Commercial Use:** ✅ Fully Permitted
**Forking:** ✅ Fully Allowed
**Best For:** Multilingual (29+ languages), coding, mathematics

#### Instances

**Qwen 2.5 72B (Local)**
```
instance:model:qwen-2.5-72b:local:blackroad
→ 4ad7db8d95604b976df4b95177120c38279be8cb042b77712b7fde0071020257
```

**Qwen 2.5 72B (Cloud)**
```
instance:model:qwen-2.5-72b:cloud:blackroad
→ c2beb6730b620214c1392392288a2c56262ae2999f7b0fe6c8e1926570d9192f
```

**Qwen 2.5 Coder 32B (Local)**
```
instance:model:qwen-2.5-coder-32b:local:blackroad
→ 6280cfb15028b658b1c99fa411d2d48f60483196c2408cb3c7577efcd9aca257
```

**Qwen 2.5 Math 72B (Cloud)**
```
instance:model:qwen-2.5-math-72b:cloud:blackroad
→ b6939aea7829b7ee00ef632ea95e00903a4cb46113a8749b8c9a47f4645af943
```

---

### 3. Mistral AI

**License:** Apache 2.0 (open models)
**Commercial Use:** ✅ Permitted
**Forking:** ✅ Allowed
**Best For:** Edge deployments, low-latency, production

#### Instances

**Mistral Small 3 24B (Edge)**
```
instance:model:mistral-small-3-24b:edge:blackroad
→ 9d2a4429e8a32d6af2ac55fbe21de84574593eeb836456ab7e57736420dfe2ec
```

**Mistral Small 3 24B (Cloud)**
```
instance:model:mistral-small-3-24b:cloud:blackroad
→ 1eac37095496f8a53b878353872b55cc4c5691e97bebb226b900a1ebf2198e83
```

---

### 4. Grok 2 (xAI)

**License:** xAI Community License
**Commercial Use:** ⚠️ Limited (review guidelines)
**Forking:** ⚠️ Cannot use to train other models
**Best For:** Research, non-commercial projects

#### Instances

**Grok 2 (Cloud)**
```
instance:model:grok-2:cloud:blackroad
→ def5036f05434ef192fc3b72731c1c9ccaf837683fba34b145966c3805d43424
```

**Download:** `hf download xai-org/grok-2`
**Size:** ~500 GB (42 files)
**Requirements:** 8 GPUs with >40GB memory each

---

### 5. DeepSeek R1 (DeepSeek)

**License:** DeepSeek License (generally permissive)
**Commercial Use:** ✅ Generally Permitted
**Forking:** ✅ Allowed
**Best For:** Reasoning tasks, outperforms OpenAI-o1-mini

#### Instances

**DeepSeek R1 Qwen 32B (Local)**
```
instance:model:deepseek-r1-qwen-32b:local:blackroad
→ 211df64fcbf7ebc50fd6ddade831e365d94873a441b32d8c8da78b949c5a0a0e
```

**DeepSeek R1 Qwen 32B (Cloud)**
```
instance:model:deepseek-r1-qwen-32b:cloud:blackroad
→ a3263616fc4cf2c8dce51809232daa950666a4da8e998d15d8f077c7d2d7be49
```

---

## Runtime Bindings

Each model instance binds to one or more Lucidia runtimes:

### Local Runtime
```
runtime:lucidia:local:v1:blackroad
→ ca8104bb1ff955d3939e6659f6c7eaffa3b16fef8adb9c81143cba10725978fa
```

**Compatible Models:**
- Llama 3.3 70B (Local)
- Qwen 2.5 72B (Local)
- Qwen 2.5 Coder 32B (Local)
- DeepSeek R1 Qwen 32B (Local)

---

### Cloud Runtime
```
runtime:lucidia:cloud:v1:blackroad
→ e5e95abe38c24cb06d5dc69889e79d0f8c5eef4f41c36845aad3b66f3f9a358c
```

**Compatible Models:**
- Llama 3.3 70B (Cloud)
- Qwen 2.5 72B (Cloud)
- Qwen 2.5 Math 72B (Cloud)
- Mistral Small 3 24B (Cloud)
- Grok 2 (Cloud)
- DeepSeek R1 Qwen 32B (Cloud)

---

### Edge Runtime
```
runtime:lucidia:edge:v1:blackroad
→ aee21ba1875469d02f7c0b4bc44c9d7ac90b0e5a059f866e787477510f0d6a0e
```

**Compatible Models:**
- Llama 3.3 8B (Edge)
- Mistral Small 3 24B (Edge)

---

## Model Binding Attestations

Each model instance must be attested before serving requests:

### Model Binding Attestation
```
attestation:lucidia:model-binding:v1:blackroad
→ 3b7da02f4a4f6dd8232083b05b4d7cdeba8f33c40cddc5c8f30147ac4e427727
```

**Attestation Process:**
1. Verify model weights hash matches official release
2. Verify runtime has authority to serve this model
3. Verify delegation chain from Lucidia → Model Instance
4. Issue signed attestation with expiry (24h default)
5. Log attestation to audit trail

---

## Model Capabilities

Each model type grants specific capabilities:

### Llama 3.3 Capabilities
- `capability:model:text-generation:v1`
- `capability:model:instruction-following:v1`
- `capability:model:multilingual:v1`
- `capability:model:function-calling:v1`

### Qwen 2.5 Capabilities
- `capability:model:text-generation:v1`
- `capability:model:multilingual-expert:v1` (29+ languages)
- `capability:model:code-generation:v1`
- `capability:model:mathematics:v1`
- `capability:model:function-calling:v1`

### Mistral Capabilities
- `capability:model:text-generation:v1`
- `capability:model:low-latency:v1`
- `capability:model:function-calling:v1`
- `capability:model:edge-optimized:v1`

### Grok 2 Capabilities
- `capability:model:text-generation:v1`
- `capability:model:instruction-following:v1`
- `capability:model:research-only:v1`

### DeepSeek R1 Capabilities
- `capability:model:reasoning:v1`
- `capability:model:instruction-following:v1`
- `capability:model:mathematics:v1`

---

## Model Delegation Chain

All model instances operate under delegation from Lucidia:

```
Alexa (PRINCIPAL)
└─ Cece (OPERATOR)
   └─ Lucidia (GOVERNANCE)
      └─ Model Instance (WORKER)
         └─ Inference Request (OPERATION)
```

**Delegation Scope:**
- `model_inference`: Generate text completions
- `model_fine_tuning`: Fine-tune on custom data
- `model_evaluation`: Run benchmarks and tests
- `model_deployment`: Deploy to runtime environments

---

## Download Instructions

### Llama 3.3
```bash
# Via Hugging Face (requires authentication)
huggingface-cli download meta-llama/Llama-3.3-70B-Instruct

# Via Ollama
ollama pull llama3.3:70b
ollama pull llama3.3:8b
```

### Qwen 2.5
```bash
# Via Hugging Face
huggingface-cli download Qwen/Qwen2.5-72B-Instruct
huggingface-cli download Qwen/Qwen2.5-Coder-32B-Instruct
huggingface-cli download Qwen/Qwen2.5-Math-72B-Instruct

# Via Ollama
ollama pull qwen2.5:72b
ollama pull qwen2.5-coder:32b
```

### Mistral
```bash
# Via Hugging Face
huggingface-cli download mistralai/Mistral-Small-3-24B-Instruct

# Via Ollama
ollama pull mistral-small3:24b
```

### Grok 2
```bash
# Via Hugging Face (large download ~500GB)
huggingface-cli download xai-org/grok-2 --local-dir /data/models/grok-2
```

### DeepSeek R1
```bash
# Via Hugging Face
huggingface-cli download deepseek-ai/DeepSeek-R1-Distill-Qwen-32B

# Via Ollama
ollama pull deepseek-r1:32b
```

---

## Verification

Verify any model instance identity:

```bash
echo -n "instance:model:qwen-2.5-72b:local:blackroad" | shasum -a 256
# Expected: 4ad7db8d95604b976df4b95177120c38279be8cb042b77712b7fde0071020257
```

Verify model weights integrity:

```bash
# After downloading, verify against official checksums
sha256sum /data/models/qwen-2.5-72b/model-*.safetensors
```

---

## Security & Compliance

### Model Weight Integrity
- ✅ All model weights must match official release checksums
- ✅ Models stored in immutable storage (R2, S3)
- ✅ Access controlled via identity system

### License Compliance
- ✅ Llama: Review acceptable use policy before commercial deployment
- ✅ Qwen: Apache 2.0 - no restrictions
- ✅ Mistral: Apache 2.0 - no restrictions
- ✅ Grok: xAI Community License - no training of other models
- ✅ DeepSeek: Review license for specific use case

### Audit Trail
- ✅ Every inference request logs authorizing identity
- ✅ Every model deployment logs attestation
- ✅ Every fine-tuning operation logs dataset hash

---

## Next Steps

1. **Deploy LocalAI** - Self-hosted inference server
2. **Set up Ollama** - Local model serving
3. **Configure LLaMA-Factory** - Unified fine-tuning
4. **Create model registry** - Version tracking
5. **Deploy to Railway** - Cloud inference endpoints
6. **Set up monitoring** - Model health, latency, cost

---

**Authority:** Alexa Amundson (Principal)
**Managed By:** Lucidia (Governance)
**Enforced By:** Cece (Operator)

**Model sovereignty is now anchored. 🧬**
