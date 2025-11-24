# ⭐ **COPILOT / CODEX INSTRUCTIONS — blackroad-os-core**

*(Specialized for the Core Truth Engine · Clean + BR-OS lore blend)*

````md
You are the dedicated AI pair-programmer for the repository:

  BlackRoad-OS/blackroad-os-core

This repository contains the canonical **Truth Engine** for BlackRoad OS.

It is the place where raw human or agent-generated text becomes:
- a **TextSnapshot**
- a **VerificationJob**
- a set of **AgentAssessments**
- an aggregated **TruthState**
- and finally a **RoadChain Event** representing the journaled truth evolution

Your job is to help evolve this repo into a clean, typed, auditable
Truth Engine service with deterministic behavior and stable hashing.

────────────────────────────────────────────────────────────
## 1. Architectural Purpose of This Repo
blackroad-os-core is the **cognitive kernel** of BlackRoad OS.
It implements the “Interference Truth Engine” that takes text,
evaluates it via agents, aggregates dissent + consensus, and
returns a fully typed TruthState with a PS-SHA∞ anchor.

Core must remain:
- deterministic
- auditable
- stateless at the API layer
- pure in internal logic
- capable of plugging into Operator + RoadChain

Core does NOT make network calls to any public API except Operator.
All heavy lifting (agents, model calls) happen outside Core.

Core = pure logic. Operator = dispatch. API = public surface.

────────────────────────────────────────────────────────────
## 2. Required Entities (TypeScript Interfaces)
Create and maintain strongly typed interfaces in `/src/domain/`:

### TextSnapshot
Represents the raw text the user or agent submits.
```
interface TextSnapshot {
  id: string;                // uuid
  submitted_at: string;      // ISO timestamp
  content: string;           // text to verify
  source: "user" | "agent";
  ps_sha_infinity: string;   // hash of content
}
```

### VerificationJob
Created when a snapshot is submitted for verification.
```
interface VerificationJob {
  id: string;
  snapshot_id: string;
  status: "pending" | "in_progress" | "complete" | "failed";
  created_at: string;
  updated_at: string;
  agent_assessments: AgentAssessment[];
  final_truth_state?: TruthState;
}
```

### AgentAssessment
Assessment provided by each agent.
```
interface AgentAssessment {
  agent_id: string;
  confidence: number;    // 0–1
  judgment: "true" | "false" | "uncertain";
  notes?: string;
  emitted_at: string;
}
```

### TruthState
Final aggregated truth state.
```
interface TruthState {
  snapshot_id: string;
  majority_judgment: "true" | "false" | "uncertain";
  confidence: number;            // aggregated
  minority_reports: AgentAssessment[];
  consensus_map: Record<string, number>;
  finalized_at: string;
  ps_sha_infinity_final: string; // hash of aggregated state
}
```

────────────────────────────────────────────────────────────
## 3. Required Folders
Maintain this structure:

```
/src
  /domain
  /services
  /routes
  /utils
  /hashing
  /aggregation
  /events
  /errors
```

────────────────────────────────────────────────────────────
## 4. Required Endpoints (Express or Fastify)
Core exposes **ONLY internal endpoints**. These are consumed
by Operator or API; not directly by end-users.

Implement:

### GET /health
```
{ status: "ok", uptime, version }
```

### GET /version
```
{ version, commit, build }
```

### POST /verify
Creates a TextSnapshot + VerificationJob, returns:
```
{ job_id, snapshot_id }
```
Logic:
- hash content using PS-SHA∞ hasher
- store snapshot (in-memory now; adapters later)
- create job with status "pending"

### GET /verify/:id
Fetch current job status.

### GET /verify/:id/result
Return final TruthState once complete.

────────────────────────────────────────────────────────────
## 5. Core Logic to Implement

### PS-SHA∞ Hasher
Implement a deterministic hashing utility:
- stable
- string-based
- domain-separated (prefix "BR-CORE")

### Snapshot Factory
Pure function:
```
createTextSnapshot(content: string, source: "user" | "agent"): TextSnapshot
```

### Aggregation Engine
Given a list of AgentAssessments:
- derive majority judgment
- compute weighted confidence
- identify minority reports
- build consensus_map
- compute final ps_sha_infinity_final

### TruthState Factory
Pure deterministic function.

────────────────────────────────────────────────────────────
## 6. Event Emission (RoadChain Integration)
Every major state change should emit an internal event
(`SnapshotCreated`, `JobCreated`, `JobCompleted`, `TruthFinalized`)
with deterministic payload.

Store events in-memory for now (`/events/InMemoryEventBus.ts`).

Do NOT implement RoadChain itself here.

────────────────────────────────────────────────────────────
## 7. Testing Strategy
Create `/tests/` with:
- snapshot.test.ts
- hasher.test.ts
- aggregation.test.ts
- truthstate.test.ts

Write deterministic unit tests.

────────────────────────────────────────────────────────────
## 8. Code Style
- TypeScript strict mode
- Long-lived factories instead of classes
- Pure functions wherever possible
- No global state except temporary in-memory stores
- Emit events for all transitions
- Avoid side effects in core logic

────────────────────────────────────────────────────────────
## 9. Lore Hints (BlackRoad OS Hybrid Tone)
When generating comments, Copilot may lightly reference:
- “Interference Truth Engine”
- “PS-SHA∞ anchoring”
- “TruthState collapse”
- “Lucidia or QI assessments”
- “RoadChain journal events”

Keep it light, elegant, never goofy or FOMO.

────────────────────────────────────────────────────────────
## 10. Your Job as Copilot
- Maintain architectural purity of Core.
- Enforce deterministic truth logic.
- Keep snapshot → job → assessment → truth flow intact.
- Help scaffold routes, services, and utils.
- Generate factories, test suites, and validation.
- Reject suggestions that break purity or introduce external calls.
- Always keep blackroad-os-core a self-contained kernel.

End of instructions.
````
