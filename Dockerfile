FROM python:3.12-slim

WORKDIR /app

# Install system deps
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Copy and install Python package
COPY setup.py .
COPY src/ src/
COPY data/ data/
RUN mkdir -p logs && pip install --no-cache-dir -e .

# Force unbuffered output so Railway shows logs
ENV PYTHONUNBUFFERED=1

# Run orchestrator (Railway sets PORT env var)
CMD ["python3", "src/orchestrator.py"]
