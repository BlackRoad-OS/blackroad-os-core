/**
 * Hugging Face API Integration
 *
 * Full operations for managing models, datasets, spaces, and inference.
 * Uses Hugging Face Hub API with token authentication.
 *
 * Features:
 * - Model discovery and management
 * - Inference API for text, image, audio
 * - Dataset management
 * - Spaces deployment
 * - Model forking and versioning
 * - Safe model scanning
 */

export interface HuggingFaceConfig {
  token: string;
}

export interface HFModel {
  id: string;
  modelId: string;
  author: string;
  sha: string;
  lastModified: string;
  isPrivate: boolean;
  disabled: boolean;
  gated: boolean | 'auto' | 'manual';
  pipeline_tag?: string;
  tags: string[];
  downloads: number;
  likes: number;
  library_name?: string;
  modelIndex?: any[];
  config?: Record<string, any>;
  cardData?: {
    license?: string;
    language?: string[];
    datasets?: string[];
    metrics?: string[];
    baseModel?: string;
  };
  siblings?: { rfilename: string; size?: number }[];
  spaces?: string[];
  safetensors?: {
    total: number;
    parameters: Record<string, number>;
  };
}

export interface HFDataset {
  id: string;
  author: string;
  sha: string;
  lastModified: string;
  isPrivate: boolean;
  disabled: boolean;
  gated: boolean | 'auto' | 'manual';
  tags: string[];
  downloads: number;
  likes: number;
  paperswithcode_id?: string;
  cardData?: {
    license?: string;
    language?: string[];
    size_categories?: string[];
    task_categories?: string[];
  };
}

export interface HFSpace {
  id: string;
  author: string;
  sha: string;
  lastModified: string;
  isPrivate: boolean;
  disabled: boolean;
  gated: boolean;
  tags: string[];
  likes: number;
  sdk?: 'gradio' | 'streamlit' | 'docker' | 'static';
  runtime?: {
    stage: 'RUNNING' | 'BUILDING' | 'STOPPED' | 'PAUSED' | 'ERROR';
    hardware?: {
      current: string;
      requested: string;
    };
  };
  cardData?: {
    title?: string;
    emoji?: string;
    colorFrom?: string;
    colorTo?: string;
    sdk?: string;
    pinned?: boolean;
  };
}

export interface HFUser {
  id: string;
  type: 'user' | 'org';
  name: string;
  fullname: string;
  avatarUrl: string;
  isFollowing?: boolean;
  numFollowers?: number;
  numFollowing?: number;
  numModels?: number;
  numDatasets?: number;
  numSpaces?: number;
}

export interface InferenceOptions {
  model: string;
  inputs: string | string[] | Record<string, any>;
  parameters?: Record<string, any>;
  options?: {
    useCache?: boolean;
    waitForModel?: boolean;
  };
}

export interface SafeModelInfo {
  id: string;
  isSafe: boolean;
  hasPickle: boolean;
  hasSafetensors: boolean;
  scanResult?: {
    scanned: boolean;
    hasUnsafeFiles: boolean;
    unsafeFiles: string[];
  };
}

// Pre-configured safe open source models for forking
export const SAFE_FORKABLE_MODELS = {
  // Large Language Models
  llm: [
    { id: 'meta-llama/Llama-3.2-1B', name: 'Llama 3.2 1B', params: '1B', license: 'llama3.2' },
    { id: 'meta-llama/Llama-3.2-3B', name: 'Llama 3.2 3B', params: '3B', license: 'llama3.2' },
    { id: 'mistralai/Mistral-7B-v0.3', name: 'Mistral 7B', params: '7B', license: 'apache-2.0' },
    { id: 'microsoft/phi-3-mini-4k-instruct', name: 'Phi-3 Mini', params: '3.8B', license: 'mit' },
    { id: 'google/gemma-2-2b-it', name: 'Gemma 2 2B', params: '2B', license: 'gemma' },
    { id: 'Qwen/Qwen2.5-7B-Instruct', name: 'Qwen 2.5 7B', params: '7B', license: 'apache-2.0' },
    { id: 'tiiuae/falcon-7b-instruct', name: 'Falcon 7B', params: '7B', license: 'apache-2.0' },
    { id: 'bigscience/bloomz-7b1', name: 'BLOOMZ 7B', params: '7B', license: 'bigscience-bloom-rail-1.0' },
    { id: 'EleutherAI/gpt-neox-20b', name: 'GPT-NeoX 20B', params: '20B', license: 'apache-2.0' },
    { id: 'mosaicml/mpt-7b-instruct', name: 'MPT 7B', params: '7B', license: 'apache-2.0' },
  ],
  // Code Models
  code: [
    { id: 'bigcode/starcoder2-15b', name: 'StarCoder2 15B', params: '15B', license: 'bigcode-openrail-m' },
    { id: 'Qwen/Qwen2.5-Coder-7B-Instruct', name: 'Qwen Coder 7B', params: '7B', license: 'apache-2.0' },
    { id: 'deepseek-ai/deepseek-coder-6.7b-instruct', name: 'DeepSeek Coder 6.7B', params: '6.7B', license: 'mit' },
    { id: 'codellama/CodeLlama-7b-Instruct-hf', name: 'CodeLlama 7B', params: '7B', license: 'llama2' },
  ],
  // Vision Models
  vision: [
    { id: 'openai/clip-vit-large-patch14', name: 'CLIP ViT-L/14', params: '428M', license: 'mit' },
    { id: 'google/vit-base-patch16-224', name: 'ViT Base', params: '86M', license: 'apache-2.0' },
    { id: 'facebook/dinov2-base', name: 'DINOv2 Base', params: '86M', license: 'apache-2.0' },
  ],
  // Multimodal Models
  multimodal: [
    { id: 'llava-hf/llava-1.5-7b-hf', name: 'LLaVA 1.5 7B', params: '7B', license: 'llama2' },
    { id: 'Salesforce/blip2-opt-2.7b', name: 'BLIP-2 2.7B', params: '2.7B', license: 'mit' },
  ],
  // Embedding Models
  embedding: [
    { id: 'sentence-transformers/all-MiniLM-L6-v2', name: 'MiniLM L6', params: '22M', license: 'apache-2.0' },
    { id: 'BAAI/bge-large-en-v1.5', name: 'BGE Large', params: '335M', license: 'mit' },
    { id: 'intfloat/e5-large-v2', name: 'E5 Large', params: '335M', license: 'mit' },
  ],
  // Speech Models
  speech: [
    { id: 'openai/whisper-large-v3', name: 'Whisper Large v3', params: '1.5B', license: 'apache-2.0' },
    { id: 'facebook/wav2vec2-large-960h', name: 'Wav2Vec2', params: '315M', license: 'apache-2.0' },
  ],
} as const;

export class HuggingFaceClient {
  private readonly baseUrl = 'https://huggingface.co/api';
  private readonly inferenceUrl = 'https://api-inference.huggingface.co/models';
  private readonly headers: Record<string, string>;

  constructor(config: HuggingFaceConfig) {
    this.headers = {
      'Authorization': `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    path: string,
    options?: RequestInit,
    baseUrl = this.baseUrl
  ): Promise<T> {
    const url = `${baseUrl}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.headers,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Hugging Face API error: ${error.error || response.statusText}`);
    }

    return response.json();
  }

  // User

  /**
   * Get authenticated user info
   */
  async whoami(): Promise<HFUser> {
    const result = await this.request<any>('/whoami-v2');
    return {
      id: result.id,
      type: result.type,
      name: result.name,
      fullname: result.fullname,
      avatarUrl: result.avatarUrl,
      numModels: result.numModels,
      numDatasets: result.numDatasets,
      numSpaces: result.numSpaces,
    };
  }

  // Models

  /**
   * List models
   */
  async listModels(options?: {
    author?: string;
    search?: string;
    filter?: string;
    sort?: 'lastModified' | 'downloads' | 'likes';
    direction?: 'asc' | 'desc';
    limit?: number;
  }): Promise<HFModel[]> {
    const params = new URLSearchParams();
    if (options?.author) params.set('author', options.author);
    if (options?.search) params.set('search', options.search);
    if (options?.filter) params.set('filter', options.filter);
    if (options?.sort) params.set('sort', options.sort);
    if (options?.direction) params.set('direction', options.direction === 'asc' ? '1' : '-1');
    if (options?.limit) params.set('limit', String(options.limit));

    const result = await this.request<any[]>(`/models?${params}`);
    return result.map(this.mapModel);
  }

  /**
   * Get a model by ID
   */
  async getModel(modelId: string): Promise<HFModel> {
    const result = await this.request<any>(`/models/${modelId}`);
    return this.mapModel(result);
  }

  /**
   * Check if a model is safe (has safetensors, no pickle)
   */
  async checkModelSafety(modelId: string): Promise<SafeModelInfo> {
    const model = await this.getModel(modelId);
    const siblings = model.siblings || [];

    const hasPickle = siblings.some((s) =>
      s.rfilename.endsWith('.pkl') ||
      s.rfilename.endsWith('.pickle') ||
      s.rfilename.endsWith('.bin')
    );

    const hasSafetensors = siblings.some((s) =>
      s.rfilename.endsWith('.safetensors')
    );

    const unsafeFiles = siblings
      .filter((s) =>
        s.rfilename.endsWith('.pkl') ||
        s.rfilename.endsWith('.pickle')
      )
      .map((s) => s.rfilename);

    return {
      id: modelId,
      isSafe: hasSafetensors && !hasPickle,
      hasPickle,
      hasSafetensors,
      scanResult: {
        scanned: true,
        hasUnsafeFiles: unsafeFiles.length > 0,
        unsafeFiles,
      },
    };
  }

  /**
   * Create a model repository
   */
  async createModel(options: {
    name: string;
    organization?: string;
    private?: boolean;
    license?: string;
  }): Promise<{ url: string }> {
    const repoId = options.organization
      ? `${options.organization}/${options.name}`
      : options.name;

    await this.request('/repos/create', {
      method: 'POST',
      body: JSON.stringify({
        name: options.name,
        organization: options.organization,
        type: 'model',
        private: options.private,
        license: options.license,
      }),
    });

    return { url: `https://huggingface.co/${repoId}` };
  }

  /**
   * Fork a model (duplicate)
   */
  async forkModel(
    sourceModelId: string,
    options: {
      name?: string;
      organization?: string;
      private?: boolean;
    }
  ): Promise<{ url: string; repoId: string }> {
    const sourceParts = sourceModelId.split('/');
    const defaultName = sourceParts[sourceParts.length - 1];
    const name = options.name || defaultName;
    const repoId = options.organization
      ? `${options.organization}/${name}`
      : name;

    await this.request('/repos/duplicate', {
      method: 'POST',
      body: JSON.stringify({
        repository: sourceModelId,
        repo_type: 'model',
        private: options.private ?? false,
        ...(options.organization && { organization: options.organization }),
        ...(options.name && { name: options.name }),
      }),
    });

    return {
      url: `https://huggingface.co/${repoId}`,
      repoId,
    };
  }

  /**
   * Get all safe forkable models by category
   */
  getSafeForkableModels(): typeof SAFE_FORKABLE_MODELS {
    return SAFE_FORKABLE_MODELS;
  }

  /**
   * Fork a safe pre-configured model
   */
  async forkSafeModel(
    category: keyof typeof SAFE_FORKABLE_MODELS,
    modelIndex: number,
    options: {
      name?: string;
      organization?: string;
      private?: boolean;
    }
  ): Promise<{ url: string; repoId: string; model: (typeof SAFE_FORKABLE_MODELS)[typeof category][number] }> {
    const models = SAFE_FORKABLE_MODELS[category];
    if (modelIndex < 0 || modelIndex >= models.length) {
      throw new Error(`Invalid model index ${modelIndex} for category ${category}`);
    }

    const model = models[modelIndex];
    const result = await this.forkModel(model.id, options);

    return {
      ...result,
      model,
    };
  }

  // Datasets

  /**
   * List datasets
   */
  async listDatasets(options?: {
    author?: string;
    search?: string;
    sort?: 'lastModified' | 'downloads' | 'likes';
    limit?: number;
  }): Promise<HFDataset[]> {
    const params = new URLSearchParams();
    if (options?.author) params.set('author', options.author);
    if (options?.search) params.set('search', options.search);
    if (options?.sort) params.set('sort', options.sort);
    if (options?.limit) params.set('limit', String(options.limit));

    const result = await this.request<any[]>(`/datasets?${params}`);
    return result.map(this.mapDataset);
  }

  /**
   * Get a dataset by ID
   */
  async getDataset(datasetId: string): Promise<HFDataset> {
    const result = await this.request<any>(`/datasets/${datasetId}`);
    return this.mapDataset(result);
  }

  // Spaces

  /**
   * List spaces
   */
  async listSpaces(options?: {
    author?: string;
    search?: string;
    sort?: 'lastModified' | 'likes';
    limit?: number;
  }): Promise<HFSpace[]> {
    const params = new URLSearchParams();
    if (options?.author) params.set('author', options.author);
    if (options?.search) params.set('search', options.search);
    if (options?.sort) params.set('sort', options.sort);
    if (options?.limit) params.set('limit', String(options.limit));

    const result = await this.request<any[]>(`/spaces?${params}`);
    return result.map(this.mapSpace);
  }

  /**
   * Get a space by ID
   */
  async getSpace(spaceId: string): Promise<HFSpace> {
    const result = await this.request<any>(`/spaces/${spaceId}`);
    return this.mapSpace(result);
  }

  /**
   * Create a space
   */
  async createSpace(options: {
    name: string;
    organization?: string;
    private?: boolean;
    sdk: 'gradio' | 'streamlit' | 'docker' | 'static';
    hardware?: string;
  }): Promise<{ url: string }> {
    const repoId = options.organization
      ? `${options.organization}/${options.name}`
      : options.name;

    await this.request('/repos/create', {
      method: 'POST',
      body: JSON.stringify({
        name: options.name,
        organization: options.organization,
        type: 'space',
        private: options.private,
        sdk: options.sdk,
        hardware: options.hardware,
      }),
    });

    return { url: `https://huggingface.co/spaces/${repoId}` };
  }

  // Inference

  /**
   * Run inference on a model
   */
  async inference<T = any>(options: InferenceOptions): Promise<T> {
    const response = await fetch(`${this.inferenceUrl}/${options.model}`, {
      method: 'POST',
      headers: {
        ...this.headers,
        ...(options.options?.waitForModel && { 'x-wait-for-model': 'true' }),
        ...(options.options?.useCache === false && { 'x-use-cache': 'false' }),
      },
      body: JSON.stringify({
        inputs: options.inputs,
        parameters: options.parameters,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(`Inference error: ${error.error || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Text generation inference
   */
  async generateText(
    model: string,
    prompt: string,
    options?: {
      maxNewTokens?: number;
      temperature?: number;
      topP?: number;
      topK?: number;
      repetitionPenalty?: number;
      doSample?: boolean;
    }
  ): Promise<{ generated_text: string }[]> {
    return this.inference({
      model,
      inputs: prompt,
      parameters: {
        max_new_tokens: options?.maxNewTokens || 256,
        temperature: options?.temperature || 0.7,
        top_p: options?.topP || 0.95,
        top_k: options?.topK || 50,
        repetition_penalty: options?.repetitionPenalty || 1.1,
        do_sample: options?.doSample ?? true,
      },
    });
  }

  /**
   * Text embedding inference
   */
  async embed(model: string, texts: string | string[]): Promise<number[][]> {
    const inputs = Array.isArray(texts) ? texts : [texts];
    return this.inference({ model, inputs });
  }

  /**
   * Text classification inference
   */
  async classify(model: string, text: string): Promise<{ label: string; score: number }[][]> {
    return this.inference({ model, inputs: text });
  }

  /**
   * Question answering inference
   */
  async questionAnswering(
    model: string,
    question: string,
    context: string
  ): Promise<{ answer: string; score: number; start: number; end: number }> {
    return this.inference({
      model,
      inputs: { question, context },
    });
  }

  /**
   * Image classification inference
   */
  async classifyImage(
    model: string,
    imageUrl: string
  ): Promise<{ label: string; score: number }[]> {
    const response = await fetch(imageUrl);
    const imageBlob = await response.blob();

    const formData = new FormData();
    formData.append('file', imageBlob);

    const result = await fetch(`${this.inferenceUrl}/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': this.headers['Authorization'],
      },
      body: formData,
    });

    return result.json();
  }

  // Mapping functions

  private mapModel(m: any): HFModel {
    return {
      id: m.id || m._id,
      modelId: m.modelId || m.id,
      author: m.author || m.id?.split('/')[0],
      sha: m.sha,
      lastModified: m.lastModified,
      isPrivate: m.private || false,
      disabled: m.disabled || false,
      gated: m.gated || false,
      pipeline_tag: m.pipeline_tag,
      tags: m.tags || [],
      downloads: m.downloads || 0,
      likes: m.likes || 0,
      library_name: m.library_name,
      modelIndex: m.modelIndex,
      config: m.config,
      cardData: m.cardData,
      siblings: m.siblings,
      spaces: m.spaces,
      safetensors: m.safetensors,
    };
  }

  private mapDataset(d: any): HFDataset {
    return {
      id: d.id || d._id,
      author: d.author || d.id?.split('/')[0],
      sha: d.sha,
      lastModified: d.lastModified,
      isPrivate: d.private || false,
      disabled: d.disabled || false,
      gated: d.gated || false,
      tags: d.tags || [],
      downloads: d.downloads || 0,
      likes: d.likes || 0,
      paperswithcode_id: d.paperswithcode_id,
      cardData: d.cardData,
    };
  }

  private mapSpace(s: any): HFSpace {
    return {
      id: s.id || s._id,
      author: s.author || s.id?.split('/')[0],
      sha: s.sha,
      lastModified: s.lastModified,
      isPrivate: s.private || false,
      disabled: s.disabled || false,
      gated: s.gated || false,
      tags: s.tags || [],
      likes: s.likes || 0,
      sdk: s.sdk,
      runtime: s.runtime,
      cardData: s.cardData,
    };
  }
}

/**
 * Create a Hugging Face client from environment variables
 */
export function createHuggingFaceClient(): HuggingFaceClient {
  const token = process.env.HUGGINGFACE_TOKEN || process.env.HF_TOKEN;
  if (!token) {
    throw new Error('HUGGINGFACE_TOKEN or HF_TOKEN environment variable is required');
  }
  return new HuggingFaceClient({ token });
}
