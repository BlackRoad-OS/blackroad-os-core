# BlackRoad OS Core Architecture (Intended)

This document captures the intended end-state architecture, based on the
current repository layout and direction of travel. It describes roles and flow,
not current implementation status or changes.

## Canonical Runtime Flow (UI -> Agents)

1) User and ops surfaces
- Web UI: `apps/web` (Next.js)
- Desktop shell: `apps/desktop` (Tauri wrapper around the web UI; renders the same Next.js frontend)
- Ops/observability portal: `apps/prism-portal` (Streamlit; monitoring surface)

2) TypeScript interface and bridge layer
- Primary bridge and API gateway: `src/api/bridge.ts`
  - REST endpoints, SSE streams, and a WebSocket client to the Python
    orchestrator
- TypeScript API contract for UI integration: `src/trpc/router.ts` (router and types)
- Shared UI/auth/util libraries: `packages/ui`, `lib/*`, `packages/sdk-ts`

3) Canonical orchestration runtime (Python-first)
- Orchestrator service: `src/orchestrator.py` (FastAPI)
  - Initializes system components and exposes REST + WebSocket endpoints

4) Python core runtime
- Core runtime and services: `src/blackroad_core/*`
  - Lucidia breath engine, networking, communication bus, packs, LLM routing

5) Agents
- Agent lifecycle and spawning: `src/blackroad_core/spawner.py`
- Agent definitions and manifests: `src/blackroad_core/agents/*`

## Canonical Orchestration Choice

The intended, canonical orchestration runtime is Python. TypeScript is the
interface and bridge layer used by UI and service boundaries, while the Python
orchestrator and core runtime execute the operational system and agent logic.

## Separation of Concerns

Core OS (canonical)
- Domain contracts and shared types: `src/index.ts` and `src/*` (identity,
  session, permissions, desktop, events, constants, truth)
- Python runtime: `src/blackroad_core/*`
- TS-Python bridge and gateway: `src/api/bridge.ts`
- Core SDKs: `packages/sdk-ts`, `packages/sdk-py`

Product and ops surfaces
- Infra inventory API: `src/api/server.ts`
- Job hunter product types and routes: `src/packs/job-hunter.ts`,
  `src/api/job-hunter/route.ts`
- Ops/observability UI: `apps/prism-portal`
- Operational artifacts (docs, policy, scripts): `docs/`, `policy/`, `scripts/` (not runtime services)

Exploratory or conceptual
- TypeScript orchestration prototypes: `src/agent-orchestration/*`
- Standalone/demo orchestrator flow: `src/blackroad_core/orchestrator.py`
