from __future__ import annotations

import sys
from pathlib import Path
import unittest

# Ensure the src directory is importable when running tests directly
sys.path.append(str(Path(__file__).resolve().parents[1] / "src"))

from app.verification.models import AssessmentVerdict, TruthStatus
from app.verification.service import (
    create_text_snapshot,
    create_verification_job,
    create_verification_policy,
    get_default_policy,
    get_verification_policy,
    recalculate_truth_state_for_claim,
    record_agent_assessment,
    reset_state,
)


class VerificationServiceTests(unittest.TestCase):
    def setUp(self) -> None:
        reset_state()

    def test_create_text_snapshot_computes_fingerprint(self) -> None:
        snapshot = create_text_snapshot("hello world", {"source_uri": "https://example.com"})
        self.assertTrue(snapshot.ps_sha_infinity)
        self.assertEqual(snapshot.content, "hello world")

    def test_create_policy_and_fetch(self) -> None:
        policy = create_verification_policy("Finance Default", "finance", set_as_default=True)
        fetched = get_verification_policy(policy.id)
        self.assertEqual(policy.id, fetched.id)
        self.assertEqual(get_default_policy("finance").id, policy.id)

    def test_create_job_with_explicit_policy(self) -> None:
        snapshot = create_text_snapshot("alpha", {})
        policy = create_verification_policy("Explicit", "science")
        job = create_verification_job(snapshot.id, requested_by="tester", policy_id=policy.id)
        self.assertEqual(job.policy_id, policy.id)
        self.assertEqual(job.policy_domain, policy.domain)

    def test_create_job_with_domain_default(self) -> None:
        snapshot = create_text_snapshot("beta", {})
        job = create_verification_job(snapshot.id, requested_by="tester", domain="markets")
        self.assertEqual(job.policy_domain, "markets")
        default_policy = get_default_policy("markets")
        self.assertEqual(job.policy_id, default_policy.id)

    def test_record_assessment_computes_hash(self) -> None:
        snapshot = create_text_snapshot("gamma", {})
        job = create_verification_job(snapshot.id, requested_by="tester", domain="news")
        assessment = record_agent_assessment(
            job.id,
            agent_id="agent-1",
            verdict=AssessmentVerdict.CONFIRMED,
            confidence=0.9,
            reasoning="looks good",
            evidence_uris=["https://evidence"],
        )
        self.assertTrue(assessment.assessment_hash)

    def test_truth_state_confirmed_majority(self) -> None:
        snapshot = create_text_snapshot("claim text", {})
        create_verification_policy(
            "Science Default",
            "science",
            min_agent_count=3,
            min_confirmed_confidence=0.6,
            max_refuted_fraction=0.34,
            set_as_default=True,
        )
        job = create_verification_job(snapshot.id, requested_by="tester", domain="science")
        record_agent_assessment(job.id, "agent-a", AssessmentVerdict.CONFIRMED, 0.9, "solid", [])
        record_agent_assessment(job.id, "agent-b", AssessmentVerdict.CONFIRMED, 0.8, "ok", [])
        refuting = record_agent_assessment(job.id, "agent-c", AssessmentVerdict.REFUTED, 0.2, "no", [])
        truth_state = recalculate_truth_state_for_claim(job.claim_hash)

        self.assertEqual(truth_state.status, TruthStatus.CONFIRMED)
        self.assertAlmostEqual(truth_state.aggregate_confidence, 0.85, places=2)
        self.assertIn(refuting.id, truth_state.minority_reports)

    def test_truth_state_refuted_when_fraction_high(self) -> None:
        snapshot = create_text_snapshot("claim text", {})
        create_verification_policy(
            "News Default",
            "news",
            min_agent_count=3,
            max_refuted_fraction=0.2,
            set_as_default=True,
        )
        job = create_verification_job(snapshot.id, requested_by="tester", domain="news")
        record_agent_assessment(job.id, "agent-a", AssessmentVerdict.REFUTED, 0.8, "wrong", [])
        record_agent_assessment(job.id, "agent-b", AssessmentVerdict.REFUTED, 0.7, "still wrong", [])
        record_agent_assessment(job.id, "agent-c", AssessmentVerdict.CONFIRMED, 0.9, "maybe", [])
        truth_state = recalculate_truth_state_for_claim(job.claim_hash)

        self.assertEqual(truth_state.status, TruthStatus.REFUTED)

    def test_truth_state_uncertain_when_insufficient_agents(self) -> None:
        snapshot = create_text_snapshot("claim text", {})
        create_verification_policy("Finance Strict", "finance", min_agent_count=5, set_as_default=True)
        job = create_verification_job(snapshot.id, requested_by="tester", domain="finance")
        record_agent_assessment(job.id, "agent-a", AssessmentVerdict.CONFIRMED, 0.9, "ok", [])
        truth_state = recalculate_truth_state_for_claim(job.claim_hash)

        self.assertEqual(truth_state.status, TruthStatus.UNCERTAIN)


if __name__ == "__main__":
    unittest.main()
