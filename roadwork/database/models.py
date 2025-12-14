"""
Database Models
SQLAlchemy ORM models for RoadWork
"""

from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime, Text, JSON,
    ForeignKey, Enum as SQLEnum, Index
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime, UTC
from enum import Enum
import uuid

Base = declarative_base()


def generate_id():
    return str(uuid.uuid4())


# ============================================================================
# Enums
# ============================================================================

class SubscriptionTier(str, Enum):
    FREE = "free"
    PRO = "pro"
    PREMIUM = "premium"


class ApplicationStatus(str, Enum):
    DRAFT = "draft"
    PENDING_REVIEW = "pending_review"
    APPROVED = "approved"
    SUBMITTED = "submitted"
    VIEWED = "viewed"
    REJECTED = "rejected"
    INTERVIEW = "interview"
    OFFER = "offer"


class OnboardingStep(str, Enum):
    WELCOME = "welcome"
    NAME_PRONUNCIATION = "name_pronunciation"
    UPLOAD_WORK_HISTORY = "upload_work_history"
    PARSE_DOCUMENT = "parse_document"
    TINDER_SWIPE = "tinder_swipe"
    CONFIRM_CATEGORIES = "confirm_categories"
    GENERATE_RESUMES = "generate_resumes"
    STANDARD_QUESTIONS = "standard_questions"
    COMPLETE = "complete"


class EngagementEvent(str, Enum):
    APPLICATION_SUBMITTED = "application_submitted"
    APPLICATION_VIEWED = "application_viewed"
    PROFILE_VIEWED = "profile_viewed"
    APPLICATION_DOWNLOADED = "application_downloaded"
    RESPONSE_RECEIVED = "response_received"
    INTERVIEW_REQUEST = "interview_request"


# ============================================================================
# User Models
# ============================================================================

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_id)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    name_pronunciation = Column(String)

    # Subscription
    subscription_tier = Column(SQLEnum(SubscriptionTier), default=SubscriptionTier.FREE)
    subscription_status = Column(String, default="active")
    subscription_started_at = Column(DateTime(timezone=True))
    subscription_billing_cycle_start = Column(DateTime(timezone=True))
    subscription_billing_cycle_end = Column(DateTime(timezone=True))

    # Settings
    email_notifications = Column(Boolean, default=True)
    daily_summary_enabled = Column(Boolean, default=True)
    daily_summary_time = Column(String, default="18:00")
    timezone = Column(String, default="UTC")
    auto_apply = Column(Boolean, default=False)
    max_applications_per_day = Column(Integer, default=10)

    # Usage tracking
    applications_today = Column(Integer, default=0)
    applications_this_month = Column(Integer, default=0)
    last_application_date = Column(DateTime(timezone=True))

    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))
    last_login = Column(DateTime(timezone=True))

    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False)
    applications = relationship("JobApplication", back_populates="user")
    searches = relationship("JobSearch", back_populates="user")


class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(String, primary_key=True, default=generate_id)
    user_id = Column(String, ForeignKey("users.id"), unique=True, nullable=False)

    # Onboarding
    onboarding_step = Column(SQLEnum(OnboardingStep), default=OnboardingStep.WELCOME)
    onboarding_completed = Column(Boolean, default=False)
    onboarding_completed_at = Column(DateTime(timezone=True))

    # Work history
    raw_work_history = Column(Text)  # Original uploaded document text
    parsed_jobs = Column(JSON)  # List of parsed job experiences
    parsed_education = Column(JSON)  # List of education entries
    parsed_skills = Column(JSON)  # List of skills
    parsed_certifications = Column(JSON)  # List of certifications

    # Job preferences
    preferred_keywords = Column(JSON)  # List of keywords
    preferred_locations = Column(JSON)  # List of locations
    preferred_platforms = Column(JSON)  # List of platforms
    preferred_job_categories = Column(JSON)  # List of categories from swipes
    remote_only = Column(Boolean, default=False)
    min_salary = Column(Integer)

    # Standard questions
    phone_number = Column(String)
    linkedin_url = Column(String)
    github_url = Column(String)
    portfolio_url = Column(String)
    years_of_experience = Column(Integer)
    willing_to_relocate = Column(Boolean, default=False)
    requires_sponsorship = Column(Boolean, default=False)

    # Cover letter templates
    cover_letter_templates = Column(JSON)  # Dict of category -> template

    # Generated resumes
    resumes = Column(JSON)  # List of resume metadata

    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))

    # Relationships
    user = relationship("User", back_populates="profile")
    swipes = relationship("JobSwipe", back_populates="profile")


# ============================================================================
# Job Models
# ============================================================================

class JobPosting(Base):
    __tablename__ = "job_postings"

    id = Column(String, primary_key=True, default=generate_id)

    # Job details
    title = Column(String, nullable=False, index=True)
    company = Column(String, nullable=False, index=True)
    location = Column(String)
    description = Column(Text)
    requirements = Column(JSON)  # List of requirements
    benefits = Column(JSON)  # List of benefits
    salary_min = Column(Integer)
    salary_max = Column(Integer)
    salary_currency = Column(String, default="USD")

    # Platform info
    platform = Column(String, nullable=False, index=True)
    platform_job_id = Column(String, index=True)
    job_url = Column(String, nullable=False)
    easy_apply = Column(Boolean, default=False)

    # Metadata
    posted_date = Column(DateTime(timezone=True))
    expires_date = Column(DateTime(timezone=True))
    is_remote = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)
    verification_confidence = Column(Float)

    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))

    # Relationships
    applications = relationship("JobApplication", back_populates="job")

    # Indexes
    __table_args__ = (
        Index('idx_platform_job_id', 'platform', 'platform_job_id'),
        Index('idx_posted_date', 'posted_date'),
    )


class JobSwipe(Base):
    __tablename__ = "job_swipes"

    id = Column(String, primary_key=True, default=generate_id)
    profile_id = Column(String, ForeignKey("user_profiles.id"), nullable=False)

    # Swipe data
    job_title = Column(String, nullable=False)
    job_category = Column(String)
    interest_level = Column(String, nullable=False)  # like, dislike, love

    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))

    # Relationships
    profile = relationship("UserProfile", back_populates="swipes")


# ============================================================================
# Application Models
# ============================================================================

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(String, primary_key=True, default=generate_id)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    job_id = Column(String, ForeignKey("job_postings.id"), nullable=False)

    # Application content
    cover_letter = Column(Text)
    resume_text = Column(Text)
    resume_url = Column(String)  # URL to PDF resume
    custom_answers = Column(JSON)  # Dict of question -> answer

    # Status
    status = Column(SQLEnum(ApplicationStatus), default=ApplicationStatus.DRAFT, index=True)
    match_score = Column(Float)  # 0.0 - 1.0

    # Submission
    submitted_at = Column(DateTime(timezone=True))
    submitted_via = Column(String)  # company_website, platform, etc.

    # Tracking
    was_viewed = Column(Boolean, default=False)
    view_count = Column(Integer, default=0)
    profile_views = Column(Integer, default=0)
    application_downloads = Column(Integer, default=0)
    first_viewed_at = Column(DateTime(timezone=True))
    last_viewed_at = Column(DateTime(timezone=True))

    # Success metrics
    success_score = Column(Float, default=0.0)
    response_received = Column(Boolean, default=False)
    interview_scheduled = Column(Boolean, default=False)
    offer_received = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))

    # Relationships
    user = relationship("User", back_populates="applications")
    job = relationship("JobPosting", back_populates="applications")
    events = relationship("EngagementEventLog", back_populates="application")
    interview = relationship("Interview", back_populates="application", uselist=False)

    # Indexes
    __table_args__ = (
        Index('idx_user_status', 'user_id', 'status'),
        Index('idx_submitted_at', 'submitted_at'),
    )


class EngagementEventLog(Base):
    __tablename__ = "engagement_events"

    id = Column(String, primary_key=True, default=generate_id)
    application_id = Column(String, ForeignKey("job_applications.id"), nullable=False)

    # Event details
    event_type = Column(SQLEnum(EngagementEvent), nullable=False, index=True)
    metadata = Column(JSON)  # Additional event data

    # Tracking
    user_agent = Column(String)
    ip_address = Column(String)
    referrer = Column(String)

    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC), index=True)

    # Relationships
    application = relationship("JobApplication", back_populates="events")

    # Indexes
    __table_args__ = (
        Index('idx_application_event', 'application_id', 'event_type'),
    )


# ============================================================================
# Interview Models
# ============================================================================

class Interview(Base):
    __tablename__ = "interviews"

    id = Column(String, primary_key=True, default=generate_id)
    application_id = Column(String, ForeignKey("job_applications.id"), unique=True, nullable=False)

    # Interview details
    company = Column(String, nullable=False)
    job_title = Column(String, nullable=False)
    interview_type = Column(String)  # phone, video, in-person
    proposed_times = Column(JSON)  # List of proposed time slots
    scheduled_at = Column(DateTime(timezone=True))
    duration_minutes = Column(Integer, default=60)

    # Calendar
    calendar_event_id = Column(String)
    calendar_provider = Column(String)  # google, outlook, etc.

    # Communication
    employer_email = Column(String)
    meeting_link = Column(String)
    meeting_location = Column(String)
    notes = Column(Text)

    # Status
    status = Column(String, default="pending")  # pending, confirmed, completed, cancelled
    reminder_sent = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC), onupdate=lambda: datetime.now(UTC))

    # Relationships
    application = relationship("JobApplication", back_populates="interview")


# ============================================================================
# Search Models
# ============================================================================

class JobSearch(Base):
    __tablename__ = "job_searches"

    id = Column(String, primary_key=True, default=generate_id)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)

    # Search parameters
    keywords = Column(JSON)  # List of keywords
    locations = Column(JSON)  # List of locations
    platforms = Column(JSON)  # List of platforms
    filters = Column(JSON)  # Dict of filters

    # Results
    jobs_found = Column(Integer, default=0)
    platforms_searched = Column(Integer, default=0)
    search_results = Column(JSON)  # List of job IDs

    # Timestamps
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC), index=True)

    # Relationships
    user = relationship("User", back_populates="searches")
