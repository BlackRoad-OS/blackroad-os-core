"""Redis cache helpers."""
from __future__ import annotations

import asyncio
import logging
from typing import Optional

from redis import asyncio as aioredis

from .config import settings

logger = logging.getLogger(__name__)

_client: Optional[aioredis.Redis] = None


async def connect() -> None:
    """Initialize Redis client if REDIS_URL is configured."""
    global _client

    if not settings.redis_url:
        logger.info("REDIS_URL not provided; skipping Redis initialization.")
        return

    try:
        _client = aioredis.from_url(settings.redis_url)
        await _client.ping()
        logger.info("Connected to Redis cache.")
    except Exception:
        logger.exception("Failed to connect to Redis cache.")
        _client = None


async def disconnect() -> None:
    global _client

    if _client is not None:
        await _client.close()
        logger.info("Redis client closed.")
        _client = None


async def check_health(timeout_seconds: float = 1.0) -> Optional[bool]:
    if not settings.redis_url:
        return None

    if _client is None:
        try:
            client = aioredis.from_url(settings.redis_url)
            await asyncio.wait_for(client.ping(), timeout=timeout_seconds)
            await client.close()
            return True
        except Exception:
            return False

    try:
        await asyncio.wait_for(_client.ping(), timeout=timeout_seconds)
        return True
    except Exception:
        return False
