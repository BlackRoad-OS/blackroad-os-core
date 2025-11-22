"""Internal routes for verification and provenance flows."""
from __future__ import annotations

from uuid import UUID

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from ..verification import (
    AssessmentVerdict,
    create_text_snapshot,
    create_verification_job,
    get_job,
    get_snapshot,
    get_truth_state,
    list_assessments_for_job,
    list_jobs_for_claim,
    list_snapshots_by_parent,
    recalculate_truth_state_for_claim,
    record_agent_assessment,
)

router = APIRouter(prefix="/internal", tags=["verification"], include_in_schema=False)


class CreateJobRequest(BaseModel):
    text: str
    source_uri: str | None = None
    author_id: str | None = None
    claim_hash: str | None = None
    domain: str | None = None
    policy_id: str | None = None
    requested_by: str | None = None
    parent_snapshot_id: str | None = None


@router.post("/verification/jobs")
async def create_verification_job_endpoint(payload: CreateJobRequest):
    metadata = {
        "source_uri": payload.source_uri,
        "author_id": payload.author_id,
        "parent_snapshot_id": UUID(payload.parent_snapshot_id) if payload.parent_snapshot_id else None,
    }
    snapshot = create_text_snapshot(payload.text, metadata)
    job = create_verification_job(
        snapshot_id=snapshot.id,
        requested_by=payload.requested_by,
        policy_id=UUID(payload.policy_id) if payload.policy_id else None,
        domain=payload.domain,
        claim_hash=payload.claim_hash,
    )
    truth_state = recalculate_truth_state_for_claim(job.claim_hash) if job.claim_hash else None
    return {"job": job, "snapshot": snapshot, "truth_state": truth_state}


@router.get("/verification/jobs/{job_id}")
async def get_verification_job(job_id: UUID):
    job = get_job(job_id)
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    snapshot = get_snapshot(job.snapshot_id)
    assessments = list_assessments_for_job(job_id)
    truth_state = get_truth_state(job.claim_hash) if job.claim_hash else None
    return {"job": job, "snapshot": snapshot, "assessments": assessments, "truth_state": truth_state}


@router.get("/truth/{claim_hash}")
async def get_truth_state_endpoint(claim_hash: str):
    truth_state = get_truth_state(claim_hash)
    if not truth_state:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="TruthState not found")
    return truth_state


@router.get("/provenance/{snapshot_id}")
async def get_provenance(snapshot_id: UUID):
    snapshot = get_snapshot(snapshot_id)
    if not snapshot:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Snapshot not found")
    parent_snapshot = get_snapshot(snapshot.parent_snapshot_id) if snapshot.parent_snapshot_id else None
    derived_snapshots = list_snapshots_by_parent(snapshot_id)
    related_jobs = [job for job in list_jobs_for_claim(snapshot.ps_sha_infinity) if job.snapshot_id == snapshot_id]
    truth_state = get_truth_state(snapshot.ps_sha_infinity)
    return {
        "snapshot": snapshot,
        "parent": parent_snapshot,
        "derived": derived_snapshots,
        "related_jobs": related_jobs,
        "truth_state": truth_state,
    }


class AgentAssessmentRequest(BaseModel):
    agent_id: str
    verdict: AssessmentVerdict
    confidence: float
    reasoning: str
    evidence_uris: list[str] | None = None


@router.post("/verification/jobs/{job_id}/assessments")
async def record_assessment(job_id: UUID, payload: AgentAssessmentRequest):
    assessment = record_agent_assessment(
        job_id=job_id,
        agent_id=payload.agent_id,
        verdict=payload.verdict,
        confidence=payload.confidence,
        reasoning=payload.reasoning,
        evidence_uris=payload.evidence_uris,
    )
    truth_state = recalculate_truth_state_for_claim(get_job(job_id).claim_hash) if get_job(job_id).claim_hash else None
    return {"assessment": assessment, "truth_state": truth_state}
