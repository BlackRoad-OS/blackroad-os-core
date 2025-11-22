"""Verification service functions and in-memory persistence."""
from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone
from statistics import mean
from typing import Dict, List, Optional
from uuid import UUID

from .interfaces import (
    EventPublisher,
    InMemoryRoadChainClient,
    LoggingEventPublisher,
    PsShaInfinityHasher,
    RoadChainClient,
    SimplePsShaInfinityHasher,
)
from .models import (
    AgentAssessment,
    AssessmentVerdict,
    TextSnapshot,
    TruthState,
    TruthStatus,
    VerificationJob,
    VerificationPolicy,
    VerificationStatus,
)

logger = logging.getLogger(__name__)

# In-memory stores for local development. In production, replace with real persistence.
_snapshots: Dict[UUID, TextSnapshot] = {}
_policies: Dict[UUID, VerificationPolicy] = {}
_default_policies_by_domain: Dict[str, UUID] = {}
_jobs: Dict[UUID, VerificationJob] = {}
_assessments: Dict[UUID, AgentAssessment] = {}
_truth_states: Dict[str, TruthState] = {}

_default_hasher: PsShaInfinityHasher = SimplePsShaInfinityHasher()
_default_roadchain: RoadChainClient = InMemoryRoadChainClient()
_default_events: EventPublisher = LoggingEventPublisher()


def reset_state() -> None:
    """Clear in-memory state for testing."""

    _snapshots.clear()
    _policies.clear()
    _jobs.clear()
    _assessments.clear()
    _truth_states.clear()
    _default_policies_by_domain.clear()


def create_text_snapshot(
    content: str,
    metadata: Optional[dict] = None,
    *,
    hasher: PsShaInfinityHasher = _default_hasher,
) -> TextSnapshot:
    """Create and persist a TextSnapshot, computing ps_sha_infinity."""

    metadata = metadata or {}
    snapshot_metadata = {
        "source_uri": metadata.get("source_uri"),
        "author_id": metadata.get("author_id"),
        "parent_snapshot_id": metadata.get("parent_snapshot_id"),
    }
    fingerprint = hasher.hash_text(content, {k: v for k, v in snapshot_metadata.items() if v is not None})
    snapshot = TextSnapshot(
        content=content,
        source_uri=snapshot_metadata.get("source_uri"),
        author_id=snapshot_metadata.get("author_id"),
        parent_snapshot_id=snapshot_metadata.get("parent_snapshot_id"),
        ps_sha_infinity=fingerprint,
    )
    _snapshots[snapshot.id] = snapshot
    logger.info("Created TextSnapshot", extra={"snapshot_id": str(snapshot.id)})
    return snapshot


def create_verification_policy(
    name: str,
    domain: str,
    description: Optional[str] = None,
    *,
    min_agent_count: int = 3,
    min_confirmed_confidence: float = 0.75,
    max_refuted_fraction: float = 0.25,
    require_human_review: bool = False,
    auto_escalate_if_disputed: bool = True,
    auto_escalate_if_inconclusive: bool = True,
    max_job_duration_seconds: int = 300,
    required_capabilities: Optional[List[str]] = None,
    compliance_tags: Optional[List[str]] = None,
    set_as_default: bool = False,
) -> VerificationPolicy:
    """Create and optionally register a verification policy as default for a domain."""

    policy = VerificationPolicy(
        name=name,
        domain=domain,
        description=description,
        min_agent_count=min_agent_count,
        min_confirmed_confidence=min_confirmed_confidence,
        max_refuted_fraction=max_refuted_fraction,
        require_human_review=require_human_review,
        auto_escalate_if_disputed=auto_escalate_if_disputed,
        auto_escalate_if_inconclusive=auto_escalate_if_inconclusive,
        max_job_duration_seconds=max_job_duration_seconds,
        required_capabilities=required_capabilities or [],
        compliance_tags=compliance_tags or [],
    )
    _policies[policy.id] = policy
    if set_as_default:
        _default_policies_by_domain[policy.domain] = policy.id
    logger.info("Created VerificationPolicy", extra={"policy_id": str(policy.id), "domain": domain})
    return policy


def get_verification_policy(policy_id: UUID) -> Optional[VerificationPolicy]:
    return _policies.get(policy_id)


def get_default_policy(domain: Optional[str]) -> VerificationPolicy:
    if domain and domain in _default_policies_by_domain:
        policy_id = _default_policies_by_domain[domain]
        return _policies[policy_id]

    # If no default exists, create a new one with standard defaults.
    policy = create_verification_policy(
        name=f"Default policy for {domain or 'general'}",
        domain=domain or "general",
        set_as_default=True,
    )
    return policy


def create_verification_job(
    snapshot_id: UUID,
    requested_by: Optional[str] = None,
    *,
    policy_id: Optional[UUID] = None,
    domain: Optional[str] = None,
    claim_hash: Optional[str] = None,
    hasher: PsShaInfinityHasher = _default_hasher,
    roadchain: RoadChainClient = _default_roadchain,
    events: EventPublisher = _default_events,
) -> VerificationJob:
    """Create a verification job and append an entry to RoadChain."""

    if snapshot_id not in _snapshots:
        raise ValueError("Snapshot does not exist")

    policy: VerificationPolicy
    if policy_id:
        policy = _policies.get(policy_id) or get_default_policy(domain)
    else:
        policy = get_default_policy(domain)

    snapshot = _snapshots[snapshot_id]
    resolved_claim_hash = claim_hash or snapshot.ps_sha_infinity

    expires_at = None
    if policy.max_job_duration_seconds:
        expires_at = datetime.now(timezone.utc) + timedelta(seconds=policy.max_job_duration_seconds)

    job = VerificationJob(
        snapshot_id=snapshot_id,
        requested_by=requested_by,
        policy_id=policy.id,
        policy_domain=policy.domain,
        claim_hash=resolved_claim_hash,
        expires_at=expires_at,
    )
    _jobs[job.id] = job

    ledger_tx_id = roadchain.append(
        "verification.job.created",
        {"job_id": str(job.id), "snapshot_id": str(snapshot_id), "policy_id": str(policy.id)},
    )
    job.ledger_tx_id = ledger_tx_id

    events.publish("verification.job.created", {"job_id": str(job.id)})
    logger.info("Created VerificationJob", extra={"job_id": str(job.id), "claim_hash": resolved_claim_hash})
    return job


def record_agent_assessment(
    job_id: UUID,
    agent_id: str,
    verdict: AssessmentVerdict,
    confidence: float,
    reasoning: str,
    evidence_uris: Optional[List[str]] = None,
    *,
    hasher: PsShaInfinityHasher = _default_hasher,
    roadchain: RoadChainClient = _default_roadchain,
    events: EventPublisher = _default_events,
    auto_recalculate_truth: bool = True,
) -> AgentAssessment:
    """Persist an agent assessment and optionally recalculate truth state."""

    job = _jobs.get(job_id)
    if job is None:
        raise ValueError("Verification job does not exist")
    if job.status not in {VerificationStatus.PENDING, VerificationStatus.RUNNING}:
        raise ValueError("Assessments cannot be recorded for completed or failed jobs")

    evidence_list = evidence_uris or []
    assessment_payload = {
        "job_id": str(job_id),
        "agent_id": agent_id,
        "verdict": verdict.value,
        "confidence": confidence,
        "reasoning": reasoning,
        "evidence_uris": evidence_list,
    }
    assessment_hash = hasher.hash_structured(assessment_payload)

    assessment = AgentAssessment(
        job_id=job_id,
        agent_id=agent_id,
        verdict=verdict,
        confidence=confidence,
        reasoning=reasoning,
        evidence_uris=evidence_list,
        assessment_hash=assessment_hash,
    )
    _assessments[assessment.id] = assessment

    ledger_tx_id = roadchain.append(
        "verification.assessment.created",
        {"assessment_id": str(assessment.id), "job_id": str(job_id)},
    )
    events.publish("verification.assessment.created", {"assessment_id": str(assessment.id)})

    logger.info(
        "Recorded AgentAssessment",
        extra={"assessment_id": str(assessment.id), "job_id": str(job_id), "ledger_tx_id": ledger_tx_id},
    )

    if auto_recalculate_truth and job.claim_hash:
        recalculate_truth_state_for_claim(job.claim_hash, hasher=hasher, roadchain=roadchain, events=events)

    return assessment


def recalculate_truth_state_for_claim(
    claim_hash: str,
    *,
    hasher: PsShaInfinityHasher = _default_hasher,
    roadchain: RoadChainClient = _default_roadchain,
    events: EventPublisher = _default_events,
) -> TruthState:
    """Aggregate all assessments for a claim and update its TruthState."""

    related_jobs = [job for job in _jobs.values() if job.claim_hash == claim_hash]
    assessments: List[AgentAssessment] = [
        assessment for assessment in _assessments.values() if assessment.job_id in {job.id for job in related_jobs}
    ]

    if not related_jobs:
        raise ValueError("No verification jobs found for the provided claim hash")

    policy = _policies.get(related_jobs[0].policy_id) or get_default_policy(related_jobs[0].policy_domain)

    confirmed = [a for a in assessments if a.verdict == AssessmentVerdict.CONFIRMED]
    refuted = [a for a in assessments if a.verdict == AssessmentVerdict.REFUTED]
    disputed = [a for a in assessments if a.verdict == AssessmentVerdict.DISPUTED]
    inconclusive = [a for a in assessments if a.verdict == AssessmentVerdict.INCONCLUSIVE]

    agent_count = len(assessments)
    confirmed_avg_confidence = mean([a.confidence for a in confirmed]) if confirmed else 0.0
    refuted_fraction = len(refuted) / max(agent_count, 1)

    status = TruthStatus.UNCERTAIN
    if agent_count < policy.min_agent_count:
        status = TruthStatus.UNCERTAIN
    elif confirmed and confirmed_avg_confidence >= policy.min_confirmed_confidence and refuted_fraction <= policy.max_refuted_fraction:
        status = TruthStatus.CONFIRMED
    elif refuted_fraction > policy.max_refuted_fraction:
        status = TruthStatus.REFUTED
    else:
        status = TruthStatus.DISPUTED

    aggregate_confidence = confirmed_avg_confidence if status == TruthStatus.CONFIRMED else max(confirmed_avg_confidence, 1 - refuted_fraction)

    if assessments:
        verdict_counts = {
            AssessmentVerdict.CONFIRMED: len(confirmed),
            AssessmentVerdict.REFUTED: len(refuted),
            AssessmentVerdict.DISPUTED: len(disputed),
            AssessmentVerdict.INCONCLUSIVE: len(inconclusive),
        }
        majority_verdict = max(verdict_counts, key=verdict_counts.get)
        minority_reports = [a.id for a in assessments if a.verdict != majority_verdict]
    else:
        minority_reports = []

    truth_state_payload = {
        "claim_hash": claim_hash,
        "assessment_hashes": sorted([a.assessment_hash for a in assessments]),
        "policy_id": str(policy.id),
        "status": status.value,
        "aggregate_confidence": aggregate_confidence,
    }
    truth_state_hash = hasher.hash_structured(truth_state_payload)

    escalated = False
    if policy.require_human_review:
        escalated = True
    elif policy.auto_escalate_if_disputed and status == TruthStatus.DISPUTED:
        escalated = True
    elif policy.auto_escalate_if_inconclusive and status == TruthStatus.UNCERTAIN:
        escalated = True

    truth_state = TruthState(
        claim_hash=claim_hash,
        status=status,
        last_updated=datetime.now(timezone.utc),
        job_ids=[job.id for job in related_jobs],
        aggregate_confidence=aggregate_confidence,
        minority_reports=minority_reports,
        policy_id=policy.id,
        escalated=escalated,
    )
    _truth_states[claim_hash] = truth_state

    ledger_tx_id = roadchain.append(
        "verification.truth_state.updated",
        {"claim_hash": claim_hash, "truth_state_hash": truth_state_hash, "status": status.value},
    )
    events.publish("verification.truth_state.updated", {"claim_hash": claim_hash, "status": status.value})

    logger.info(
        "TruthState recalculated",
        extra={
            "claim_hash": claim_hash,
            "status": status.value,
            "aggregate_confidence": aggregate_confidence,
            "ledger_tx_id": ledger_tx_id,
        },
    )

    return truth_state


# Helper accessors for routes and callers

def get_snapshot(snapshot_id: UUID) -> Optional[TextSnapshot]:
    return _snapshots.get(snapshot_id)


def get_job(job_id: UUID) -> Optional[VerificationJob]:
    return _jobs.get(job_id)


def list_assessments_for_job(job_id: UUID) -> List[AgentAssessment]:
    return [a for a in _assessments.values() if a.job_id == job_id]


def get_truth_state(claim_hash: str) -> Optional[TruthState]:
    return _truth_states.get(claim_hash)


def list_jobs_for_claim(claim_hash: str) -> List[VerificationJob]:
    return [job for job in _jobs.values() if job.claim_hash == claim_hash]


def list_snapshots_by_parent(parent_snapshot_id: UUID) -> List[TextSnapshot]:
    return [snapshot for snapshot in _snapshots.values() if snapshot.parent_snapshot_id == parent_snapshot_id]


def get_roadchain_entries() -> List[dict]:
    if isinstance(_default_roadchain, InMemoryRoadChainClient):
        return _default_roadchain.entries
    return []
