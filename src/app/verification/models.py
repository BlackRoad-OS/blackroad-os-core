"""Domain models for the verification and provenance engine."""
from __future__ import annotations

from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class VerificationStatus(str, Enum):
    """Lifecycle state for verification jobs."""

    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class AssessmentVerdict(str, Enum):
    """Verdict values an agent may return."""

    CONFIRMED = "confirmed"
    DISPUTED = "disputed"
    REFUTED = "refuted"
    INCONCLUSIVE = "inconclusive"


class TruthStatus(str, Enum):
    """Aggregated truth states for a claim."""

    CONFIRMED = "confirmed"
    DISPUTED = "disputed"
    REFUTED = "refuted"
    UNCERTAIN = "uncertain"


class TextSnapshot(BaseModel):
    """Represents a specific version of a piece of text."""

    id: UUID = Field(default_factory=uuid4)
    content: str
    source_uri: Optional[str] = None
    author_id: Optional[str] = None
    ps_sha_infinity: str
    parent_snapshot_id: Optional[UUID] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class VerificationPolicy(BaseModel):
    """Rules governing how a TruthState is computed."""

    id: UUID = Field(default_factory=uuid4)
    name: str
    domain: str
    description: Optional[str] = None
    min_agent_count: int = 3
    min_confirmed_confidence: float = 0.75
    max_refuted_fraction: float = 0.25
    require_human_review: bool = False
    auto_escalate_if_disputed: bool = True
    auto_escalate_if_inconclusive: bool = True
    max_job_duration_seconds: int = 300
    required_capabilities: List[str] = Field(default_factory=list)
    compliance_tags: List[str] = Field(default_factory=list)


class VerificationJob(BaseModel):
    """Represents a request to verify a given TextSnapshot under a policy."""

    id: UUID = Field(default_factory=uuid4)
    snapshot_id: UUID
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: VerificationStatus = VerificationStatus.PENDING
    requested_by: Optional[str] = None
    truth_state_hash: Optional[str] = None
    ledger_tx_id: Optional[str] = None
    policy_id: Optional[UUID] = None
    policy_domain: Optional[str] = None
    claim_hash: Optional[str] = None
    expires_at: Optional[datetime] = None


class AgentAssessment(BaseModel):
    """Represents a single agent's judgement about a verification job."""

    id: UUID = Field(default_factory=uuid4)
    job_id: UUID
    agent_id: str
    verdict: AssessmentVerdict
    confidence: float
    reasoning: str
    evidence_uris: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    assessment_hash: str


class TruthState(BaseModel):
    """Represents the aggregated truth state for a claim."""

    claim_hash: str
    status: TruthStatus
    last_updated: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    job_ids: List[UUID] = Field(default_factory=list)
    aggregate_confidence: float = 0.0
    minority_reports: List[UUID] = Field(default_factory=list)
    policy_id: Optional[UUID] = None
    escalated: bool = False
