"""Version metadata endpoint."""
from __future__ import annotations

from fastapi import APIRouter

from ..config import settings

router = APIRouter(tags=["meta"])


@router.get("/version")
def version() -> dict:
    return {
        "appVersion": settings.app_version,
        "commit": settings.git_commit,
        "buildTime": settings.build_time,
        "environment": settings.environment,
    }
