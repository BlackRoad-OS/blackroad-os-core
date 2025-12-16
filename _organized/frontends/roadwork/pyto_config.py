"""
RoadWork Configuration for Pyto (iOS Python IDE)
Lightweight version optimized for mobile execution
"""

import os
from pathlib import Path

# Pyto-specific settings
PYTO_MODE = True
MOBILE_OPTIMIZED = True

# Base paths
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
LOGS_DIR = BASE_DIR / "logs"

# Create directories if they don't exist
DATA_DIR.mkdir(exist_ok=True)
LOGS_DIR.mkdir(exist_ok=True)

# Environment Configuration
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# Database - Use SQLite for Pyto (not PostgreSQL)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{DATA_DIR}/roadwork.db"
)

# Redis - Use in-memory alternative for Pyto
REDIS_URL = None  # Will use Python dict as cache

# API URLs
API_URL = os.getenv("API_URL", "http://localhost:8000")
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://roadwork.blackroad.io")

# API Keys (set these in Pyto settings)
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# Gmail API (optional for Pyto)
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET", "")

# SendGrid (optional for Pyto)
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY", "")
SENDGRID_FROM_EMAIL = os.getenv("SENDGRID_FROM_EMAIL", "noreply@blackroad.io")

# Stripe (optional for Pyto)
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
STRIPE_PUBLISHABLE_KEY = os.getenv("STRIPE_PUBLISHABLE_KEY", "")

# JWT
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "pyto-dev-secret-change-in-production")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Encryption
FERNET_KEY = os.getenv("FERNET_KEY", "")

# Rate Limiting (relaxed for Pyto)
MAX_REQUESTS_PER_MINUTE = 10

# Application Limits (for testing)
FREE_TIER_DAILY_LIMIT = 5
PRO_TIER_DAILY_LIMIT = 20
PREMIUM_TIER_DAILY_LIMIT = 100

# Logging
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_FILE = LOGS_DIR / "roadwork.log"

# Pyto-specific: Disable heavy dependencies
ENABLE_BROWSER_AUTOMATION = False  # Playwright won't work on iOS
ENABLE_CELERY = False  # Celery requires Redis
ENABLE_POSTGRESQL = False  # Use SQLite instead

print(f"🚗 RoadWork Pyto Configuration Loaded")
print(f"📁 Base Directory: {BASE_DIR}")
print(f"📊 Database: {DATABASE_URL}")
print(f"📝 Logs: {LOG_FILE}")
print(f"⚙️  Environment: {ENVIRONMENT}")
