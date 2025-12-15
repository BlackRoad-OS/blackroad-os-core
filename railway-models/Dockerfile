# BlackRoad Model Inference Server
# Optimized for Railway deployment with GPU support

FROM nvidia/cuda:12.1.0-runtime-ubuntu22.04

# Install Python and dependencies
RUN apt-get update && apt-get install -y \
    python3.11 \
    python3-pip \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install vLLM for optimized inference
RUN pip3 install --no-cache-dir \
    vllm==0.6.0 \
    fastapi==0.109.0 \
    uvicorn[standard]==0.27.0 \
    pydantic==2.5.0 \
    huggingface-hub==0.20.0 \
    transformers==4.37.0 \
    torch==2.1.2

# Copy server code
COPY server.py /app/
COPY requirements.txt /app/

# Install additional dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Download model (optional - can also mount from R2)
# ARG MODEL_NAME=blackroad-qwen-72b-v1
# RUN huggingface-cli download blackroad/${MODEL_NAME} --local-dir /models/${MODEL_NAME}

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run server
CMD ["python3", "server.py"]
