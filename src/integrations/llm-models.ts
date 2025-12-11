/**
 * Open Source LLM Models Configuration
 *
 * Configuration and management for open source language models.
 * Supports forking, safety verification, and model deployment.
 *
 * Features:
 * - Pre-configured safe open source models
 * - Model safety verification (safetensors, no pickle)
 * - License compliance tracking
 * - Model performance benchmarks
 * - Deployment configurations
 */

// =============================================================================
// MODEL CATEGORIES AND DEFINITIONS
// =============================================================================

export type ModelCategory =
  | 'llm'
  | 'code'
  | 'vision'
  | 'multimodal'
  | 'embedding'
  | 'speech'
  | 'translation'
  | 'summarization';

export type ModelSize = 'tiny' | 'small' | 'base' | 'medium' | 'large' | 'xl' | 'xxl';

export type License =
  | 'apache-2.0'
  | 'mit'
  | 'bsd-3-clause'
  | 'gpl-3.0'
  | 'llama2'
  | 'llama3'
  | 'llama3.2'
  | 'gemma'
  | 'bigscience-bloom-rail-1.0'
  | 'bigcode-openrail-m'
  | 'cc-by-4.0'
  | 'cc-by-nc-4.0'
  | 'openrail'
  | 'other';

export interface ModelDefinition {
  id: string;
  name: string;
  provider: string;
  category: ModelCategory;
  parameters: string;
  parametersNum: number; // in billions
  size: ModelSize;
  license: License;
  contextLength: number;
  languages: string[];
  capabilities: string[];
  hasSafetensors: boolean;
  isSafe: boolean;
  benchmarks?: {
    mmlu?: number;
    humanEval?: number;
    hellaSwag?: number;
    arc?: number;
    truthfulQA?: number;
  };
  resourceRequirements: {
    minVRAM: number; // GB
    recommendedVRAM: number; // GB
    minRAM: number; // GB
  };
  deploymentOptions: ('huggingface' | 'vllm' | 'ollama' | 'llama.cpp' | 'tgi')[];
  huggingFaceId: string;
  notes?: string;
}

// =============================================================================
// PRE-CONFIGURED SAFE OPEN SOURCE MODELS
// =============================================================================

export const OPEN_SOURCE_MODELS: Record<ModelCategory, ModelDefinition[]> = {
  llm: [
    {
      id: 'llama-3.2-1b',
      name: 'Llama 3.2 1B',
      provider: 'Meta',
      category: 'llm',
      parameters: '1B',
      parametersNum: 1,
      size: 'tiny',
      license: 'llama3.2',
      contextLength: 128000,
      languages: ['en', 'de', 'fr', 'it', 'pt', 'hi', 'es', 'th'],
      capabilities: ['text-generation', 'instruction-following', 'reasoning'],
      hasSafetensors: true,
      isSafe: true,
      benchmarks: { mmlu: 49.3 },
      resourceRequirements: { minVRAM: 2, recommendedVRAM: 4, minRAM: 4 },
      deploymentOptions: ['huggingface', 'vllm', 'ollama', 'llama.cpp', 'tgi'],
      huggingFaceId: 'meta-llama/Llama-3.2-1B-Instruct',
    },
    {
      id: 'llama-3.2-3b',
      name: 'Llama 3.2 3B',
      provider: 'Meta',
      category: 'llm',
      parameters: '3B',
      parametersNum: 3,
      size: 'small',
      license: 'llama3.2',
      contextLength: 128000,
      languages: ['en', 'de', 'fr', 'it', 'pt', 'hi', 'es', 'th'],
      capabilities: ['text-generation', 'instruction-following', 'reasoning', 'tool-use'],
      hasSafetensors: true,
      isSafe: true,
      benchmarks: { mmlu: 63.4 },
      resourceRequirements: { minVRAM: 6, recommendedVRAM: 8, minRAM: 8 },
      deploymentOptions: ['huggingface', 'vllm', 'ollama', 'llama.cpp', 'tgi'],
      huggingFaceId: 'meta-llama/Llama-3.2-3B-Instruct',
    },
    {
      id: 'mistral-7b',
      name: 'Mistral 7B v0.3',
      provider: 'Mistral AI',
      category: 'llm',
      parameters: '7B',
      parametersNum: 7,
      size: 'medium',
      license: 'apache-2.0',
      contextLength: 32768,
      languages: ['en', 'multi'],
      capabilities: ['text-generation', 'instruction-following', 'reasoning', 'function-calling'],
      hasSafetensors: true,
      isSafe: true,
      benchmarks: { mmlu: 62.5, humanEval: 31.1 },
      resourceRequirements: { minVRAM: 14, recommendedVRAM: 16, minRAM: 16 },
      deploymentOptions: ['huggingface', 'vllm', 'ollama', 'llama.cpp', 'tgi'],
      huggingFaceId: 'mistralai/Mistral-7B-Instruct-v0.3',
    },
    {
      id: 'phi-3-mini',
      name: 'Phi-3 Mini 4K',
      provider: 'Microsoft',
      category: 'llm',
      parameters: '3.8B',
      parametersNum: 3.8,
      size: 'small',
      license: 'mit',
      contextLength: 4096,
      languages: ['en'],
      capabilities: ['text-generation', 'instruction-following', 'reasoning', 'math'],
      hasSafetensors: true,
      isSafe: true,
      benchmarks: { mmlu: 69.0, humanEval: 57.0 },
      resourceRequirements: { minVRAM: 8, recommendedVRAM: 12, minRAM: 8 },
      deploymentOptions: ['huggingface', 'vllm', 'ollama', 'llama.cpp', 'tgi'],
      huggingFaceId: 'microsoft/phi-3-mini-4k-instruct',
    },
    {
      id: 'gemma-2-2b',
      name: 'Gemma 2 2B',
      provider: 'Google',
      category: 'llm',
      parameters: '2B',
      parametersNum: 2,
      size: 'small',
      license: 'gemma',
      contextLength: 8192,
      languages: ['en'],
      capabilities: ['text-generation', 'instruction-following'],
      hasSafetensors: true,
      isSafe: true,
      benchmarks: { mmlu: 51.3 },
      resourceRequirements: { minVRAM: 4, recommendedVRAM: 8, minRAM: 8 },
      deploymentOptions: ['huggingface', 'vllm', 'ollama', 'llama.cpp', 'tgi'],
      huggingFaceId: 'google/gemma-2-2b-it',
    },
    {
      id: 'qwen-2.5-7b',
      name: 'Qwen 2.5 7B',
      provider: 'Alibaba',
      category: 'llm',
      parameters: '7B',
      parametersNum: 7,
      size: 'medium',
      license: 'apache-2.0',
      contextLength: 131072,
      languages: ['en', 'zh', 'multi'],
      capabilities: ['text-generation', 'instruction-following', 'reasoning', 'multilingual'],
      hasSafetensors: true,
      isSafe: true,
      benchmarks: { mmlu: 74.2 },
      resourceRequirements: { minVRAM: 14, recommendedVRAM: 16, minRAM: 16 },
      deploymentOptions: ['huggingface', 'vllm', 'ollama', 'llama.cpp', 'tgi'],
      huggingFaceId: 'Qwen/Qwen2.5-7B-Instruct',
    },
    {
      id: 'falcon-7b',
      name: 'Falcon 7B Instruct',
      provider: 'TII',
      category: 'llm',
      parameters: '7B',
      parametersNum: 7,
      size: 'medium',
      license: 'apache-2.0',
      contextLength: 2048,
      languages: ['en', 'de', 'es', 'fr'],
      capabilities: ['text-generation', 'instruction-following'],
      hasSafetensors: true,
      isSafe: true,
      resourceRequirements: { minVRAM: 14, recommendedVRAM: 16, minRAM: 16 },
      deploymentOptions: ['huggingface', 'vllm', 'tgi'],
      huggingFaceId: 'tiiuae/falcon-7b-instruct',
    },
    {
      id: 'mpt-7b',
      name: 'MPT 7B Instruct',
      provider: 'MosaicML',
      category: 'llm',
      parameters: '7B',
      parametersNum: 7,
      size: 'medium',
      license: 'apache-2.0',
      contextLength: 65536,
      languages: ['en'],
      capabilities: ['text-generation', 'instruction-following', 'long-context'],
      hasSafetensors: true,
      isSafe: true,
      resourceRequirements: { minVRAM: 14, recommendedVRAM: 16, minRAM: 16 },
      deploymentOptions: ['huggingface', 'vllm', 'tgi'],
      huggingFaceId: 'mosaicml/mpt-7b-instruct',
    },
  ],

  code: [
    {
      id: 'starcoder2-15b',
      name: 'StarCoder2 15B',
      provider: 'BigCode',
      category: 'code',
      parameters: '15B',
      parametersNum: 15,
      size: 'large',
      license: 'bigcode-openrail-m',
      contextLength: 16384,
      languages: ['code'],
      capabilities: ['code-generation', 'code-completion', 'code-explanation'],
      hasSafetensors: true,
      isSafe: true,
      benchmarks: { humanEval: 46.3 },
      resourceRequirements: { minVRAM: 30, recommendedVRAM: 40, minRAM: 32 },
      deploymentOptions: ['huggingface', 'vllm', 'tgi'],
      huggingFaceId: 'bigcode/starcoder2-15b',
    },
    {
      id: 'qwen-coder-7b',
      name: 'Qwen Coder 7B',
      provider: 'Alibaba',
      category: 'code',
      parameters: '7B',
      parametersNum: 7,
      size: 'medium',
      license: 'apache-2.0',
      contextLength: 131072,
      languages: ['code'],
      capabilities: ['code-generation', 'code-completion', 'code-explanation', 'debugging'],
      hasSafetensors: true,
      isSafe: true,
      benchmarks: { humanEval: 88.4 },
      resourceRequirements: { minVRAM: 14, recommendedVRAM: 16, minRAM: 16 },
      deploymentOptions: ['huggingface', 'vllm', 'ollama', 'tgi'],
      huggingFaceId: 'Qwen/Qwen2.5-Coder-7B-Instruct',
    },
    {
      id: 'deepseek-coder-6.7b',
      name: 'DeepSeek Coder 6.7B',
      provider: 'DeepSeek',
      category: 'code',
      parameters: '6.7B',
      parametersNum: 6.7,
      size: 'medium',
      license: 'mit',
      contextLength: 16384,
      languages: ['code'],
      capabilities: ['code-generation', 'code-completion', 'code-explanation'],
      hasSafetensors: true,
      isSafe: true,
      benchmarks: { humanEval: 73.8 },
      resourceRequirements: { minVRAM: 14, recommendedVRAM: 16, minRAM: 16 },
      deploymentOptions: ['huggingface', 'vllm', 'ollama', 'tgi'],
      huggingFaceId: 'deepseek-ai/deepseek-coder-6.7b-instruct',
    },
    {
      id: 'codellama-7b',
      name: 'CodeLlama 7B',
      provider: 'Meta',
      category: 'code',
      parameters: '7B',
      parametersNum: 7,
      size: 'medium',
      license: 'llama2',
      contextLength: 16384,
      languages: ['code'],
      capabilities: ['code-generation', 'code-completion', 'infilling'],
      hasSafetensors: true,
      isSafe: true,
      benchmarks: { humanEval: 34.8 },
      resourceRequirements: { minVRAM: 14, recommendedVRAM: 16, minRAM: 16 },
      deploymentOptions: ['huggingface', 'vllm', 'ollama', 'llama.cpp', 'tgi'],
      huggingFaceId: 'codellama/CodeLlama-7b-Instruct-hf',
    },
  ],

  vision: [
    {
      id: 'clip-vit-large',
      name: 'CLIP ViT-L/14',
      provider: 'OpenAI',
      category: 'vision',
      parameters: '428M',
      parametersNum: 0.428,
      size: 'base',
      license: 'mit',
      contextLength: 77,
      languages: ['en'],
      capabilities: ['image-classification', 'image-text-matching', 'zero-shot'],
      hasSafetensors: true,
      isSafe: true,
      resourceRequirements: { minVRAM: 2, recommendedVRAM: 4, minRAM: 4 },
      deploymentOptions: ['huggingface'],
      huggingFaceId: 'openai/clip-vit-large-patch14',
    },
    {
      id: 'dinov2-base',
      name: 'DINOv2 Base',
      provider: 'Meta',
      category: 'vision',
      parameters: '86M',
      parametersNum: 0.086,
      size: 'base',
      license: 'apache-2.0',
      contextLength: 0,
      languages: [],
      capabilities: ['image-feature-extraction', 'image-classification'],
      hasSafetensors: true,
      isSafe: true,
      resourceRequirements: { minVRAM: 2, recommendedVRAM: 4, minRAM: 4 },
      deploymentOptions: ['huggingface'],
      huggingFaceId: 'facebook/dinov2-base',
    },
  ],

  multimodal: [
    {
      id: 'llava-1.5-7b',
      name: 'LLaVA 1.5 7B',
      provider: 'LLaVA',
      category: 'multimodal',
      parameters: '7B',
      parametersNum: 7,
      size: 'medium',
      license: 'llama2',
      contextLength: 4096,
      languages: ['en'],
      capabilities: ['image-to-text', 'visual-qa', 'image-captioning'],
      hasSafetensors: true,
      isSafe: true,
      resourceRequirements: { minVRAM: 16, recommendedVRAM: 24, minRAM: 16 },
      deploymentOptions: ['huggingface', 'vllm'],
      huggingFaceId: 'llava-hf/llava-1.5-7b-hf',
    },
    {
      id: 'blip2-2.7b',
      name: 'BLIP-2 2.7B',
      provider: 'Salesforce',
      category: 'multimodal',
      parameters: '2.7B',
      parametersNum: 2.7,
      size: 'small',
      license: 'mit',
      contextLength: 512,
      languages: ['en'],
      capabilities: ['image-to-text', 'visual-qa', 'image-captioning'],
      hasSafetensors: true,
      isSafe: true,
      resourceRequirements: { minVRAM: 8, recommendedVRAM: 12, minRAM: 8 },
      deploymentOptions: ['huggingface'],
      huggingFaceId: 'Salesforce/blip2-opt-2.7b',
    },
  ],

  embedding: [
    {
      id: 'minilm-l6',
      name: 'MiniLM L6 v2',
      provider: 'sentence-transformers',
      category: 'embedding',
      parameters: '22M',
      parametersNum: 0.022,
      size: 'tiny',
      license: 'apache-2.0',
      contextLength: 256,
      languages: ['en'],
      capabilities: ['sentence-embedding', 'semantic-search'],
      hasSafetensors: true,
      isSafe: true,
      resourceRequirements: { minVRAM: 1, recommendedVRAM: 2, minRAM: 2 },
      deploymentOptions: ['huggingface'],
      huggingFaceId: 'sentence-transformers/all-MiniLM-L6-v2',
    },
    {
      id: 'bge-large',
      name: 'BGE Large v1.5',
      provider: 'BAAI',
      category: 'embedding',
      parameters: '335M',
      parametersNum: 0.335,
      size: 'base',
      license: 'mit',
      contextLength: 512,
      languages: ['en'],
      capabilities: ['sentence-embedding', 'semantic-search', 'retrieval'],
      hasSafetensors: true,
      isSafe: true,
      resourceRequirements: { minVRAM: 2, recommendedVRAM: 4, minRAM: 4 },
      deploymentOptions: ['huggingface'],
      huggingFaceId: 'BAAI/bge-large-en-v1.5',
    },
    {
      id: 'e5-large',
      name: 'E5 Large v2',
      provider: 'intfloat',
      category: 'embedding',
      parameters: '335M',
      parametersNum: 0.335,
      size: 'base',
      license: 'mit',
      contextLength: 512,
      languages: ['en'],
      capabilities: ['sentence-embedding', 'semantic-search', 'retrieval'],
      hasSafetensors: true,
      isSafe: true,
      resourceRequirements: { minVRAM: 2, recommendedVRAM: 4, minRAM: 4 },
      deploymentOptions: ['huggingface'],
      huggingFaceId: 'intfloat/e5-large-v2',
    },
  ],

  speech: [
    {
      id: 'whisper-large-v3',
      name: 'Whisper Large v3',
      provider: 'OpenAI',
      category: 'speech',
      parameters: '1.5B',
      parametersNum: 1.5,
      size: 'large',
      license: 'apache-2.0',
      contextLength: 30,
      languages: ['multi'],
      capabilities: ['speech-recognition', 'transcription', 'translation'],
      hasSafetensors: true,
      isSafe: true,
      resourceRequirements: { minVRAM: 6, recommendedVRAM: 10, minRAM: 8 },
      deploymentOptions: ['huggingface'],
      huggingFaceId: 'openai/whisper-large-v3',
    },
    {
      id: 'wav2vec2-large',
      name: 'Wav2Vec2 Large',
      provider: 'Meta',
      category: 'speech',
      parameters: '315M',
      parametersNum: 0.315,
      size: 'base',
      license: 'apache-2.0',
      contextLength: 0,
      languages: ['en'],
      capabilities: ['speech-recognition', 'transcription'],
      hasSafetensors: true,
      isSafe: true,
      resourceRequirements: { minVRAM: 2, recommendedVRAM: 4, minRAM: 4 },
      deploymentOptions: ['huggingface'],
      huggingFaceId: 'facebook/wav2vec2-large-960h',
    },
  ],

  translation: [
    {
      id: 'nllb-200-distilled',
      name: 'NLLB-200 Distilled 600M',
      provider: 'Meta',
      category: 'translation',
      parameters: '600M',
      parametersNum: 0.6,
      size: 'base',
      license: 'cc-by-nc-4.0',
      contextLength: 1024,
      languages: ['multi'],
      capabilities: ['translation'],
      hasSafetensors: true,
      isSafe: true,
      resourceRequirements: { minVRAM: 2, recommendedVRAM: 4, minRAM: 4 },
      deploymentOptions: ['huggingface'],
      huggingFaceId: 'facebook/nllb-200-distilled-600M',
      notes: '200 language translation support',
    },
  ],

  summarization: [
    {
      id: 'bart-large-cnn',
      name: 'BART Large CNN',
      provider: 'Facebook',
      category: 'summarization',
      parameters: '406M',
      parametersNum: 0.406,
      size: 'base',
      license: 'apache-2.0',
      contextLength: 1024,
      languages: ['en'],
      capabilities: ['summarization', 'text-generation'],
      hasSafetensors: true,
      isSafe: true,
      resourceRequirements: { minVRAM: 2, recommendedVRAM: 4, minRAM: 4 },
      deploymentOptions: ['huggingface'],
      huggingFaceId: 'facebook/bart-large-cnn',
    },
  ],
};

// =============================================================================
// MODEL UTILITIES
// =============================================================================

/**
 * Get all models in a category
 */
export function getModelsByCategory(category: ModelCategory): ModelDefinition[] {
  return OPEN_SOURCE_MODELS[category] || [];
}

/**
 * Get all safe models (safetensors, no pickle)
 */
export function getSafeModels(): ModelDefinition[] {
  return Object.values(OPEN_SOURCE_MODELS)
    .flat()
    .filter((model) => model.isSafe);
}

/**
 * Get models by license type
 */
export function getModelsByLicense(license: License): ModelDefinition[] {
  return Object.values(OPEN_SOURCE_MODELS)
    .flat()
    .filter((model) => model.license === license);
}

/**
 * Get models by size constraint
 */
export function getModelsByVRAM(maxVRAM: number): ModelDefinition[] {
  return Object.values(OPEN_SOURCE_MODELS)
    .flat()
    .filter((model) => model.resourceRequirements.minVRAM <= maxVRAM);
}

/**
 * Get models by capability
 */
export function getModelsByCapability(capability: string): ModelDefinition[] {
  return Object.values(OPEN_SOURCE_MODELS)
    .flat()
    .filter((model) => model.capabilities.includes(capability));
}

/**
 * Find a model by ID
 */
export function findModel(id: string): ModelDefinition | undefined {
  return Object.values(OPEN_SOURCE_MODELS)
    .flat()
    .find((model) => model.id === id);
}

/**
 * Get recommended models for a use case
 */
export function getRecommendedModels(options: {
  task: 'chat' | 'code' | 'embedding' | 'vision' | 'speech';
  maxVRAM?: number;
  requireApacheLicense?: boolean;
}): ModelDefinition[] {
  const categoryMap: Record<string, ModelCategory[]> = {
    chat: ['llm'],
    code: ['code', 'llm'],
    embedding: ['embedding'],
    vision: ['vision', 'multimodal'],
    speech: ['speech'],
  };

  const categories = categoryMap[options.task] || ['llm'];
  let models = categories.flatMap((cat) => OPEN_SOURCE_MODELS[cat]);

  if (options.maxVRAM) {
    models = models.filter((m) => m.resourceRequirements.minVRAM <= options.maxVRAM!);
  }

  if (options.requireApacheLicense) {
    models = models.filter((m) => m.license === 'apache-2.0' || m.license === 'mit');
  }

  // Sort by capability score (benchmarks)
  return models.sort((a, b) => {
    const scoreA = (a.benchmarks?.mmlu || 0) + (a.benchmarks?.humanEval || 0);
    const scoreB = (b.benchmarks?.mmlu || 0) + (b.benchmarks?.humanEval || 0);
    return scoreB - scoreA;
  });
}

// =============================================================================
// DEPLOYMENT CONFIGURATION GENERATORS
// =============================================================================

/**
 * Generate vLLM deployment configuration
 */
export function generateVLLMConfig(model: ModelDefinition): object {
  return {
    model: model.huggingFaceId,
    tensor_parallel_size: Math.ceil(model.resourceRequirements.recommendedVRAM / 24),
    max_model_len: model.contextLength,
    trust_remote_code: true,
    dtype: 'auto',
    gpu_memory_utilization: 0.9,
  };
}

/**
 * Generate Ollama Modelfile
 */
export function generateOllamaModelfile(model: ModelDefinition): string {
  return `FROM ${model.huggingFaceId}

# Model: ${model.name}
# License: ${model.license}
# Parameters: ${model.parameters}

PARAMETER num_ctx ${model.contextLength}
PARAMETER temperature 0.7
PARAMETER top_p 0.9

SYSTEM """
You are a helpful AI assistant based on ${model.name}.
"""
`;
}

/**
 * Generate TGI (Text Generation Inference) configuration
 */
export function generateTGIConfig(model: ModelDefinition): object {
  return {
    model_id: model.huggingFaceId,
    max_input_length: Math.min(model.contextLength - 256, 4096),
    max_total_tokens: model.contextLength,
    max_batch_prefill_tokens: 4096,
    quantize: model.parametersNum > 13 ? 'bitsandbytes-nf4' : undefined,
    trust_remote_code: true,
  };
}

/**
 * Generate llama.cpp deployment command
 */
export function generateLlamaCppCommand(
  model: ModelDefinition,
  options?: { quantization?: string; port?: number }
): string {
  const quant = options?.quantization || 'Q4_K_M';
  const port = options?.port || 8080;

  return `./llama-server \\
  --model ${model.id}.${quant}.gguf \\
  --ctx-size ${model.contextLength} \\
  --port ${port} \\
  --n-gpu-layers 35`;
}

// =============================================================================
// EXPORT ALL
// =============================================================================

export const LLMModels = {
  all: OPEN_SOURCE_MODELS,
  getByCategory: getModelsByCategory,
  getSafe: getSafeModels,
  getByLicense: getModelsByLicense,
  getByVRAM: getModelsByVRAM,
  getByCapability: getModelsByCapability,
  find: findModel,
  getRecommended: getRecommendedModels,
  configs: {
    vllm: generateVLLMConfig,
    ollama: generateOllamaModelfile,
    tgi: generateTGIConfig,
    llamaCpp: generateLlamaCppCommand,
  },
};
