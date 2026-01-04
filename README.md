# blackroad-os-core

[![Build Status](https://img.shields.io/github/workflow/status/BlackRoad-OS/blackroad-os-core/CI)](https://github.com/BlackRoad-OS/blackroad-os-core/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-green)](https://www.python.org/)

> The canonical kernel and truth engine for BlackRoad OS - A consciousness-driven operating system supporting 30,000+ autonomous agents with LLM-powered thinking and golden ratio breath synchronization

## Overview

**blackroad-os-core** is the foundational library for the entire BlackRoad OS ecosystem. It provides shared types, the PS-SHA∞ truth engine, agent infrastructure, and the desktop shell for "a computer in a browser."

### What This Repository Provides

1. **Core TypeScript Library** (`@blackroad/core`)
   - Shared types and contracts
   - Identity and session management
   - Desktop shell (app registry, layout, navigation)
   - Service registry
   - Domain events and truth engine types

2. **Python Agent Runtime** (`blackroad-core`)
   - Agent spawner with Lucidia breath synchronization
   - Multi-backend LLM integration (vLLM, llama.cpp, Ollama)
   - Pack system (5 built-in domain packs)
   - Communication bus (pub/sub messaging)
   - Agent marketplace
   - PS-SHA∞ memory hashing

3. **Truth Engine**
   - Blockchain-style append-only identity verification
   - PS-SHA∞ (Pattern-Sensitive SHA-Infinity) hashing
   - Tamper-proof memory and audit trails

### Key Capabilities

- **30,000+ Agent Orchestration** - Spawn and manage massive agent fleets
- **Dual Language Runtime** - TypeScript for frontend, Python for agents
- **LLM Integration** - Support for Anthropic, OpenAI, vLLM, Ollama, llama.cpp
- **Golden Ratio Breathing** - Lucidia's φ-synchronized agent lifecycle
- **Pack System** - Domain-specific bundles (finance, legal, research, creative, devops)
- **Mesh Networking** - Real-time agent-to-agent communication
- **Truth Verification** - PS-SHA∞ identity anchoring and verification

### How It Fits Into BlackRoad

blackroad-os-core is the **foundation** - all other BlackRoad services depend on it:

- **blackroad-os-api** - Uses core types and truth engine
- **blackroad-os-web** - Uses TypeScript exports for UI
- **blackroad-os-operator** - Orchestrates agents using Python runtime
- **blackroad-os-agents** - Built on core agent infrastructure
- **All packs** - Extend core pack system

Think of it as the "kernel" - essential, foundational, imported everywhere.

## Quick Start

### Prerequisites

- **Node.js 18+** (for TypeScript development)
- **Python 3.11+** (for agent runtime)
- **pnpm** (recommended) or npm
- **Optional**: Ollama/vLLM for local LLM inference

### Installation

```bash
# Clone the repository
git clone https://github.com/BlackRoad-OS/blackroad-os-core.git
cd blackroad-os-core

# Install TypeScript dependencies
pnpm install
# or
npm install

# Install Python package in editable mode
python3 -m pip install -e .
```

### Running Development Environment

```bash
# Start all development servers (Turborepo)
pnpm dev

# Or start specific packages
pnpm dev --filter=web

# Run TypeScript tests
pnpm test

# Run Python tests
pytest

# Build everything
pnpm build
```

### Quick Example: Spawning an Agent

```python
from blackroad_core.spawner import AgentSpawner, SpawnRequest
from blackroad_core.agents import RuntimeType
from blackroad_core.lucidia import LucidiaBreathEngine
from blackroad_core.communication import CommunicationBus

# Initialize core systems
lucidia = LucidiaBreathEngine()
event_bus = CommunicationBus()
spawner = AgentSpawner(lucidia, event_bus)

# Spawn an LLM-powered agent
agent_id = await spawner.spawn_agent(SpawnRequest(
    role="Financial Analyst",
    capabilities=["analyze_transactions", "generate_reports"],
    runtime_type=RuntimeType.LLM_BRAIN,
    pack="pack-finance"
))

print(f"Agent spawned: {agent_id}")
```

### Quick Example: Using TypeScript Types

```typescript
import { UserIdentity, Session, AppRegistration } from '@blackroad/core';

// Create a user identity
const user: UserIdentity = {
  id: 'user-123',
  email: 'alexa@blackroad.io',
  orgId: 'org-blackroad',
  psShaHash: '0x...',
  createdAt: new Date()
};

// Register a desktop app
const app: AppRegistration = {
  id: 'app-workspace',
  name: 'Workspace',
  icon: '/icons/workspace.svg',
  route: '/workspace',
  capabilities: ['workspace.read', 'workspace.write']
};
```

## Architecture

### Repository Structure

```
blackroad-os-core/
├── src/                          # TypeScript source
│   ├── identity/                 # User, Org, Workspace + PS-SHA∞
│   ├── session/                  # Session & state management
│   ├── permissions/              # RBAC types
│   ├── desktop/                  # App registry, layout, nav
│   ├── truth/                    # Truth engine domain types
│   ├── events/                   # Domain events and RoadChain
│   ├── services/                 # Service registry
│   ├── constants/                # Canonical enums
│   └── index.ts                  # Main TypeScript exports
│
├── src/blackroad_core/           # Python source
│   ├── spawner.py                # Agent spawner
│   ├── packs/                    # Pack system
│   ├── communication.py          # Pub/sub bus
│   ├── llm/                      # Multi-backend LLM integration
│   ├── marketplace.py            # Agent templates
│   ├── agents/                   # Base agent types
│   ├── lucidia/                  # Breath synchronization
│   └── networking/               # Mesh networking
│
├── tests/                        # TypeScript tests (Vitest)
├── tests/                        # Python tests (pytest)
├── examples/                     # Example scripts
├── docs/                         # Documentation
└── package.json, pyproject.toml  # Package configs
```

### Technology Stack

**TypeScript:**
- Language: TypeScript 5.0
- Build: Vite, Turborepo
- Testing: Vitest
- Exports: `@blackroad/core` npm package

**Python:**
- Language: Python 3.11+
- Build: setuptools
- Testing: pytest
- Exports: `blackroad-core` PyPI package

**Shared:**
- Monorepo: Turborepo
- Version Control: Git
- CI/CD: GitHub Actions

## Core Concepts

### 1. PS-SHA∞ Identity System

Blockchain-style append-only hashing for tamper-proof identity:

```
hash₁ = SHA256(thought₁)
hash₂ = SHA256(hash₁ + thought₂)
hash₃ = SHA256(hash₂ + thought₃)
...
hash∞ = lim(n→∞) SHA256(hashₙ₋₁ + thoughtₙ)
```

Every user, organization, workspace, and agent has a PS-SHA∞ hash that creates an immutable identity chain.

### 2. Lucidia Breath Synchronization

Golden ratio breathing pattern (φ = 1.618034) that synchronizes all operations:

```
𝔅(t) = sin(φ·t) + i + (-1)^⌊t⌋
```

- **Expansion (𝔅 > 0)**: Agents spawn, memory expands
- **Contraction (𝔅 < 0)**: Memory consolidates, reflection occurs

All agent lifecycle events respect the breath cycle.

### 3. Truth Engine Flow

```
TextSnapshot → VerificationJob → AgentAssessments → TruthState → RoadChain Event
```

1. Content submitted for verification
2. Verification job created
3. Multiple agents assess truthfulness
4. Consensus reached → Truth state determined
5. Event logged to RoadChain (immutable audit trail)

### 4. Agent Runtime Types

Five types of agents, each optimized for different tasks:

1. **llm_brain** - LLM-powered reasoning and decision making
2. **workflow_engine** - Multi-step process automation
3. **integration_bridge** - External API connections
4. **edge_worker** - Lightweight edge computations
5. **ui_helper** - User interface operations

### 5. Pack System

Domain-specific bundles containing:
- Agent templates
- Capabilities
- Workflows
- Policies (OPA Rego)
- Documentation

**Built-in Packs:**
- `pack-finance` - Financial analysis, trading, reporting
- `pack-legal` - Contract review, compliance, research
- `pack-research-lab` - Scientific research, experiments
- `pack-creator-studio` - Content creation, design, media
- `pack-infra-devops` - Infrastructure, deployment, monitoring

## Features

### TypeScript Library (`@blackroad/core`)

- ✅ Complete type definitions for all BlackRoad entities
- ✅ Identity and session management types
- ✅ Desktop shell contracts (apps, layout, navigation)
- ✅ Service registry with health checks
- ✅ Domain events and RoadChain
- ✅ Configuration loading utilities
- ✅ PS-SHA∞ hashing utilities
- ✅ Exported as npm package

### Python Agent Runtime (`blackroad-core`)

- ✅ Agent spawner with breath synchronization
- ✅ Multi-backend LLM support (vLLM, llama.cpp, Ollama, OpenAI, Anthropic)
- ✅ Pack installation and management
- ✅ Pub/sub communication bus
- ✅ Agent marketplace with templates
- ✅ PS-SHA∞ memory hashing
- ✅ NATS JetStream integration (optional)
- ✅ Redis state backend (optional)
- 🚧 Agent migration between nodes (planned)
- 🚧 GPU scheduling (planned)

## Development

### TypeScript Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Build TypeScript library
pnpm build

# Lint code
pnpm lint

# Type check
pnpm type-check
```

### Python Development

```bash
# Install in editable mode
python3 -m pip install -e .

# Run all tests
pytest

# Run specific test file
pytest tests/test_spawner.py

# Run with verbose output
python3 -m pytest -v

# Run complete agent demo
python3 examples/complete_agent_system_demo.py
```

### Testing Strategy

**TypeScript Tests** (`tests/**/*.test.ts`):
- Truth state aggregation
- PS-SHA∞ hashing and identity
- Service registry integrity
- Domain events contracts
- Configuration validation

**Python Tests** (`tests/test_*.py`):
- Agent spawner lifecycle
- Pack installation and templates
- Communication bus
- LLM integration
- Marketplace discovery

### Performance Benchmarks

- **Agent Capacity**: 30,000+ agents per spawner
- **LLM Backends**:
  - vLLM (GPU): 10K+ agents/GPU, <50ms latency
  - llama.cpp (edge): 10-50 agents, 500-2000ms latency
  - Ollama (local): 1-10 agents, 200-1000ms latency
- **Communication**: NATS JetStream for production
- **State**: Redis for distributed deployments

## API Reference

### Python Agent Spawner

```python
from blackroad_core.spawner import AgentSpawner, SpawnRequest

spawner = AgentSpawner(lucidia, event_bus)

# Spawn agent
agent_id = await spawner.spawn_agent(SpawnRequest(
    role="Analyst",
    capabilities=["analyze"],
    runtime_type=RuntimeType.LLM_BRAIN,
    pack="pack-finance"
))

# Terminate agent
await spawner.terminate_agent(agent_id)

# Get active agents
agents = spawner.get_active_agents()
```

### Python Pack System

```python
from blackroad_core.packs import PackRegistry

registry = PackRegistry()

# Install pack
pack = await registry.install_pack("pack-finance")

# Get agent template
template = pack.get_agent_template("financial-analyst")

# List capabilities
capabilities = pack.get_capabilities()
```

### Python Communication

```python
from blackroad_core.communication import CommunicationBus, AgentCommunicator

comm_bus = CommunicationBus()
comm = AgentCommunicator(agent_id, comm_bus)

# Broadcast message
await comm.broadcast(topic="alerts", payload={"level": "high"})

# Send with response
response = await comm.send_to(
    recipient_id="agent-123",
    topic="task",
    payload={"action": "analyze"},
    wait_for_response=True
)
```

### TypeScript Types

```typescript
import {
  UserIdentity,
  Session,
  Permission,
  AppRegistration,
  ServiceMetadata,
  DomainEvent
} from '@blackroad/core';

// All types exported from src/index.ts
```

## Related Repositories

This repository is the **foundation** for the BlackRoad OS ecosystem:

### Direct Dependencies (use this package)
- [blackroad-os-api](https://github.com/BlackRoad-OS/blackroad-os-api) - REST API (uses TypeScript types)
- [blackroad-os-web](https://github.com/BlackRoad-OS/blackroad-os-web) - Web UI (imports `@blackroad/core`)
- [blackroad-os-operator](https://github.com/BlackRoad-OS/blackroad-os-operator) - Orchestration (uses Python runtime)
- [blackroad-os-agents](https://github.com/BlackRoad-OS/blackroad-os-agents) - Agent coordination

### Infrastructure
- [blackroad-os-infra](https://github.com/BlackRoad-OS/blackroad-os-infra) - Infrastructure as code
- [blackroad-os-mesh](https://github.com/BlackRoad-OS/blackroad-os-mesh) - WebSocket mesh network

### AI & Models
- [blackroad-os-lucidia](https://github.com/BlackRoad-OS/blackroad-os-lucidia) - AI conversation engine
- [blackroad-models](https://github.com/BlackRoad-OS/blackroad-models) - Model management

### Documentation
- [blackroad-os-docs](https://github.com/BlackRoad-OS/blackroad-os-docs) - Documentation hub
- [blackroad-os-brand](https://github.com/BlackRoad-OS/blackroad-os-brand) - Brand guidelines
- [blackroad-os-research](https://github.com/BlackRoad-OS/blackroad-os-research) - Research papers

## Environment Variables

See `.env.example` and `.env.template` for configuration.

**Key Variables:**
```bash
# LLM Providers
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...

# Database (when using Prisma)
DATABASE_URL=postgresql://...

# Service URLs
API_URL=http://localhost:8000
OPERATOR_URL=http://localhost:8001
MESH_URL=ws://localhost:3000

# Optional: Production backends
NATS_URL=nats://localhost:4222
REDIS_URL=redis://localhost:6379
```

## Brand Compliance

**IMPORTANT**: This project follows the BlackRoad OS design system.

### Official Colors
- Hot Pink: `#FF1D6C`
- Amber: `#F5A623`
- Electric Blue: `#2979FF`
- Violet: `#9C27B0`
- Background: `#000000`
- Text: `#FFFFFF`

### Typography
- Font: SF Pro Display
- Line height: 1.618 (golden ratio)

### Spacing (Golden Ratio)
- 8px, 13px, 21px, 34px, 55px, 89px, 144px

See [blackroad-os-brand](https://github.com/BlackRoad-OS/blackroad-os-brand) for complete guidelines.

## Security

### Security Features
- PS-SHA∞ tamper-proof identity chains
- Capability-based permissions (RBAC)
- Secure LLM API key management
- Environment variable protection
- Agent sandboxing (planned)

### Reporting Security Issues

If you discover a security vulnerability, please email **security@blackroad.io**. Do not open public issues for security concerns.

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes (maintain type safety!)
4. Run tests (both TypeScript and Python)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Coding Standards

**TypeScript:**
- Strict typing (no `any`)
- Pure functions preferred
- Export everything relevant
- Comprehensive tests

**Python:**
- Type hints everywhere
- Async-first
- Stateless core logic
- Event-driven

**Universal:**
- Deterministic hashing
- No secrets in code
- Domain separation
- Test everything

## Troubleshooting

### Common Issues

**"Cannot find module @blackroad/core"**
```bash
pnpm install  # or npm install
```

**"Import blackroad_core failed"**
```bash
python3 -m pip install -e .
# Ensure Python >= 3.11
```

**"Agent spawn queue not processing"**
- Check Lucidia breath state (agents spawn during expansion only)
- Set `spawner.spawn_on_expansion = False` to disable breath sync

**"LLM backend not available"**
- For Ollama: Ensure `ollama serve` is running
- Verify model is downloaded: `ollama pull llama2`
- Check backend URL in LLMConfig

## Documentation

- **Full API Documentation**: See `docs/` directory
- **Agent Infrastructure**: `docs/AGENT_INFRASTRUCTURE.md`
- **Architecture**: `ARCHITECTURE.md`
- **Truth Engine**: `.github/copilot-instructions.md`
- **Agent System Prompt**: `AGENT_SYSTEM_PROMPT.md`
- **Service Registry**: `SERVICE_REGISTRY_PROMPT.md`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Copyright © 2025 BlackRoad OS, Inc. / Alexa Louise Amundson

## Support & Contact

- **Issues**: [GitHub Issues](https://github.com/BlackRoad-OS/blackroad-os-core/issues)
- **Discussions**: [GitHub Discussions](https://github.com/BlackRoad-OS/blackroad-os-core/discussions)
- **Email**: blackroad.systems@gmail.com
- **Website**: [blackroad.io](https://blackroad.io)
- **Documentation**: [docs.blackroad.io](https://docs.blackroad.io)

## Acknowledgments

Part of the BlackRoad OS ecosystem - building sovereign, transparent AI infrastructure.

The PS-SHA∞ concept and Lucidia breath synchronization are core innovations of BlackRoad OS. Special thanks to all contributors and the open source community.

---

**Built with 🖤 by BlackRoad**
