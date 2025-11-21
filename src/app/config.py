"""Application configuration using environment variables."""
from __future__ import annotations

import logging
import os
from importlib.metadata import PackageNotFoundError, version
from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


def _default_version() -> str:
    try:
        return version("blackroad-os-core")
    except PackageNotFoundError:
        return os.getenv("APP_VERSION", "0.1.0")


class Settings(BaseSettings):
    """Central application settings loaded from environment variables."""

    environment: str = Field(default="development", alias="NODE_ENV")
    database_url: Optional[str] = Field(default=None, alias="DATABASE_URL")
    redis_url: Optional[str] = Field(default=None, alias="REDIS_URL")
    public_base_url: Optional[str] = Field(default=None, alias="PUBLIC_BASE_URL")
    port: int = Field(default=8000, alias="PORT")

    git_commit: Optional[str] = Field(default=None, alias="GIT_COMMIT")
    build_time: Optional[str] = Field(default=None, alias="BUILD_TIME")
    app_version: str = Field(default_factory=_default_version, alias="APP_VERSION")

    log_level: str = Field(default="INFO", alias="LOG_LEVEL")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


settings = Settings()


def configure_logging(level: Optional[str | int] = None) -> None:
    """Configure application logging with a concise format."""

    resolved_level: int | str = level or settings.log_level
    logging.basicConfig(
        level=resolved_level,
        format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
    )


__all__ = ["settings", "configure_logging"]
