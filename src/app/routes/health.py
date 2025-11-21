"""Health check endpoint."""
from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from .. import cache, db

router = APIRouter(tags=["meta"])


@router.get("/health")
async def health() -> JSONResponse:
    db_status = await db.check_health()
    cache_status = await cache.check_health()

    payload = {
        "status": "ok",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    healthy = True

    if db_status is not None:
        payload["db"] = "ok" if db_status else "error"
        healthy = healthy and db_status

    if cache_status is not None:
        payload["cache"] = "ok" if cache_status else "error"
        healthy = healthy and cache_status

    if not healthy:
        payload["status"] = "error"
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content=payload,
        )

    return JSONResponse(status_code=status.HTTP_200_OK, content=payload)
