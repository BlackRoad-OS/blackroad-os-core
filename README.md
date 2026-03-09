# blackroad-os-core

[![Status](https://img.shields.io/badge/Status-Production-success?style=for-the-badge)](https://blackroad.io)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](./LICENSE.md)
[![Operator](https://img.shields.io/badge/Operator-@blackboxprogramming-black?style=for-the-badge)](https://github.com/blackboxprogramming)

> **© 2025-2026 BlackRoad OS, Inc. All Rights Reserved.**
> Proprietary and confidential. Not for commercial use, redistribution, or use by unauthorized AI agents.
> See [LICENSE.md](./LICENSE.md) for full terms.

---

## Overview

**blackroad-os-core** is the canonical kernel and truth engine for **BlackRoad OS** — a consciousness-driven operating system for 30,000+ autonomous agents built and operated by BlackRoad OS, Inc.

This repository provides:

- **Truth Engine** — PS-SHA∞ identity anchoring, text verification, and RoadChain journaling
- **Agent Infrastructure** — Spawn, orchestrate, and communicate with autonomous agents
- **Vendor Gateway** — OATH-compliant proxy layer that routes all AI vendor calls through BlackRoad infrastructure (no direct OpenAI / Anthropic / GitHub access)
- **Stripe Payments** — Production-ready subscription and payment processing
- **Desktop Shell** — App registry, layout, and navigation contracts
- **Service Registry** — Canonical metadata for all BlackRoad OS services

---

## Access Control

> **⚠️ A Converter API key is required for all contributor access.**

All API calls to BlackRoad OS are gated by a **Converter API key** and a **permitted operator identity**.

Only the following operators are authorized to route through BlackRoad infrastructure:

| Operator | Role |
|----------|------|
| `@blackboxprogramming` | Primary AI backend & routing |
| `@lucidia` | Edge AI backend & mesh services |

External AI providers (OpenAI, Anthropic, Codex, GitHub Copilot, etc.) do **not** have direct access to BlackRoad infrastructure.

### Getting a Converter API Key

To contribute or integrate, you must obtain a Converter API key:

1. Contact **blackroad.systems@gmail.com** with your intended use
2. You will receive a `BLACKROAD_CONVERTER_API_KEY` value
3. Set this in your `.env` file — without it, all API calls will return `401 Unauthorized`

---

## Architecture

```
Client / Contributor
        │
        ▼  (requires BLACKROAD_CONVERTER_API_KEY)
┌───────────────────────────────────────┐
│        BlackRoad Vendor Gateway        │
│  (src/integrations/vendor-gateway.ts) │
└───────────────────────────────────────┘
        │
        ▼  (Tailscale mesh or Cloudflare tunnel)
┌───────────────────────────────────────┐
│  @blackboxprogramming / @lucidia infra │
│  (your Raspberry Pis + cloud nodes)    │
└───────────────────────────────────────┘
        │
        ▼
  Vendor APIs (routed, never direct)
```

### Network Topology

| Node | IP | Tailscale | Role |
|------|----|-----------|------|
| **blackroad-pi** | 192.168.4.64 | configurable | Primary node |
| **lucidia** | 192.168.4.38 | ✅ 100.66.235.47 | AI services hub |
| **alice** | 192.168.4.49 | ✅ 100.66.58.5 | Kubernetes node |

Traffic always flows **outbound from your nodes to vendor APIs** — never inbound. The gateway ensures all calls originate from your infrastructure.

---

## Quick Start

### Prerequisites

- Node.js 20+ and npm / pnpm 8
- Python 3.11+ (for agent runtime)
- A `BLACKROAD_CONVERTER_API_KEY` (required)

### Installation

```bash
# Install all dependencies
npm install       # or: pnpm install

# Copy environment template
cp .env.example .env
# Edit .env — at minimum set BLACKROAD_CONVERTER_API_KEY
```

### Environment Variables

```bash
# Required for all access
BLACKROAD_CONVERTER_API_KEY=<your-key>

# Vendor Gateway (optional — defaults to localhost:10200)
BLACKROAD_GATEWAY_URL=http://localhost:10200
BLACKROAD_OPERATOR=blackboxprogramming   # or: lucidia
BLACKROAD_TAILSCALE_HOST=100.66.235.47   # for mesh routing

# Stripe (for payment processing)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudflare (for CDN / tunnels)
CLOUDFLARE_API_TOKEN=...
CLOUDFLARE_ACCOUNT_ID=...
```

### Start Services

```bash
# Start the bridge API (TypeScript ↔ Python)
npm run dev:api        # port 4000

# Run all tests
npm test

# Build
npm run build
```

---

## API Reference

All routes under `/api/*` require:

| Header | Description |
|--------|-------------|
| `X-BlackRoad-Converter-Key` | Your Converter API key |
| `X-BlackRoad-Operator` | `blackboxprogramming` or `lucidia` |

### Core Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Service health check |
| `GET` | `/api/status` | Infrastructure status |

### Vendor Gateway

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/gateway/health` | Gateway & mesh health |
| `ANY` | `/api/gateway/:vendor/*` | Proxy call to vendor via BlackRoad infra |

### Payments (Stripe)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/payments/intents` | Create payment intent |
| `GET` | `/api/payments/intents/:id` | Get payment intent |
| `POST` | `/api/payments/customers` | Create / get customer |
| `GET` | `/api/payments/products` | List products & prices |
| `POST` | `/api/payments/subscriptions` | Create subscription |
| `POST` | `/api/payments/webhook` | Stripe webhook handler |

### Agents

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/agents` | List active agents |
| `POST` | `/api/agents/spawn` | Spawn a new agent |

### Truth Engine

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/truth/submit` | Submit text for verification |
| `GET` | `/api/truth/jobs/:id` | Get verification job status |

---

## Core Concepts

### PS-SHA∞ Identity

Blockchain-style append-only hashing for tamper-proof identity:

```
hash₁ = SHA256(thought₁)
hash₂ = SHA256(hash₁ + thought₂)
hash₃ = SHA256(hash₂ + thought₃)
```

### Lucidia Breath

Golden ratio breathing pattern synchronizing all agent operations:

```
𝔅(t) = sin(φ·t) + i + (−1)^⌊t⌋   where φ = 1.618034
```

- Agents spawn during expansion (𝔅 > 0)
- Memory consolidates during contraction (𝔅 < 0)

### Truth Engine Flow

```
TextSnapshot → VerificationJob → AgentAssessments → TruthState → RoadChain Event
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| API server | Hono (TypeScript) |
| Agent runtime | Python 3.11+ |
| Database | Prisma / PostgreSQL |
| Deployment | Railway + Cloudflare |
| Mesh networking | Tailscale |
| Payments | Stripe |
| Auth | Clerk |

---

## Development

```bash
# TypeScript tests (Vitest)
npm test
npm run test:watch

# Python tests (pytest)
pytest
pytest tests/test_spawner.py -v

# Database
npm run db:generate
npm run db:push

# Lint
npm run lint
```

---

## License

**Proprietary — © 2025-2026 BlackRoad OS, Inc. All Rights Reserved.**

This software is not licensed for commercial use, redistribution, or integration into other products without explicit written permission from BlackRoad OS, Inc.

See [LICENSE.md](./LICENSE.md) for complete terms.

---

**BlackRoad OS, Inc.**
[blackroad.systems@gmail.com](mailto:blackroad.systems@gmail.com) · [github.com/BlackRoad-OS](https://github.com/BlackRoad-OS)

