"""
Logging Middleware
Request/response logging and monitoring
"""

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Callable
import time
import logging
import json
from datetime import datetime, UTC

logger = logging.getLogger("roadwork.api")


class LoggingMiddleware(BaseHTTPMiddleware):
    """
    Logs all HTTP requests and responses.
    """

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Generate request ID
        request_id = request.headers.get("X-Request-ID", f"req-{int(time.time() * 1000)}")

        # Start timer
        start_time = time.time()

        # Log request
        logger.info(
            "Request started",
            extra={
                "request_id": request_id,
                "method": request.method,
                "url": str(request.url),
                "client": request.client.host if request.client else None,
                "user_agent": request.headers.get("user-agent"),
            }
        )

        # Process request
        try:
            response = await call_next(request)

            # Calculate duration
            duration_ms = (time.time() - start_time) * 1000

            # Log response
            logger.info(
                "Request completed",
                extra={
                    "request_id": request_id,
                    "method": request.method,
                    "url": str(request.url),
                    "status_code": response.status_code,
                    "duration_ms": round(duration_ms, 2),
                }
            )

            # Add request ID to response headers
            response.headers["X-Request-ID"] = request_id

            return response

        except Exception as e:
            # Calculate duration
            duration_ms = (time.time() - start_time) * 1000

            # Log error
            logger.error(
                "Request failed",
                extra={
                    "request_id": request_id,
                    "method": request.method,
                    "url": str(request.url),
                    "duration_ms": round(duration_ms, 2),
                    "error": str(e),
                    "error_type": type(e).__name__,
                },
                exc_info=True
            )

            # Re-raise
            raise


class MetricsMiddleware(BaseHTTPMiddleware):
    """
    Collects API metrics.
    """

    def __init__(self, app):
        super().__init__(app)
        self.request_count = 0
        self.error_count = 0
        self.total_duration_ms = 0.0

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        start_time = time.time()

        try:
            response = await call_next(request)

            # Update metrics
            self.request_count += 1
            duration_ms = (time.time() - start_time) * 1000
            self.total_duration_ms += duration_ms

            if response.status_code >= 400:
                self.error_count += 1

            return response

        except Exception as e:
            self.request_count += 1
            self.error_count += 1
            duration_ms = (time.time() - start_time) * 1000
            self.total_duration_ms += duration_ms
            raise

    def get_metrics(self):
        """Get current metrics."""
        avg_duration = self.total_duration_ms / self.request_count if self.request_count > 0 else 0
        error_rate = self.error_count / self.request_count if self.request_count > 0 else 0

        return {
            "total_requests": self.request_count,
            "total_errors": self.error_count,
            "error_rate": round(error_rate, 4),
            "avg_response_time_ms": round(avg_duration, 2),
        }
