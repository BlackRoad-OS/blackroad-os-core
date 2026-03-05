/**
 * End-to-End Test: Truth Engine Pipeline
 *
 * Exercises the full flow described in the architecture docs:
 *   TextSnapshot → VerificationJob → AgentAssessments → TruthState → RoadChain Event
 *
 * All stages are pure / in-process — no network calls, no DB.
 */

import { createHash } from "crypto";

import { computePsShaInfinity, isPsShaInfinity } from "../src/identity/psShaInfinity";
import { GENESIS_IDENTITY_HASHES } from "../src/identity/genesis";
import { startJob, completeJob } from "../src/jobs/jobLifecycle";
import { aggregateTruthState } from "../src/truth/truthAggregation";
import { hashJournalEntry, withJournalHash } from "../src/utils/hashing";
import { toTimestamp } from "../src/utils/time";
import { DomainEventTypes } from "../src/events/domainEvent";

import type { TextSnapshot } from "../src/truth/textSnapshot";
import type { VerificationJob } from "../src/truth/verificationJob";
import type { AgentAssessment, TruthState } from "../src/truth/truthState";
import type { Job } from "../src/jobs/jobTypes";
import type { DomainEvent, AgentRunCompletedPayload } from "../src/events/domainEvent";
import type { JournalEntry } from "../src/events/journalEntry";
import type { RoadChainBlock } from "../src/events/roadChain";
import type { HashableJournalEntry } from "../src/utils/hashing";

// ─── Deterministic timestamps used throughout ────────────────────────────────
const T0 = "2025-01-01T00:00:00.000Z";
const T1 = "2025-01-01T00:01:00.000Z";
const T2 = "2025-01-01T00:02:00.000Z";
const T3 = "2025-01-01T00:03:00.000Z";
const T4 = "2025-01-01T00:04:00.000Z";

// ─── Deterministic IDs ────────────────────────────────────────────────────────
const SNAPSHOT_ID = computePsShaInfinity({ kind: "text_snapshot", seed: "e2e-content-v1", namespace: "test" });
const JOB_ID      = computePsShaInfinity({ kind: "job",           seed: "e2e-job-v1",     namespace: "test" });
const TRUTH_ID    = computePsShaInfinity({ kind: "job",           seed: "e2e-truth-v1",   namespace: "test" });
const EVENT_ID    = computePsShaInfinity({ kind: "event",         seed: "e2e-event-v1",   namespace: "test" });
const ENTRY_ID    = computePsShaInfinity({ kind: "ledger_block",  seed: "e2e-entry-v1",   namespace: "test" });
const AGENT_A_ID  = computePsShaInfinity({ kind: "agent",         seed: "e2e-agent-a",    namespace: "test" });
const AGENT_B_ID  = computePsShaInfinity({ kind: "agent",         seed: "e2e-agent-b",    namespace: "test" });
const AGENT_C_ID  = computePsShaInfinity({ kind: "agent",         seed: "e2e-agent-c",    namespace: "test" });
const ASSESS_A_ID = computePsShaInfinity({ kind: "job",           seed: "e2e-assess-a",   namespace: "test" });
const ASSESS_B_ID = computePsShaInfinity({ kind: "job",           seed: "e2e-assess-b",   namespace: "test" });
const ASSESS_C_ID = computePsShaInfinity({ kind: "job",           seed: "e2e-assess-c",   namespace: "test" });

// ─── Operator authority (genesis) ────────────────────────────────────────────
const OPERATOR_HASH = GENESIS_IDENTITY_HASHES.OPERATOR;

describe("Truth Engine — end-to-end pipeline", () => {
  // ── Stage 1: TextSnapshot ──────────────────────────────────────────────────

  describe("Stage 1 — TextSnapshot", () => {
    it("creates a well-formed TextSnapshot with a valid PS-SHA∞ id and content hash", () => {
      const content = "The sky appears blue due to Rayleigh scattering of sunlight.";
      const contentHash = createHash("sha256").update(content, "utf8").digest("hex");

      const snapshot: TextSnapshot = {
        id: SNAPSHOT_ID,
        createdAt: T0,
        sourceSystem: "e2e-test",
        content,
        hash: contentHash,
      };

      expect(isPsShaInfinity(snapshot.id)).toBe(true);
      expect(snapshot.content).toBe(content);
      expect(snapshot.hash).toHaveLength(64);
      expect(snapshot.hash).toMatch(/^[0-9a-f]{64}$/);
    });

    it("produces a deterministic id for the same seed", () => {
      const idA = computePsShaInfinity({ kind: "text_snapshot", seed: "e2e-content-v1", namespace: "test" });
      const idB = computePsShaInfinity({ kind: "text_snapshot", seed: "e2e-content-v1", namespace: "test" });
      expect(idA).toBe(idB);
      expect(idA).toBe(SNAPSHOT_ID);
    });

    it("produces different ids for different seeds", () => {
      const idX = computePsShaInfinity({ kind: "text_snapshot", seed: "seed-x", namespace: "test" });
      const idY = computePsShaInfinity({ kind: "text_snapshot", seed: "seed-y", namespace: "test" });
      expect(idX).not.toBe(idY);
    });
  });

  // ── Stage 2: VerificationJob ───────────────────────────────────────────────

  describe("Stage 2 — VerificationJob", () => {
    it("creates a pending VerificationJob referencing the snapshot", () => {
      const job: VerificationJob = {
        id: JOB_ID,
        createdAt: T0,
        snapshotId: SNAPSHOT_ID,
        kind: "factual_consistency",
        status: "pending",
        requestedBy: "e2e-test-requester",
        authorizedBy: OPERATOR_HASH,
      };

      expect(isPsShaInfinity(job.id)).toBe(true);
      expect(job.snapshotId).toBe(SNAPSHOT_ID);
      expect(job.status).toBe("pending");
      expect(job.kind).toBe("factual_consistency");
      expect(job.authorizedBy).toBe(OPERATOR_HASH);
    });
  });

  // ── Stage 3: Job lifecycle (pending → running → completed) ─────────────────

  describe("Stage 3 — Job lifecycle", () => {
    const baseJob: Job<{ snapshotId: string }, { assessments: number }> = {
      id: JOB_ID,
      agentId: AGENT_A_ID,
      createdAt: T0,
      updatedAt: T0,
      type: "verification",
      status: "queued",
      input: { snapshotId: SNAPSHOT_ID },
    };

    it("transitions to running", () => {
      const running = startJob(baseJob, T1);
      expect(running.status).toBe("running");
      expect(running.updatedAt).toBe(T1);
      expect(running.id).toBe(JOB_ID);
    });

    it("transitions to completed with output", () => {
      const running = startJob(baseJob, T1);
      const completed = completeJob(running, { assessments: 3 }, T2);
      expect(completed.status).toBe("completed");
      expect(completed.output).toEqual({ assessments: 3 });
      expect(completed.updatedAt).toBe(T2);
    });

    it("preserves the original job when transitioning", () => {
      const running = startJob(baseJob, T1);
      // Original must be untouched
      expect(baseJob.status).toBe("queued");
      expect(running.status).toBe("running");
    });
  });

  // ── Stage 4: AgentAssessments ──────────────────────────────────────────────

  describe("Stage 4 — AgentAssessments", () => {
    it("accepts well-formed assessments with valid PS-SHA∞ ids", () => {
      const assessments: AgentAssessment[] = [
        {
          id: ASSESS_A_ID,
          jobId: JOB_ID,
          agentId: AGENT_A_ID,
          createdAt: T2,
          verdict: "true",
          confidence: 0.92,
          reasoning: "Multiple peer-reviewed sources confirm Rayleigh scattering.",
        },
        {
          id: ASSESS_B_ID,
          jobId: JOB_ID,
          agentId: AGENT_B_ID,
          createdAt: T2,
          verdict: "true",
          confidence: 0.78,
        },
        {
          id: ASSESS_C_ID,
          jobId: JOB_ID,
          agentId: AGENT_C_ID,
          createdAt: T2,
          verdict: "false",
          confidence: 0.05,
          reasoning: "Weak dissenting signal.",
        },
      ];

      assessments.forEach((a) => {
        expect(isPsShaInfinity(a.id)).toBe(true);
        expect(isPsShaInfinity(a.jobId)).toBe(true);
        expect(isPsShaInfinity(a.agentId)).toBe(true);
        expect(a.confidence).toBeGreaterThanOrEqual(0);
        expect(a.confidence).toBeLessThanOrEqual(1);
        expect(["true", "false", "unknown", "contradictory"]).toContain(a.verdict);
      });
    });
  });

  // ── Stage 5: TruthState aggregation ───────────────────────────────────────

  describe("Stage 5 — TruthState aggregation", () => {
    const assessments: AgentAssessment[] = [
      { id: ASSESS_A_ID, jobId: JOB_ID, agentId: AGENT_A_ID, createdAt: T2, verdict: "true",  confidence: 0.92 },
      { id: ASSESS_B_ID, jobId: JOB_ID, agentId: AGENT_B_ID, createdAt: T2, verdict: "true",  confidence: 0.78 },
      { id: ASSESS_C_ID, jobId: JOB_ID, agentId: AGENT_C_ID, createdAt: T2, verdict: "false", confidence: 0.05 },
    ];

    let truthState: TruthState;

    beforeEach(() => {
      truthState = aggregateTruthState({
        truthId: TRUTH_ID,
        snapshotId: SNAPSHOT_ID,
        jobId: JOB_ID,
        assessments,
        updatedAt: T3,
      });
    });

    it("produces a majority 'true' verdict", () => {
      expect(truthState.aggregatedVerdict).toBe("true");
    });

    it("links back to the snapshot and job", () => {
      expect(truthState.snapshotId).toBe(SNAPSHOT_ID);
      expect(truthState.jobId).toBe(JOB_ID);
      expect(truthState.id).toBe(TRUTH_ID);
    });

    it("has confidence between 0 and 1", () => {
      expect(truthState.aggregatedConfidence).toBeGreaterThan(0);
      expect(truthState.aggregatedConfidence).toBeLessThanOrEqual(1);
    });

    it("captures minority reports for the dissenting agent", () => {
      expect(truthState.minorityReports).toBeDefined();
      expect(truthState.minorityReports!.length).toBe(1);
      expect(truthState.minorityReports![0].verdict).toBe("false");
    });

    it("weighted confidence equals true_score / total_score", () => {
      const trueScore = 0.92 + 0.78; // 1.70
      const total = 0.92 + 0.78 + 0.05; // 1.75
      const expected = Number((trueScore / total).toFixed(4));
      expect(truthState.aggregatedConfidence).toBeCloseTo(expected, 4);
    });

    it("returns contradictory when signals are balanced", () => {
      const balanced: AgentAssessment[] = [
        { id: ASSESS_A_ID, jobId: JOB_ID, agentId: AGENT_A_ID, createdAt: T2, verdict: "true",  confidence: 0.50 },
        { id: ASSESS_B_ID, jobId: JOB_ID, agentId: AGENT_B_ID, createdAt: T2, verdict: "false", confidence: 0.49 },
      ];
      const state = aggregateTruthState({
        truthId: TRUTH_ID, snapshotId: SNAPSHOT_ID, jobId: JOB_ID,
        assessments: balanced, updatedAt: T3,
      });
      expect(state.aggregatedVerdict).toBe("contradictory");
      expect(state.aggregatedConfidence).toBe(0);
    });

    it("returns unknown when all confidences are zero", () => {
      const zeroed: AgentAssessment[] = [
        { id: ASSESS_A_ID, jobId: JOB_ID, agentId: AGENT_A_ID, createdAt: T2, verdict: "true",  confidence: 0 },
        { id: ASSESS_B_ID, jobId: JOB_ID, agentId: AGENT_B_ID, createdAt: T2, verdict: "false", confidence: 0 },
      ];
      const state = aggregateTruthState({
        truthId: TRUTH_ID, snapshotId: SNAPSHOT_ID, jobId: JOB_ID,
        assessments: zeroed, updatedAt: T3,
      });
      expect(state.aggregatedVerdict).toBe("unknown");
      expect(state.aggregatedConfidence).toBe(0);
    });
  });

  // ── Stage 6: DomainEvent emission ─────────────────────────────────────────

  describe("Stage 6 — DomainEvent emission", () => {
    it("emits an agent.run_completed event referencing the truth job", () => {
      const event: DomainEvent<AgentRunCompletedPayload> = {
        id: EVENT_ID,
        type: DomainEventTypes.AGENT_RUN_COMPLETED,
        payload: {
          runId: JOB_ID,
          agentId: AGENT_A_ID,
          jobId: JOB_ID,
          status: "completed",
          duration: 180,
          output: {
            truthStateId: TRUTH_ID,
            verdict: "true",
          },
        },
        severity: "info",
        timestamp: T3,
        agentId: AGENT_A_ID,
        authorizedBy: OPERATOR_HASH,
      };

      expect(event.type).toBe("agent.run_completed");
      expect(event.severity).toBe("info");
      expect(isPsShaInfinity(event.id)).toBe(true);
      expect(event.payload.output?.["verdict"]).toBe("true");
    });
  });

  // ── Stage 7: JournalEntry + hash chain ────────────────────────────────────

  describe("Stage 7 — JournalEntry hashing", () => {
    const event: DomainEvent = {
      id: EVENT_ID,
      type: DomainEventTypes.AGENT_RUN_COMPLETED,
      payload: { runId: JOB_ID, agentId: AGENT_A_ID, jobId: JOB_ID, status: "completed", duration: 180 },
      severity: "info",
      timestamp: T3,
      authorizedBy: OPERATOR_HASH,
    };

    const GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000";

    const entryWithoutHash: HashableJournalEntry = {
      id: ENTRY_ID,
      event,
      previousHash: GENESIS_HASH,
      timestamp: toTimestamp(new Date(T3)),
    };

    it("produces a deterministic SHA-256 hash", () => {
      const h1 = hashJournalEntry(entryWithoutHash);
      const h2 = hashJournalEntry(entryWithoutHash);
      expect(h1).toBe(h2);
      expect(h1).toHaveLength(64);
      expect(h1).toMatch(/^[0-9a-f]{64}$/);
    });

    it("adds the hash field via withJournalHash", () => {
      const entry: JournalEntry = withJournalHash(entryWithoutHash);
      expect(entry.hash).toBeDefined();
      expect(entry.hash).toHaveLength(64);
      expect(entry.previousHash).toBe(GENESIS_HASH);
    });

    it("changes the hash when the event payload changes", () => {
      const original = hashJournalEntry(entryWithoutHash);
      const modified = hashJournalEntry({
        ...entryWithoutHash,
        event: { ...event, timestamp: T4 },
      });
      expect(original).not.toBe(modified);
    });

    it("chains two journal entries so block N's previousHash equals block N-1's hash", () => {
      const entry1 = withJournalHash(entryWithoutHash);

      const secondEntryId = computePsShaInfinity({ kind: "ledger_block", seed: "e2e-entry-v2", namespace: "test" });
      const entry2: JournalEntry = withJournalHash({
        id: secondEntryId,
        event: { ...event, id: EVENT_ID, timestamp: T4 },
        previousHash: entry1.hash,
        timestamp: toTimestamp(new Date(T4)),
      });

      expect(entry2.previousHash).toBe(entry1.hash);
      expect(entry2.hash).not.toBe(entry1.hash);
    });
  });

  // ── Stage 8: RoadChainBlock ────────────────────────────────────────────────

  describe("Stage 8 — RoadChainBlock", () => {
    it("constructs a valid genesis block (height 0)", () => {
      const block: RoadChainBlock = {
        height: 0,
        hash: "0000000000000000000000000000000000000000000000000000000000000000",
        prevHash: "",
        timestamp: T0,
        journalEntryIds: [],
        authorizedBy: GENESIS_IDENTITY_HASHES.PRINCIPAL,
      };

      expect(block.height).toBe(0);
      expect(block.prevHash).toBe("");
      expect(block.journalEntryIds).toHaveLength(0);
    });

    it("constructs block 1 referencing the journal entry", () => {
      const event: DomainEvent = {
        id: EVENT_ID,
        type: DomainEventTypes.AGENT_RUN_COMPLETED,
        payload: { runId: JOB_ID, agentId: AGENT_A_ID, jobId: JOB_ID, status: "completed", duration: 180 },
        severity: "info",
        timestamp: T3,
        authorizedBy: OPERATOR_HASH,
      };

      const GENESIS_HASH = "0000000000000000000000000000000000000000000000000000000000000000";
      const entry = withJournalHash({
        id: ENTRY_ID,
        event,
        previousHash: GENESIS_HASH,
        timestamp: T3,
      });

      const block1: RoadChainBlock = {
        height: 1,
        hash: entry.hash,
        prevHash: GENESIS_HASH,
        timestamp: T3,
        journalEntryIds: [ENTRY_ID],
        authorizedBy: OPERATOR_HASH,
        witnessedBy: [GENESIS_IDENTITY_HASHES.PRINCIPAL],
      };

      expect(block1.height).toBe(1);
      expect(block1.hash).toBe(entry.hash);
      expect(block1.prevHash).toBe(GENESIS_HASH);
      expect(block1.journalEntryIds).toContain(ENTRY_ID);
      expect(block1.witnessedBy).toContain(GENESIS_IDENTITY_HASHES.PRINCIPAL);
    });
  });

  // ── Full pipeline integration ──────────────────────────────────────────────

  describe("Full pipeline — TextSnapshot → RoadChainBlock", () => {
    it("links every stage from content ingestion to ledger commit", () => {
      // 1. Snapshot
      const content = "E = mc²";
      const contentHash = createHash("sha256").update(content, "utf8").digest("hex");
      const snapshot: TextSnapshot = {
        id: SNAPSHOT_ID,
        createdAt: T0,
        sourceSystem: "integration-test",
        content,
        hash: contentHash,
      };

      // 2. VerificationJob
      const verificationJob: VerificationJob = {
        id: JOB_ID,
        createdAt: T0,
        snapshotId: snapshot.id,
        kind: "factual_consistency",
        status: "pending",
        requestedBy: "integration-test",
        authorizedBy: OPERATOR_HASH,
      };
      expect(verificationJob.snapshotId).toBe(snapshot.id);

      // 3. Job lifecycle
      const baseJob: Job<{ snapshotId: string }> = {
        id: JOB_ID,
        agentId: AGENT_A_ID,
        createdAt: T0,
        updatedAt: T0,
        type: "verification",
        status: "queued",
        input: { snapshotId: SNAPSHOT_ID },
      };
      const running = startJob(baseJob, T1);
      expect(running.status).toBe("running");

      // 4. Assessments
      const assessments: AgentAssessment[] = [
        { id: ASSESS_A_ID, jobId: JOB_ID, agentId: AGENT_A_ID, createdAt: T2, verdict: "true",  confidence: 0.95 },
        { id: ASSESS_B_ID, jobId: JOB_ID, agentId: AGENT_B_ID, createdAt: T2, verdict: "true",  confidence: 0.80 },
        { id: ASSESS_C_ID, jobId: JOB_ID, agentId: AGENT_C_ID, createdAt: T2, verdict: "false", confidence: 0.10 },
      ];

      // 5. TruthState
      const truthState = aggregateTruthState({
        truthId: TRUTH_ID,
        snapshotId: snapshot.id,
        jobId: JOB_ID,
        assessments,
        updatedAt: T3,
      });
      expect(truthState.aggregatedVerdict).toBe("true");
      expect(truthState.snapshotId).toBe(snapshot.id);

      // 6. Job completion
      const completed = completeJob(running, { truthStateId: truthState.id }, T3);
      expect(completed.status).toBe("completed");

      // 7. DomainEvent
      const domainEvent: DomainEvent<AgentRunCompletedPayload> = {
        id: EVENT_ID,
        type: DomainEventTypes.AGENT_RUN_COMPLETED,
        payload: {
          runId: JOB_ID,
          agentId: AGENT_A_ID,
          jobId: JOB_ID,
          status: "completed",
          duration: 180,
          output: { truthStateId: truthState.id, verdict: truthState.aggregatedVerdict },
        },
        severity: "info",
        timestamp: T3,
        authorizedBy: OPERATOR_HASH,
      };
      expect(domainEvent.payload.output?.["verdict"]).toBe("true");

      // 8. JournalEntry
      const GENESIS_HASH = "0".repeat(64);
      const entry = withJournalHash({
        id: ENTRY_ID,
        event: domainEvent,
        previousHash: GENESIS_HASH,
        timestamp: T3,
      });
      expect(entry.hash).toHaveLength(64);
      expect(entry.previousHash).toBe(GENESIS_HASH);
      expect(entry.event.payload).toEqual(domainEvent.payload);

      // 9. RoadChainBlock
      const block: RoadChainBlock = {
        height: 1,
        hash: entry.hash,
        prevHash: GENESIS_HASH,
        timestamp: T3,
        journalEntryIds: [entry.id],
        authorizedBy: OPERATOR_HASH,
      };
      expect(block.journalEntryIds[0]).toBe(ENTRY_ID);
      expect(block.hash).toBe(entry.hash);

      // Integrity: truth state → snapshot link survives into the ledger
      expect(entry.event.payload).toMatchObject({
        output: { truthStateId: truthState.id, verdict: "true" },
      });
    });
  });
});
