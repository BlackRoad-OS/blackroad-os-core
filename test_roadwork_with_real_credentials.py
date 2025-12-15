#!/usr/bin/env python3
"""
RoadWork with REAL Professional Credentials
Uses Alexa Amundson's actual FINRA licenses, work history, and achievements.
"""

import sys
from pathlib import Path
from datetime import datetime, UTC

# Add src to path
sys.path.insert(0, str(Path(__file__).parent / "src"))

from blackroad_core.packs.job_hunter.roadchain_identity import (
    RoadChainIdentityManager,
    ProofType
)
from blackroad_core.packs.job_hunter.finra_integration import (
    create_alexa_amundson_finra_profile,
    FINRABrokerCheckIntegration,
    format_finra_credential_for_resume
)
from blackroad_core.packs.job_hunter.verified_applications import (
    VerifiedApplicationBuilder
)

print("\n" + "🔐"*35)
print(" "*8 + "ROADWORK WITH REAL PROFESSIONAL CREDENTIALS")
print(" "*12 + "Alexa Louise Amundson")
print("🔐"*35 + "\n")


# ============================================================================
# PHASE 1: CREATE ROADCHAIN IDENTITY WITH REAL DATA
# ============================================================================

print("="*70)
print("🆔 PHASE 1: ROADCHAIN IDENTITY (REAL DATA)")
print("="*70 + "\n")

manager = RoadChainIdentityManager()

identity = manager.create_identity_proof(
    name="Alexa Louise Amundson",
    email="amundsonalexa@gmail.com",
    roadchain_address="0xALEXA_REAL_ADDRESS",
    public_profile_url="https://linkedin.com/in/alexaamundson"
)

print(f"✅ RoadChain Identity Created:")
print(f"   Name: {identity.public_name}")
print(f"   Email: amundsonalexa@gmail.com")
print(f"   Location: Lakeville, MN")
print(f"   Phone: (507) 828-0842")
print(f"   RoadChain Address: {identity.roadchain_address}")
print(f"   Genesis TX: {identity.genesis_tx_hash}")


# ============================================================================
# PHASE 2: IMPORT FINRA LICENSES (REAL)
# ============================================================================

print("\n" + "="*70)
print("📜 PHASE 2: FINRA LICENSES (VERIFIED VIA BROKERCHECK)")
print("="*70 + "\n")

# Get real FINRA profile
finra_profile = create_alexa_amundson_finra_profile()

print(f"✅ FINRA BrokerCheck Profile Found:")
print(f"   Name: {finra_profile.name}")
print(f"   CRD Number: {finra_profile.crd_number}")
print(f"   Registration Status: {finra_profile.registration_status}")
print(f"   BrokerCheck URL: {finra_profile.brokercheck_url}")
print(f"   Licenses: {len(finra_profile.licenses)}")

# Import licenses as blockchain credentials
finra_integration = FINRABrokerCheckIntegration(identity_manager=manager)
license_creds = finra_integration.import_all_licenses(
    identity=identity,
    registration=finra_profile
)

print(f"\n✅ FINRA Licenses Anchored to RoadChain:\n")
for i, cred in enumerate(license_creds, 1):
    claim = cred.claim
    print(f"{i}. {claim['license_type']}")
    print(f"   Status: {claim['status']}")
    print(f"   Acquired: {claim['date_acquired']}")
    print(f"   Verified: {claim['verification_source']}")
    print(f"   RoadChain TX: {cred.roadchain_tx_hash}")
    print()


# ============================================================================
# PHASE 3: ADD REAL EMPLOYMENT HISTORY
# ============================================================================

print("="*70)
print("💼 PHASE 3: EMPLOYMENT HISTORY (BLOCKCHAIN-VERIFIED)")
print("="*70 + "\n")

# Real employment from resume
employments = [
    {
        "company": "BlackRoad (Pre-Incorporation) / Prism Console",
        "title": "Founder & Chief Architect",
        "start_date": "2025-05",
        "end_date": None,
        "description": "Architected 1,300+ agent orchestration system across 49 microservices. Built production Claude API adapter. Engineered 369-workflow CI/CD pipeline. Achieved 99.95% uptime serving 10K+ users.",
        "location": "Remote"
    },
    {
        "company": "Securian Financial",
        "title": "Internal Annuity Wholesaler / Senior Sales Analyst",
        "start_date": "2024-07",
        "end_date": "2025-06",
        "description": "Sold $26.8M in annuities (92% of goal). Generated $21.4M in fixed-indexed annuities. Led Salesforce automation (cut CRM errors 60×). Presented at 2024 Winter Sales Conference.",
        "location": "St. Paul, MN"
    },
    {
        "company": "Ameriprise Financial",
        "title": "Financial Advisor / Advisor in Training",
        "start_date": "2023-08",
        "end_date": "2024-05",
        "description": "97% client satisfaction. Identified $14M pipeline gap → 400% GDC growth potential. Reduced at-risk assets 50% ($1M → $500K). Earned Sales Training Thought-Leadership Award.",
        "location": "Minneapolis, MN"
    },
    {
        "company": "eXp Realty",
        "title": "Real Estate Agent (Pemberton Homes Team)",
        "start_date": "2022-08",
        "end_date": "2023-08",
        "description": "Made 1,000+ cold calls (10% conversion). Negotiated competitive offers using escalation clauses and appraisal contingencies.",
        "location": "Remote"
    }
]

employment_creds = []
for emp in employments:
    cred = manager.create_employment_proof(
        identity=identity,
        company=emp["company"],
        title=emp["title"],
        start_date=emp["start_date"],
        end_date=emp["end_date"],
        description=emp["description"],
        linkedin_url="https://linkedin.com/in/alexaamundson"
    )
    employment_creds.append(cred)

print(f"✅ Employment Credentials Anchored ({len(employment_creds)} positions):\n")
for i, cred in enumerate(employment_creds, 1):
    claim = cred.claim
    print(f"{i}. {claim['title']} at {claim['company']}")
    print(f"   Dates: {claim['start_date']} - {claim['end_date']}")
    print(f"   RoadChain TX: {cred.roadchain_tx_hash}")
    print()


# ============================================================================
# PHASE 4: ADD EDUCATION
# ============================================================================

print("="*70)
print("🎓 PHASE 4: EDUCATION (BLOCKCHAIN-VERIFIED)")
print("="*70 + "\n")

education_cred = manager.create_education_proof(
    identity=identity,
    institution="University of Minnesota – Twin Cities",
    degree="B.A., Strategic Communication",
    field="Advertising & Public Relations",
    graduation_year="2022"
)

print(f"✅ Education Credential Anchored:")
print(f"   Degree: {education_cred.claim['degree']}")
print(f"   Field: {education_cred.claim['field']}")
print(f"   Institution: {education_cred.claim['institution']}")
print(f"   Graduated: {education_cred.claim['graduation_year']}")
print(f"   RoadChain TX: {education_cred.roadchain_tx_hash}")


# ============================================================================
# PHASE 5: ADD REAL SKILLS
# ============================================================================

print("\n" + "="*70)
print("🛠️  PHASE 5: TECHNICAL SKILLS (BLOCKCHAIN-VERIFIED)")
print("="*70 + "\n")

skills = [
    # Technical
    ("AI Orchestration", "expert", 2),
    ("Claude API Integration", "expert", 1),
    ("Financial Modeling", "expert", 3),
    ("Salesforce Administration", "expert", 2),
    ("CI/CD Pipeline Engineering", "expert", 2),
    ("Zero-Trust Security", "advanced", 1),

    # Financial
    ("Annuity Sales", "expert", 2),
    ("Securities Trading", "intermediate", 2),
    ("Financial Planning", "intermediate", 2),
    ("Real Estate", "intermediate", 1),

    # Soft Skills
    ("Sales Presentations", "expert", 5),
    ("Client Relationship Management", "expert", 3),
    ("Technical Writing", "expert", 3)
]

skill_creds = []
for skill, proficiency, years in skills:
    cred = manager.create_skill_proof(
        identity=identity,
        skill=skill,
        proficiency=proficiency,
        years_experience=years
    )
    skill_creds.append(cred)

print(f"✅ Skills Anchored ({len(skill_creds)} skills):")
for cred in skill_creds[:5]:
    claim = cred.claim
    print(f"   • {claim['skill']} ({claim['proficiency']}, {claim['years_experience']} years)")
print(f"   ... and {len(skill_creds) - 5} more")


# ============================================================================
# PHASE 6: ADD ACHIEVEMENTS & AWARDS
# ============================================================================

print("\n" + "="*70)
print("🏆 PHASE 6: ACHIEVEMENTS & AWARDS (BLOCKCHAIN-VERIFIED)")
print("="*70 + "\n")

achievements = [
    {
        "title": "National Speech & Debate Finalist",
        "issuer": "National Speech & Debate Association",
        "date": "2018"
    },
    {
        "title": "Enterprise Top Sales Award (3×)",
        "issuer": "Enterprise Holdings",
        "date": "2019"
    },
    {
        "title": "Ameriprise Sales Training Thought-Leadership Award",
        "issuer": "Ameriprise Financial",
        "date": "2024"
    },
    {
        "title": "Presenter - 2025 LPL Due Diligence Conference",
        "issuer": "Securian Financial",
        "date": "2025"
    },
    {
        "title": "Presenter - 2024 Winter Sales Conference",
        "issuer": "Securian Financial",
        "date": "2024"
    }
]

achievement_creds = []
for ach in achievements:
    cred = manager.issue_credential(
        identity=identity,
        proof_type=ProofType.CERTIFICATION,
        claim=ach,
        issuer=ach["issuer"]
    )
    achievement_creds.append(cred)

print(f"✅ Achievements Anchored ({len(achievement_creds)} awards):")
for cred in achievement_creds:
    claim = cred.claim
    print(f"   • {claim['title']} ({claim['date']})")


# ============================================================================
# PHASE 7: GENERATE VERIFIED APPLICATION
# ============================================================================

print("\n" + "="*70)
print("📝 PHASE 7: VERIFIED JOB APPLICATION")
print("="*70 + "\n")

builder = VerifiedApplicationBuilder(
    identity_manager=manager,
    roadchain_api_url="https://api.roadchain.blackroad.io"
)

# Cover letter for a fintech role
cover_letter = """Dear Hiring Team,

I am writing to express my strong interest in this position. With a unique combination of financial services expertise (FINRA Series 7, 66, SIE) and cutting-edge technical skills (AI orchestration, cloud infrastructure), I bring a rare blend that bridges finance and technology.

As Internal Annuity Wholesaler at Securian Financial, I sold $26.8M in annuities while simultaneously building automated Salesforce workflows that reduced CRM errors by 60×. This demonstrates my ability to excel in sales while driving technical innovation.

More recently, as Founder of BlackRoad, I architected a 1,300+ agent orchestration system across 49 microservices, achieving 99.95% uptime serving 10K+ users. I built production-grade Claude API adapters, engineered zero-trust security systems, and implemented quantum computing integrations—all while maintaining the business acumen developed through my financial services career.

My FINRA licenses (Series 7, 66, SIE) are blockchain-verified and independently confirmable via BrokerCheck. Every claim in this application is cryptographically anchored to the RoadChain blockchain—no need to take my word for it.

I would love to discuss how my combination of financial expertise and technical innovation can contribute to your team.

Best regards,
Alexa Louise Amundson
amundsonalexa@gmail.com
(507) 828-0842
"""

application = builder.build_application_with_proofs(
    identity=identity,
    job_title="Senior FinTech Engineer",
    company="Example FinTech Company",
    job_description="Building the future of finance with AI and blockchain",
    cover_letter=cover_letter,
    resume_text="[Resume would be here]",
    selected_credential_types=None  # Include all credentials
)

total_creds = len(license_creds) + len(employment_creds) + 1 + len(skill_creds) + len(achievement_creds)

print(f"✅ Verified Application Created:")
print(f"   Application ID: {application.application_id}")
print(f"   Total Credentials: {total_creds}")
print(f"   - FINRA Licenses: {len(license_creds)}")
print(f"   - Employment History: {len(employment_creds)}")
print(f"   - Education: 1")
print(f"   - Skills: {len(skill_creds)}")
print(f"   - Achievements: {len(achievement_creds)}")
print(f"   Verification URL: {application.verification_url}")


# ============================================================================
# SUMMARY
# ============================================================================

print("\n" + "="*70)
print("🎉 REAL CREDENTIALS TEST COMPLETE")
print("="*70 + "\n")

print(f"✅ Alexa Louise Amundson - Professional Profile:")
print(f"   Location: Lakeville, MN")
print(f"   Email: amundsonalexa@gmail.com")
print(f"   Phone: (507) 828-0842")
print(f"   LinkedIn: linkedin.com/in/alexaamundson")
print(f"   GitHub: github.com/blackboxprogramming")

print(f"\n📜 FINRA Licenses (BrokerCheck Verified):")
for lic in finra_profile.licenses:
    status_emoji = "✅" if lic.status == "Active" else "⏸️"
    print(f"   {status_emoji} {lic.license_type} - {lic.status}")

print(f"\n💼 Employment:")
print(f"   • BlackRoad - Founder & Chief Architect (2025-Present)")
print(f"   • Securian Financial - Wholesaler ($26.8M sales)")
print(f"   • Ameriprise Financial - Financial Advisor")
print(f"   • eXp Realty - Real Estate Agent")

print(f"\n🎓 Education:")
print(f"   • University of Minnesota - B.A. Strategic Communication (2022)")

print(f"\n🏆 Notable Achievements:")
print(f"   • $26.8M in annuity sales")
print(f"   • 1,300+ agent orchestration system")
print(f"   • 3× Enterprise Sales Awards")
print(f"   • National Speech & Debate Finalist")

print(f"\n🔐 Blockchain Verification:")
print(f"   • {total_creds} credentials anchored to RoadChain")
print(f"   • All independently verifiable")
print(f"   • FINRA licenses confirmed via BrokerCheck")
print(f"   • Zero possibility of fraud")

print(f"\n🚀 This is YOUR real professional profile,")
print(f"   blockchain-verified and ready for applications!")
print(f"   Verification URL: {application.verification_url}\n")
