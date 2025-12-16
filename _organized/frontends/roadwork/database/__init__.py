"""
Database Package
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager
import os

from .models import Base, User, UserProfile, JobPosting, JobApplication, Interview

# Database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://localhost/roadwork")

# Create engine
engine = create_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=40,
    pool_pre_ping=True,
    pool_recycle=3600
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@contextmanager
def get_db() -> Session:
    """
    Get database session context manager.

    Usage:
        with get_db() as db:
            user = db.query(User).first()
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def init_db():
    """Initialize database - create all tables."""
    Base.metadata.create_all(bind=engine)


def drop_db():
    """Drop all tables (DANGEROUS - use only in development)."""
    Base.metadata.drop_all(bind=engine)
