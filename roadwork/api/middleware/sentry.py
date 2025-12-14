"""
Sentry Integration
Error tracking and performance monitoring
"""

import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration
from sentry_sdk.integrations.sqlalchemy import SqlalchemyIntegration
from sentry_sdk.integrations.redis import RedisIntegration
import os


def init_sentry():
    """Initialize Sentry error tracking."""
    sentry_dsn = os.getenv("SENTRY_DSN")

    if not sentry_dsn:
        print("SENTRY_DSN not set, skipping Sentry initialization")
        return

    environment = os.getenv("ENVIRONMENT", "development")

    sentry_sdk.init(
        dsn=sentry_dsn,
        environment=environment,
        traces_sample_rate=0.1 if environment == "production" else 1.0,
        profiles_sample_rate=0.1 if environment == "production" else 1.0,
        integrations=[
            FastApiIntegration(transaction_style="endpoint"),
            SqlalchemyIntegration(),
            RedisIntegration(),
        ],
        # Send PII (personally identifiable information)
        send_default_pii=False,
        # Breadcrumbs
        max_breadcrumbs=50,
        # Release tracking
        release=os.getenv("RAILWAY_DEPLOYMENT_ID", "unknown"),
        # Performance monitoring
        enable_tracing=True,
    )

    print(f"Sentry initialized for environment: {environment}")


def capture_exception(exception: Exception, context: dict = None):
    """
    Manually capture an exception in Sentry.

    Args:
        exception: Exception to capture
        context: Additional context data
    """
    with sentry_sdk.push_scope() as scope:
        if context:
            for key, value in context.items():
                scope.set_context(key, value)

        sentry_sdk.capture_exception(exception)


def capture_message(message: str, level: str = "info", context: dict = None):
    """
    Capture a message in Sentry.

    Args:
        message: Message to capture
        level: Severity level (debug, info, warning, error, fatal)
        context: Additional context data
    """
    with sentry_sdk.push_scope() as scope:
        if context:
            for key, value in context.items():
                scope.set_context(key, value)

        sentry_sdk.capture_message(message, level=level)


def set_user(user_id: str, email: str = None, username: str = None):
    """
    Set user context for Sentry.

    Args:
        user_id: User ID
        email: User email
        username: Username
    """
    sentry_sdk.set_user({
        "id": user_id,
        "email": email,
        "username": username,
    })
