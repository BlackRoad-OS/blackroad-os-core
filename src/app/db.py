"""Database utilities using asyncpg."""
from __future__ import annotations

import asyncio
import logging
from typing import Optional

import asyncpg

from .config import settings

logger = logging.getLogger(__name__)

_pool: Optional[asyncpg.Pool] = None


async def connect() -> None:
    """Initialize the asyncpg pool if a database URL is provided."""
    global _pool

    if not settings.database_url:
        logger.info("DATABASE_URL not provided; skipping database initialization.")
        return

    try:
        _pool = await asyncpg.create_pool(dsn=settings.database_url)
        logger.info("Database connection pool established.")
    except Exception:
        logger.exception("Failed to establish database connection pool.")
        _pool = None


async def disconnect() -> None:
    """Close the database pool if it exists."""
    global _pool

    if _pool is not None:
        await _pool.close()
        logger.info("Database connection pool closed.")
        _pool = None


async def check_health(timeout_seconds: float = 2.0) -> Optional[bool]:
    """Perform a lightweight database health check.

    Returns True if the DB responds, False if an error occurs, or None if no DB is configured.
    """
    if not settings.database_url:
        return None

    if _pool is None:
        # Attempt a one-off connection if the pool was not created.
        try:
            conn = await asyncpg.connect(dsn=settings.database_url, timeout=timeout_seconds)
            await conn.close()
            return True
        except Exception:
            return False

    try:
        await asyncio.wait_for(_pool.execute("SELECT 1"), timeout=timeout_seconds)
        return True
    except Exception:
        return False
