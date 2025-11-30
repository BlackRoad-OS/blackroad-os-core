# BlackRoad OS Architecture

> The unified operating system for AI agents, humans, and hybrid intelligence.

## The Spine

BlackRoad OS is organized into **18 canonical repositories** under the `BlackRoad-OS` organization. Everything else is either merged into these, archived, or lives outside the OS as personal/experimental work.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BLACKROAD OS SPINE                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    CORE RUNTIME LAYER                        │   │
│  │                                                              │   │
│  │  blackroad-os-core      The kernel. Types, runtime,         │   │
│  │                         protocol, orchestration graph,       │   │
│  │                         PS-SHA∞ identity, agent lifecycle    │   │
│  │                                                              │   │
│  │  blackroad-os-operator  The "Cece" layer. Orchestrates      │   │
│  │                         agents, runs plans, hooks CLI        │   │
│  │                                                              │   │
│  │  blackroad-os-agents    Base agent SDK + canonical agents   │   │
│  │                         (Lucidia, Atlas, Cadillac, etc.)    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    VERTICAL PACKS                            │   │
│  │                                                              │   │
│  │  blackroad-os-pack-finance        Financial services        │   │
│  │  blackroad-os-pack-education      Learning & training       │   │
│  │  blackroad-os-pack-creator-studio Content creation          │   │
│  │  blackroad-os-pack-infra-devops   Infrastructure ops        │   │
│  │  blackroad-os-pack-legal          Legal & compliance        │   │
│  │  blackroad-os-pack-research-lab   Research workflows        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    WEB / EXPERIENCE LAYER                    │   │
│  │                                                              │   │
│  │  blackroad-os-web         Single Next.js app powering:      │   │
│  │                           • blackroad.io (marketing)        │   │
│  │                           • app.blackroad.io (workspace)    │   │
│  │                           • console.blackroad.io (god view) │   │
│  │                           • finance/studio/edu.blackroad.io │   │
│  │                                                              │   │
│  │  blackroad-os-prism-console  Console components (may merge) │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    API / INFRA / MESH                        │   │
│  │                                                              │   │
│  │  blackroad-os-api-gateway  Public API (HTTP + WS), auth     │   │
│  │  blackroad-os-api          Internal service logic           │   │
│  │  blackroad-os-infra        IaC: Railway, Cloudflare, envs   │   │
│  │  blackroad-os-mesh         Service discovery, routing       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    EDGE / PI / HARDWARE                      │   │
│  │                                                              │   │
│  │  blackroad-pi-ops     Pi controller + deployment scripts    │   │
│  │  blackroad-pi-holo    Holographic/UX side of Pi agents      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    INTELLIGENCE LAYER (LUCIDIA)              │   │
│  │                                                              │   │
│  │  lucidia-core         Core intelligence primitives          │   │
│  │  lucidia-math         Mathematical reasoning engine         │   │
│  │  lucidia-platform     Platform integration layer            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    DOCS & BRAND                              │   │
│  │                                                              │   │
│  │  blackroad-os-docs    All OS documentation                  │   │
│  │  blackroad-os-brand   Brand kit, logos, design tokens       │   │
│  │  blackroad-os-archive Long-term storage for deprecated      │   │
│  │  blackroad-tools      CLI, SDK, dev tooling                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Dependency Graph

```
                    ┌──────────────────┐
                    │  lucidia-math    │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  lucidia-core    │
                    └────────┬─────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│blackroad-os-core│ │  lucidia-       │ │ blackroad-      │
│                 │ │  platform       │ │ os-mesh         │
└────────┬────────┘ └─────────────────┘ └────────┬────────┘
         │                                       │
         ├───────────────────────────────────────┤
         │                                       │
         ▼                                       ▼
┌─────────────────┐                     ┌─────────────────┐
│blackroad-os-    │                     │blackroad-os-    │
│agents           │                     │infra            │
└────────┬────────┘                     └────────┬────────┘
         │                                       │
         ▼                                       ▼
┌─────────────────┐                     ┌─────────────────┐
│blackroad-os-    │                     │blackroad-os-    │
│operator         │                     │api-gateway      │
└────────┬────────┘                     └────────┬────────┘
         │                                       │
         └───────────────────┬───────────────────┘
                             │
                    ┌────────▼─────────┐
                    │ blackroad-os-web │
                    └──────────────────┘
```

## Domain Routing

All domains route through Cloudflare Tunnel to Railway services:

| Domain | Target | Context |
|--------|--------|---------|
| `blackroad.io` | blackroad-os-web | marketing |
| `app.blackroad.io` | blackroad-os-web | workspace |
| `console.blackroad.io` | blackroad-os-web | console |
| `finance.blackroad.io` | blackroad-os-web | pack:finance |
| `studio.blackroad.io` | blackroad-os-web | pack:creator-studio |
| `edu.blackroad.io` | blackroad-os-web | pack:education |
| `api.blackroad.io` | blackroad-os-api-gateway | api |
| `lucidia.earth` | blackroad-os-web | lucidia |
| `lucidia.studio` | blackroad-os-web | lucidia:studio |

## Railway Services

```yaml
services:
  blackroad-os-web:
    image: node:20
    port: 3000
    domains:
      - blackroad.io
      - app.blackroad.io
      - console.blackroad.io
    env:
      - API_URL=http://blackroad-os-api-gateway.railway.internal:8080

  blackroad-os-api-gateway:
    image: node:20
    port: 8080
    domains:
      - api.blackroad.io
    env:
      - CORE_URL=http://blackroad-os-core.railway.internal:9000
      - OPERATOR_URL=http://blackroad-os-operator.railway.internal:9001

  blackroad-os-core:
    image: node:20
    port: 9000
    internal: true

  blackroad-os-operator:
    image: node:20
    port: 9001
    internal: true
    env:
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
```

## Pack Structure

Each pack follows this structure:

```
blackroad-os-pack-{name}/
├── flows/
│   ├── onboarding.yml
│   ├── review.yml
│   └── compliance-check.yml
├── policies/
│   ├── policy-a.rego
│   └── policy-b.rego
├── agents/
│   ├── agent-a.config.json
│   └── agent-b.config.json
├── templates/
│   └── ...
└── README.md
```

Packs are **data + config**, not separate runtimes. The actual behavior comes from `blackroad-os-agents` + `lucidia-*`.

## Agent Structure

```
blackroad-os-agents/
├── agents/
│   ├── base/           # Base Agent class, shared runtime
│   ├── lucidia/        # Lucidia agent implementation
│   ├── atlas/          # Atlas agent
│   ├── cadillac/       # Cadillac agent
│   ├── pi-agent/       # Pi hardware agent
│   └── pack-runner/    # Runner for pack workflows
├── templates/
│   ├── new-agent/
│   └── new-pack-agent/
└── README.md
```

## Verified Domains

| Domain | Category | Status |
|--------|----------|--------|
| blackroad.io | Core | ✅ Active |
| blackroadai.com | Core | ✅ Active |
| blackroadinc.us | Core | ✅ Active |
| blackroad.me | Core | ✅ Active |
| blackroad.network | Core | ✅ Active |
| blackroad.systems | Core | ✅ Active |
| blackroadqi.com | Quantum | ✅ Active |
| blackroadquantum.com | Quantum | ✅ Active |
| blackroadquantum.info | Quantum | ✅ Active |
| blackroadquantum.net | Quantum | ✅ Active |
| blackroadquantum.shop | Quantum | ✅ Active |
| blackroadquantum.store | Quantum | ✅ Active |
| lucidia.earth | Lucidia | ✅ Active |
| lucidiaqi.com | Lucidia | ✅ Active |
| lucidia.studio | Lucidia | ✅ Active |
| aliceqi.com | Personal | ✅ Active |

## GitHub Organizations

| Organization | Purpose | Key Repos |
|--------------|---------|-----------|
| BlackRoad-OS | **Primary** - All OS repos | 24 repos |
| Blackbox-Enterprises | Enterprise | 5 repos |
| BlackRoad-AI | AI/ML focus | 12 repos |
| BlackRoad-Labs | Research | 15 repos |
| BlackRoad-Studio | Creative | 11 repos |
| BlackRoad-Foundation | Core/Legal | 3 repos |

## CI/CD Pipeline

Every repo has:

1. **auto-deploy.yml** - Deploy on PR (preview) and push (production)
2. **auto-merge.yml** - Auto-merge when CI passes for trusted actors
3. **ci.yml** - Lint, test, build

Trusted actors: `blackboxprogramming`, `codex-bot`, `dependabot[bot]`, `github-actions[bot]`, `claude-code[bot]`

## Next Steps

See [CONSOLIDATION.md](./CONSOLIDATION.md) for the migration plan to collapse legacy repos into this spine.

---

*Last updated: 2024-11-30*
*Maintainer: @blackboxprogramming*
