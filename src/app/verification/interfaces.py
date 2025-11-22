"""Integration interfaces for verification dependencies."""
from __future__ import annotations

import hashlib
import json
import logging
from typing import Protocol

logger = logging.getLogger(__name__)


class PsShaInfinityHasher(Protocol):
    """Interface for PS-SHA∞ hashing."""

    def hash_text(self, content: str, metadata: dict) -> str:  # pragma: no cover - interface
        ...

    def hash_structured(self, payload: dict) -> str:  # pragma: no cover - interface
        ...


class SimplePsShaInfinityHasher:
    """Placeholder hasher using SHA-256 until PS-SHA∞ is available."""

    def hash_text(self, content: str, metadata: dict) -> str:
        payload = {"content": content, **metadata}
        return self.hash_structured(payload)

    def hash_structured(self, payload: dict) -> str:
        serialized = json.dumps(payload, sort_keys=True, separators=(",", ":"))
        return hashlib.sha256(serialized.encode()).hexdigest()


class RoadChainClient(Protocol):
    """Interface for appending entries to RoadChain."""

    def append(self, entry_type: str, payload: dict) -> str:  # pragma: no cover - interface
        ...


class InMemoryRoadChainClient:
    """In-memory RoadChain client for testing and local development."""

    def __init__(self) -> None:
        self.entries: list[dict] = []

    def append(self, entry_type: str, payload: dict) -> str:
        tx_id = hashlib.sha256(f"{entry_type}-{len(self.entries)}".encode()).hexdigest()
        entry = {"type": entry_type, "payload": payload, "tx_id": tx_id}
        self.entries.append(entry)
        logger.debug("Appended RoadChain entry", extra=entry)
        return tx_id


class EventPublisher(Protocol):
    """Minimal domain event publisher interface."""

    def publish(self, event_type: str, payload: dict) -> None:  # pragma: no cover - interface
        ...


class LoggingEventPublisher:
    """Event publisher that logs events for observability."""

    def publish(self, event_type: str, payload: dict) -> None:
        logger.info("Event published", extra={"event_type": event_type, "payload": payload})
