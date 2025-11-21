"""FastAPI entrypoint for BlackRoad OS Core."""
from __future__ import annotations

import logging
from typing import Any

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from . import cache, db
from .config import configure_logging, settings
from .routes import health as health_route
from .routes import version as version_route

configure_logging()
logger = logging.getLogger("app")

app = FastAPI(title="BlackRoad OS Core", version=settings.app_version)


@app.on_event("startup")
async def startup_event() -> None:
    logger.info(
        "Starting BlackRoad OS Core",
        extra={
            "environment": settings.environment,
            "port": settings.port,
            "public_base_url": settings.public_base_url,
        },
    )
    await db.connect()
    await cache.connect()


@app.on_event("shutdown")
async def shutdown_event() -> None:
    await db.disconnect()
    await cache.disconnect()
    logger.info("Application shutdown complete.")


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled application error: %s", exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )


@app.get("/")
async def root() -> dict[str, Any]:
    return {"message": "BlackRoad OS Core API"}


app.include_router(health_route.router)
app.include_router(version_route.router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=settings.environment == "development",
    )
