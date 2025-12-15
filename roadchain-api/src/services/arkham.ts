/**
 * Arkham Intelligence API Integration
 * Provides blockchain intelligence, entity labels, and portfolio tracking
 */

import crypto from 'crypto';

export interface ArkhamConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface ArkhamEntity {
  name: string;
  type: string;
  addresses: string[];
  labels: string[];
  description?: string;
}

export interface ArkhamPortfolio {
  address: string;
  totalValueUsd: number;
  chains: {
    [chain: string]: {
      nativeBalance: string;
      tokens: Array<{
        symbol: string;
        balance: string;
        valueUsd: number;
      }>;
    };
  };
}

export interface ArkhamTransfer {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  chain: string;
  fromLabel?: string;
  toLabel?: string;
}

export class ArkhamClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(config: ArkhamConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.arkhamintelligence.com';
  }

  /**
   * Generate HMAC signature for authenticated requests
   */
  private generateSignature(method: string, path: string, expires: number, body: string = ''): string {
    const message = `${method}${path}${expires}${body}`;
    return crypto.createHmac('sha256', this.apiKey).update(message).digest('base64');
  }

  /**
   * Make authenticated request to Arkham API
   */
  private async request<T>(
    method: string,
    path: string,
    body?: any
  ): Promise<T> {
    const expires = Math.floor(Date.now() / 1000) + 60; // 60 seconds from now
    const bodyStr = body ? JSON.stringify(body) : '';
    const signature = this.generateSignature(method, path, expires, bodyStr);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Arkham-Api-Key': this.apiKey,
      'Arkham-Expires': expires.toString(),
      'Arkham-Signature': signature,
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = bodyStr;
    }

    const response = await fetch(`${this.baseUrl}${path}`, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Arkham API error (${response.status}): ${error}`);
    }

    return response.json();
  }

  /**
   * Get entity information by name/username
   */
  async getEntity(nameOrUsername: string): Promise<ArkhamEntity> {
    return this.request<ArkhamEntity>('GET', `/intelligence/entity/${nameOrUsername}`);
  }

  /**
   * Get address intelligence and labels
   */
  async getAddress(address: string): Promise<any> {
    return this.request<any>('GET', `/intelligence/address/${address}`);
  }

  /**
   * Get portfolio for an address
   */
  async getPortfolio(address: string): Promise<ArkhamPortfolio> {
    return this.request<ArkhamPortfolio>('GET', `/portfolio/address/${address}`);
  }

  /**
   * Get transfers for an address
   */
  async getTransfers(
    address: string,
    options?: {
      chain?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<ArkhamTransfer[]> {
    const params = new URLSearchParams();
    if (options?.chain) params.append('chain', options.chain);
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.offset) params.append('offset', options.offset.toString());

    const query = params.toString();
    const path = `/transfers/address/${address}${query ? '?' + query : ''}`;

    return this.request<ArkhamTransfer[]>('GET', path);
  }

  /**
   * Get labels for an address
   */
  async getLabels(address: string): Promise<string[]> {
    const data = await this.request<{ labels: string[] }>('GET', `/labels/address/${address}`);
    return data.labels || [];
  }

  /**
   * Search for entities, addresses, or transactions
   */
  async search(query: string): Promise<any> {
    return this.request<any>('GET', `/search?q=${encodeURIComponent(query)}`);
  }
}

/**
 * Singleton instance for RoadChain/RoadCoin integration
 */
let arkhamInstance: ArkhamClient | null = null;

export function initArkham(config: ArkhamConfig): void {
  arkhamInstance = new ArkhamClient(config);
}

export function getArkham(): ArkhamClient {
  if (!arkhamInstance) {
    // Try to use environment variable
    const apiKey = process.env.ARKHAM_API_KEY;
    if (!apiKey || apiKey === 'your-api-key-here') {
      throw new Error('Arkham API not initialized. Call initArkham() or set ARKHAM_API_KEY');
    }
    arkhamInstance = new ArkhamClient({ apiKey });
  }
  return arkhamInstance;
}

/**
 * Helper: Enrich RoadChain address with Arkham intelligence
 */
export async function enrichAddress(address: string): Promise<{
  address: string;
  labels: string[];
  entity?: string;
  portfolio?: ArkhamPortfolio;
}> {
  try {
    const arkham = getArkham();
    const [labels, intelligence] = await Promise.all([
      arkham.getLabels(address).catch(() => []),
      arkham.getAddress(address).catch(() => null),
    ]);

    return {
      address,
      labels,
      entity: intelligence?.entity?.name,
      portfolio: undefined, // Fetch separately if needed
    };
  } catch (error) {
    console.error('Failed to enrich address with Arkham:', error);
    return { address, labels: [] };
  }
}

/**
 * Helper: Get comprehensive wallet analytics
 */
export async function getWalletAnalytics(address: string): Promise<{
  address: string;
  labels: string[];
  portfolio: ArkhamPortfolio | null;
  recentTransfers: ArkhamTransfer[];
  riskScore?: number;
}> {
  try {
    const arkham = getArkham();

    const [labels, portfolio, transfers] = await Promise.all([
      arkham.getLabels(address).catch(() => []),
      arkham.getPortfolio(address).catch(() => null),
      arkham.getTransfers(address, { limit: 10 }).catch(() => []),
    ]);

    // Simple risk scoring based on labels
    const riskScore = calculateRiskScore(labels);

    return {
      address,
      labels,
      portfolio,
      recentTransfers: transfers,
      riskScore,
    };
  } catch (error) {
    console.error('Failed to get wallet analytics:', error);
    return {
      address,
      labels: [],
      portfolio: null,
      recentTransfers: [],
    };
  }
}

/**
 * Calculate risk score based on Arkham labels
 */
function calculateRiskScore(labels: string[]): number {
  const riskIndicators = [
    'exploit',
    'hack',
    'scam',
    'phishing',
    'mixer',
    'tornado',
    'sanctioned',
    'ofac',
  ];

  const trustIndicators = [
    'exchange',
    'cex',
    'verified',
    'legitimate',
    'project',
    'foundation',
  ];

  let score = 50; // Neutral

  labels.forEach((label) => {
    const lowerLabel = label.toLowerCase();
    if (riskIndicators.some((risk) => lowerLabel.includes(risk))) {
      score += 15;
    }
    if (trustIndicators.some((trust) => lowerLabel.includes(trust))) {
      score -= 10;
    }
  });

  return Math.max(0, Math.min(100, score));
}
