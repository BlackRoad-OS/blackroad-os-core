#!/bin/bash

# BlackRoad Model Download Script
# Downloads all base models for forking and fine-tuning
#
# Requirements:
# - huggingface-cli installed (pip install huggingface_hub)
# - Hugging Face account with access tokens
# - ~500GB free disk space
#
# Usage: ./scripts/download-all-models.sh

set -e

# Colors for output
RED='\033[0#31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
MODELS_DIR="${MODELS_DIR:-/data/blackroad-models}"
HF_TOKEN="${HF_TOKEN:-}"

echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  BlackRoad Model Download Script${NC}"
echo -e "${GREEN}  Downloading base models for forking${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""

# Check prerequisites
if ! command -v huggingface-cli &> /dev/null; then
    echo -e "${RED}Error: huggingface-cli not found${NC}"
    echo "Install with: pip install huggingface_hub"
    exit 1
fi

if [ -z "$HF_TOKEN" ]; then
    echo -e "${YELLOW}Warning: HF_TOKEN not set${NC}"
    echo "Some models may require authentication."
    echo "Set HF_TOKEN environment variable or run: huggingface-cli login"
    echo ""
fi

# Create models directory
mkdir -p "$MODELS_DIR"
cd "$MODELS_DIR"

echo -e "${GREEN}Models will be downloaded to: $MODELS_DIR${NC}"
echo ""

# Function to download model
download_model() {
    local model_name="$1"
    local model_path="$2"
    local size="$3"

    echo -e "${YELLOW}========================================${NC}"
    echo -e "${YELLOW}Downloading: $model_name${NC}"
    echo -e "${YELLOW}Size: ~$size${NC}"
    echo -e "${YELLOW}========================================${NC}"

    if [ -d "$model_path" ]; then
        echo -e "${GREEN}✓ Model already exists: $model_path${NC}"
        echo -e "${YELLOW}Skipping download. Delete directory to re-download.${NC}"
        echo ""
        return 0
    fi

    huggingface-cli download "$model_name" --local-dir "$model_path" ${HF_TOKEN:+--token "$HF_TOKEN"}

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Download complete: $model_name${NC}"
        echo ""
    else
        echo -e "${RED}✗ Download failed: $model_name${NC}"
        echo ""
        return 1
    fi
}

# Download Qwen 2.5 72B Instruct (PRIMARY)
download_model \
    "Qwen/Qwen2.5-72B-Instruct" \
    "qwen-2.5-72b-instruct" \
    "145GB"

# Download Qwen 2.5 Coder 32B
download_model \
    "Qwen/Qwen2.5-Coder-32B-Instruct" \
    "qwen-2.5-coder-32b-instruct" \
    "65GB"

# Download Qwen 2.5 Math 72B
download_model \
    "Qwen/Qwen2.5-Math-72B-Instruct" \
    "qwen-2.5-math-72b-instruct" \
    "145GB"

# Download Llama 3.3 70B Instruct (SECONDARY)
echo -e "${YELLOW}Note: Llama 3.3 requires Meta account and acceptance of license${NC}"
echo -e "${YELLOW}Visit: https://huggingface.co/meta-llama/Llama-3.3-70B-Instruct${NC}"
echo ""
download_model \
    "meta-llama/Llama-3.3-70B-Instruct" \
    "llama-3.3-70b-instruct" \
    "141GB"

# Download Llama 3.3 8B Instruct (EDGE)
download_model \
    "meta-llama/Llama-3.3-8B-Instruct" \
    "llama-3.3-8b-instruct" \
    "16GB"

# Download Mistral Small 3 24B (EDGE)
download_model \
    "mistralai/Mistral-Small-3-24B-Instruct" \
    "mistral-small-3-24b-instruct" \
    "48GB"

# Download DeepSeek R1 Qwen 32B (REASONING)
download_model \
    "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B" \
    "deepseek-r1-distill-qwen-32b" \
    "65GB"

# Download Grok 2 (RESEARCH - LARGE)
echo -e "${YELLOW}Warning: Grok 2 is very large (~500GB)${NC}"
echo -e "${YELLOW}Skip this download if you don't need it${NC}"
read -p "Download Grok 2? (y/N) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    download_model \
        "xai-org/grok-2" \
        "grok-2" \
        "500GB"
else
    echo -e "${YELLOW}Skipping Grok 2 download${NC}"
    echo ""
fi

# Summary
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}  Download Summary${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "Models directory: $MODELS_DIR"
echo ""
echo "Downloaded models:"
ls -lh "$MODELS_DIR" | grep "^d" | awk '{print "  - " $9 " (" $5 ")"}'
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "  1. Verify model checksums against official releases"
echo "  2. Create BlackRoad training corpus"
echo "  3. Run fine-tuning with LLaMA-Factory"
echo "  4. Deploy to Railway/Cloudflare"
echo ""
echo -e "${GREEN}✓ All downloads complete!${NC}"
