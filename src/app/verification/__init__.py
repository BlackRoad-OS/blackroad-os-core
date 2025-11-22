"""Verification and provenance engine for BlackRoad OS core."""

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
from .service import (
    create_text_snapshot,
    create_verification_job,
    create_verification_policy,
    get_job,
    get_snapshot,
    get_truth_state,
    list_assessments_for_job,
    list_jobs_for_claim,
    list_snapshots_by_parent,
    recalculate_truth_state_for_claim,
    record_agent_assessment,
)

__all__ = [
    "AgentAssessment",
    "AssessmentVerdict",
    "TextSnapshot",
    "TruthState",
    "TruthStatus",
    "VerificationJob",
    "VerificationPolicy",
    "VerificationStatus",
    "create_text_snapshot",
    "create_verification_job",
    "create_verification_policy",
    "get_job",
    "get_snapshot",
    "get_truth_state",
    "list_assessments_for_job",
    "list_jobs_for_claim",
    "list_snapshots_by_parent",
    "recalculate_truth_state_for_claim",
    "record_agent_assessment",
]
