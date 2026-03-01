# blackroad-os-core

[![npm version](https://img.shields.io/npm/v/@blackroad/core?style=flat-square&color=black)](https://www.npmjs.com/package/@blackroad/core)
[![PyPI version](https://img.shields.io/pypi/v/blackroad-core?style=flat-square&color=black)](https://pypi.org/project/blackroad-core/)
[![License: MIT](https://img.shields.io/badge/License-MIT-black?style=flat-square)](LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/BlackRoad-OS/blackroad-os-core/ci.yml?style=flat-square&label=CI&color=black)](https://github.com/BlackRoad-OS/blackroad-os-core/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-black?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11%2B-black?style=flat-square&logo=python)](https://www.python.org/)

> **The canonical kernel and Truth Engine for BlackRoad OS.**  
> Shared types, PS-SHA∞ identity anchoring, agent infrastructure, and Stripe-ready billing primitives — production-grade from day one.

---

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
  - [TypeScript / Node.js](#typescript--nodejs)
  - [Python](#python)
- [Quick Start](#quick-start)
  - [TypeScript Quick Start](#typescript-quick-start)
  - [Python Quick Start](#python-quick-start)
- [Core Concepts](#core-concepts)
  - [PS-SHA∞ Identity System](#ps-sha-identity-system)
  - [Truth Engine](#truth-engine)
  - [Agent Infrastructure](#agent-infrastructure)
  - [Service Registry](#service-registry)
- [Stripe & Payments Integration](#stripe--payments-integration)
- [API Reference](#api-reference)
  - [TypeScript Exports](#typescript-exports)
  - [Python Exports](#python-exports)
- [Architecture](#architecture)
- [Environment Variables](#environment-variables)
- [Development](#development)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Running Tests](#running-tests)
  - [Building](#building)
- [Documentation Index](#documentation-index)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

`blackroad-os-core` is the cognitive kernel of BlackRoad OS — a deterministic, auditable library that turns raw text into verifiable truth, orchestrates up to 30,000 autonomous agents, and provides the identity spine for every service in the BlackRoad ecosystem.

**What it provides:**

| Layer | What it does |
|---|---|
| **Identity** | PS-SHA∞ tamper-proof identity anchoring |
| **Truth Engine** | `TextSnapshot → VerificationJob → TruthState → RoadChain` pipeline |
| **Agent Infra** | Spawn, lifecycle, LLM routing (vLLM, Ollama, llama.cpp) |
| **Service Registry** | Canonical metadata for every BlackRoad service |
| **Billing Primitives** | Stripe-ready plan definitions and entitlement types |
| **Desktop Shell** | App registry, layout, and navigation contracts |

---

## Installation

### TypeScript / Node.js

```bash
# npm
npm install @blackroad/core

# pnpm (recommended)
pnpm add @blackroad/core

# yarn
yarn add @blackroad/core
```

Requires **Node.js 18+** and **TypeScript 5.0+**.

### Python

```bash
pip install blackroad-core
```

Requires **Python 3.11+**.

---

## Quick Start

### TypeScript Quick Start

```typescript
import {
  computePsShaInfinity,
  aggregateTruthState,
  toTimestamp,
} from "@blackroad/core";
import type { TextSnapshot, AgentAssessment } from "@blackroad/core";

// 1. Generate deterministic PS-SHA∞ identities
const authorId = computePsShaInfinity({ kind: "user", seed: "alice@blackroad.io" });
const snapshotId = computePsShaInfinity({ kind: "snapshot", seed: "txn-audit-001" });
const jobId = computePsShaInfinity({ kind: "snapshot", seed: "job-001" });
const truthId = computePsShaInfinity({ kind: "snapshot", seed: "truth-001" });

// 2. Create a text snapshot (plain typed object)
const snapshot: TextSnapshot = {
  id: snapshotId,
  createdAt: toTimestamp(),
  sourceSystem: "financial-audit",
  authorId,
  content: "The transaction was approved at 14:32 UTC.",
  hash: computePsShaInfinity({ kind: "snapshot", seed: "txn-audit-001-hash" }),
};

// 3. Collect agent assessments and aggregate into a TruthState
const agentA = computePsShaInfinity({ kind: "agent", seed: "agent-001" });
const agentB = computePsShaInfinity({ kind: "agent", seed: "agent-002" });
const agentC = computePsShaInfinity({ kind: "agent", seed: "agent-003" });

const assessments: AgentAssessment[] = [
  { id: computePsShaInfinity({ kind: "agent", seed: "a1" }), jobId, agentId: agentA, createdAt: toTimestamp(), verdict: "true",  confidence: 0.95 },
  { id: computePsShaInfinity({ kind: "agent", seed: "a2" }), jobId, agentId: agentB, createdAt: toTimestamp(), verdict: "true",  confidence: 0.88 },
  { id: computePsShaInfinity({ kind: "agent", seed: "a3" }), jobId, agentId: agentC, createdAt: toTimestamp(), verdict: "false", confidence: 0.62 },
];

const truthState = aggregateTruthState({
  truthId,
  snapshotId: snapshot.id,
  jobId,
  assessments,
  updatedAt: toTimestamp(),
});

console.log(truthState.aggregatedVerdict);    // "true"
console.log(truthState.aggregatedConfidence); // 0.91
```

### Python Quick Start

```python
from blackroad_core import generate_ps_sha_id, AgentManifest, JobStatus

# Generate a PS-SHA∞ identity
agent_id = generate_ps_sha_id(kind="agent", seed="research-agent-42")

# Define an agent manifest
manifest = AgentManifest(
    id=agent_id,
    role="Research Analyst",
    runtime_type="llm_brain",
    pack="pack-research-lab",
    capabilities=["web_search", "summarize"],
)

print(manifest.model_dump_json(indent=2))
```

---

## Core Concepts

### PS-SHA∞ Identity System

Blockchain-style append-only hashing for tamper-proof identity:

```
hash₁ = SHA256(kind:version:namespace:seed)
hash₂ = SHA256(hash₁ + new_input)
```

Every user, agent, snapshot, and event receives a globally unique, reproducible `pssha∞_<hex>` identifier. The same inputs always produce the same identifier — no database required.

```typescript
import { computePsShaInfinity } from "@blackroad/core";

const id = computePsShaInfinity({
  kind: "agent",
  seed: "my-agent",
  namespace: "pack-finance",
  version: 1,
});
```

### Truth Engine

The Truth Engine pipeline converts unstructured text into auditable verdicts:

```
TextSnapshot
    └── VerificationJob
            └── AgentAssessment[]
                    └── TruthState  ──→  RoadChain Event
```

Key types: `TextSnapshot`, `VerificationJob`, `AgentAssessment`, `TruthState`, `TruthValue`.

### Agent Infrastructure

Supports up to 30,000 concurrent autonomous agents across five runtime types:

| Runtime | Use case | Latency |
|---|---|---|
| `llm_brain` | LLM-powered reasoning | 50–2000 ms |
| `workflow_engine` | Multi-step processes | varies |
| `integration_bridge` | External API calls | varies |
| `edge_worker` | Lightweight tasks | < 50 ms |
| `ui_helper` | Browser/UI operations | < 50 ms |

### Service Registry

Every BlackRoad service is declared in the canonical registry:

```typescript
import { getServiceById, listServicesByKind } from "@blackroad/core";

const api = getServiceById("api");
const packs = listServicesByKind("pack");
```

---

## Stripe & Payments Integration

BlackRoad OS ships production-ready billing plan constants that map directly to Stripe Price IDs. Configure your `.env` file and the SDK routes all entitlement checks through the same typed constants.

### Plan Definitions

| Plan | Monthly | Annual | Agents | Tasks / mo |
|---|---|---|---|---|
| **Starter** | $29 | $290 | 10 | 1,000 |
| **Pro** | $99 | $990 | 100 | 10,000 |
| **Enterprise** | $499 | $4,990 | Unlimited | Unlimited |

### Setup

1. **Add Stripe keys to your environment:**

```bash
# .env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER_MONTHLY=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_...
```

2. **Import plan constants in your API handler:**

```typescript
import { Packs, Environments } from "@blackroad/core";

// Use canonical pack & environment constants in billing logic
const isProduction = process.env.NODE_ENV === Environments.PRODUCTION;
const financePack = Packs.FINANCE;
```

3. **Health check your payment gateway:**

```bash
curl https://api.blackroad.io/health
# {"status":"healthy","stripe":"connected"}
```

> **Full payment integration guide:** [`MONETIZATION_DEPLOYMENT_GUIDE.md`](MONETIZATION_DEPLOYMENT_GUIDE.md)

---

## API Reference

### TypeScript Exports

All exports are available from `@blackroad/core`:

#### Identity

| Export | Description |
|---|---|
| `computePsShaInfinity(input)` | Generate a deterministic PS-SHA∞ hash |
| `createIdentityGenesis(opts)` | Bootstrap a new identity chain |
| `IdentityKind` | Union type: `"user" \| "agent" \| "org" \| "workspace" \| "snapshot"` |

#### Truth Engine

| Export | Description |
|---|---|
| `aggregateTruthState(input)` | Aggregate `AgentAssessment[]` into a `TruthState` |
| `TruthValue` | `"true" \| "false" \| "unknown" \| "contradictory"` |
| `TextSnapshot` | Interface for a raw text submission |
| `VerificationJob` | Interface for a verification job |
| `AgentAssessment` | Interface for a single agent verdict |
| `TruthState` | Interface for the final aggregated truth state |

#### Service Registry

| Export | Description |
|---|---|
| `getServiceById(id)` | Look up a service by its canonical ID |
| `listServices()` | Return all registered services |
| `listServicesByKind(kind)` | Filter services by kind |
| `SERVICE_REGISTRY` | Full registry object |

#### Constants

| Export | Description |
|---|---|
| `Environments` | `LOCAL \| DEVELOPMENT \| STAGING \| PRODUCTION` |
| `Teams` | Canonical team identifiers |
| `Packs` | Built-in pack identifiers (`FINANCE`, `LEGAL`, `RESEARCH_LAB`, …) |
| `GenericStatuses` | Standard generic status values |
| `JobStatuses` | Job-specific status values |
| `AgentStatuses` | Agent-specific status values |
| `Priorities` | Task priority levels |
| `ErrorCodes` | Canonical error codes |

#### Utilities

| Export | Description |
|---|---|
| `toTimestamp(date?)` | Current (or given) time as ISO 8601 string |
| `hashJournalEntry(entry)` | Deterministic SHA-256 hex digest of a journal entry |
| `withJournalHash(entry)` | Return entry with hash field populated |

### Python Exports

```python
from blackroad_core import (
    generate_ps_sha_id,      # PS-SHA∞ ID generation
    validate_ps_sha_id,      # Validate an existing ID
    AgentManifest,           # Pydantic agent manifest schema
    PackManifest,            # Pydantic pack manifest schema
    validate_agent_manifest, # Validate a raw dict
    validate_pack_manifest,
    merge_manifests,
    JobStatus,               # Enum: pending | running | complete | failed
    AgentStatus,             # Enum: idle | active | suspended | terminated
    RuntimeType,             # Enum: llm_brain | workflow_engine | ...
    EventType,               # Enum of all domain event types
)
```

> **Full API docs:** [`docs/SDK_API_REFERENCE.md`](docs/SDK_API_REFERENCE.md)

---

## Architecture

```
blackroad-os-core/
├── src/                        # TypeScript core library
│   ├── identity/               # PS-SHA∞ identity types & generation
│   ├── truth/                  # Truth Engine (TextSnapshot → TruthState)
│   ├── events/                 # Domain events & RoadChain journal
│   ├── agents/                 # Agent base types & lifecycle
│   ├── jobs/                   # Job types & lifecycle primitives
│   ├── lucidia/                # Lucidia breath-sync types
│   ├── services/               # Service registry (types + helpers)
│   ├── session/                # Session & state management
│   ├── permissions/            # RBAC types & roles
│   ├── desktop/                # Desktop shell contracts
│   ├── constants/              # Canonical enums (envs, teams, packs)
│   ├── config/                 # Config loader & types
│   ├── logging/                # Structured logger
│   └── index.ts                # Single public entry point
│
├── src/blackroad_core/         # Python runtime library
│   ├── ps_sha.py               # PS-SHA∞ ID generation
│   ├── manifest.py             # Pydantic manifest schemas
│   ├── protocol.py             # Shared enums (JobStatus, RuntimeType …)
│   ├── spawner.py              # Agent spawner (up to 30K agents)
│   ├── communication.py        # Pub/sub message bus
│   ├── llm/                    # Multi-backend LLM integration
│   ├── packs/                  # Domain pack system
│   ├── lucidia/                # Lucidia breath engine
│   └── marketplace.py          # Agent template marketplace
│
├── packages/
│   ├── sdk-ts/                 # Published as @blackroad/core (npm)
│   ├── sdk-py/                 # Published as blackroad-core (PyPI)
│   ├── ui/                     # Shared UI components
│   └── config/                 # Shared tsconfig / eslint config
│
├── apps/
│   ├── web/                    # Next.js web application
│   ├── desktop/                # Tauri desktop shell
│   └── prism-portal/           # Prism operator console
│
├── docs/                       # Extended documentation (see index below)
├── tests/                      # TypeScript tests (Vitest)
└── prisma/                     # Database schema & migrations
```

---

## Environment Variables

Copy `.env.template` (or `core.env.example`) and fill in the required values:

```bash
cp core.env.example .env
```

| Variable | Required | Description |
|---|---|---|
| `NODE_ENV` | Yes | `development \| staging \| production` |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `STRIPE_SECRET_KEY` | Yes (billing) | Stripe secret key (`sk_live_…`) |
| `STRIPE_WEBHOOK_SECRET` | Yes (billing) | Stripe webhook signing secret |
| `STRIPE_PRICE_STARTER_MONTHLY` | Yes (billing) | Stripe Price ID for Starter plan |
| `STRIPE_PRICE_PRO_MONTHLY` | Yes (billing) | Stripe Price ID for Pro plan |
| `STRIPE_PRICE_ENTERPRISE_MONTHLY` | Yes (billing) | Stripe Price ID for Enterprise plan |
| `ANTHROPIC_API_KEY` | Optional | Claude / Anthropic API key |
| `OPENAI_API_KEY` | Optional | OpenAI API key |
| `API_URL` | Optional | BlackRoad API base URL |
| `OPERATOR_URL` | Optional | Operator service base URL |

> Never commit real secrets. Use `.env.*` files which are gitignored.

---

## Development

### Prerequisites

- **Node.js** 18+
- **pnpm** 8+  (`npm install -g pnpm`)
- **Python** 3.11+
- **PostgreSQL** (for Prisma / local DB)

### Setup

```bash
# Clone
git clone https://github.com/BlackRoad-OS/blackroad-os-core.git
cd blackroad-os-core

# Install Node dependencies
pnpm install

# Install Python SDK in editable mode
pip install -e packages/sdk-py

# Copy and configure environment variables
cp core.env.example .env

# Generate Prisma client
pnpm db:generate
```

### Running Tests

```bash
# TypeScript (Vitest)
pnpm test

# TypeScript with coverage
pnpm test:coverage

# TypeScript in watch mode
pnpm test:watch

# Python (pytest)
pytest

# Python verbose
python3 -m pytest -v
```

### Building

```bash
# Build all packages
pnpm build

# Build TypeScript SDK only
pnpm --filter @blackroad/core build

# Lint everything
pnpm lint
```

### API Smoke Test

```bash
# Start the API server
pnpm dev:api

# In another terminal
curl http://localhost:4000/health
# {"status":"healthy"}
```

---

## Documentation Index

| Document | Description |
|---|---|
| [`docs/CORE_OVERVIEW.md`](docs/CORE_OVERVIEW.md) | Architecture deep-dive |
| [`docs/SDK_API_REFERENCE.md`](docs/SDK_API_REFERENCE.md) | Full API reference |
| [`docs/AGENT_INFRASTRUCTURE.md`](docs/AGENT_INFRASTRUCTURE.md) | Agent spawner & lifecycle |
| [`docs/LUCIDIA_ARCHITECTURE.md`](docs/LUCIDIA_ARCHITECTURE.md) | Lucidia breath engine |
| [`docs/CONNECTION_GUIDE.md`](docs/CONNECTION_GUIDE.md) | Service connection guide |
| [`docs/testing.md`](docs/testing.md) | Testing strategy |
| [`docs/ci-workflows.md`](docs/ci-workflows.md) | CI/CD pipelines |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Contribution guidelines |
| [`SECURITY.md`](SECURITY.md) | Security policy |
| [`MONETIZATION_DEPLOYMENT_GUIDE.md`](MONETIZATION_DEPLOYMENT_GUIDE.md) | Stripe & billing setup |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | High-level system architecture |

---

## Contributing

We welcome contributions! Please read [`CONTRIBUTING.md`](CONTRIBUTING.md) for the full guide.

**Quick summary:**

1. Fork the repo and create a feature branch (`feat/my-feature`)
2. Run `pnpm lint && pnpm test` before pushing
3. Open a PR with a clear description, linked issue, and test evidence
4. Sign your commits with DCO (`git commit -s`)

---

## License

[MIT](LICENSE) © BlackRoad OS
