/**
 * BlackRoad OS Integrations
 *
 * Unified platform integrations for deployment, infrastructure,
 * payments, productivity, AI models, and mobile development.
 *
 * Categories:
 * - Cloud Platforms: Railway, Vercel, Cloudflare, DigitalOcean
 * - Version Control: GitHub
 * - Authentication: Clerk
 * - Payments: Stripe
 * - Productivity: Notion, Asana
 * - AI/ML: Hugging Face, Open Source LLM Models
 * - Networking: Tunnels (Cloudflare, ngrok, localtunnel, Tailscale, SSH)
 * - Mobile: Warp, Shellfish, Working Copy, Pyto
 */

// Cloud Platform Integrations
export * from './railway';
export * from './vercel';
export * from './cloudflare';
export * from './digitalocean';

// Version Control
export * from './github';

// Authentication
export * from './clerk';

// Payments
export * from './stripe';

// Productivity Tools
export * from './notion';
export * from './asana';

// AI/ML Models
export * from './huggingface';
export * from './llm-models';

// Networking & Tunnels
export * from './tunnels';

// Mobile Development Apps
export * from './mobile';

// Infrastructure Sync
export * from './sync';

// =============================================================================
// UNIFIED CLIENT FACTORY
// =============================================================================

import { createRailwayClient, RailwayClient } from './railway';
import { createVercelClient, VercelClient } from './vercel';
import { createCloudflareClient, CloudflareClient } from './cloudflare';
import { createDigitalOceanClient, DigitalOceanClient } from './digitalocean';
import { createGitHubClient, GitHubClient } from './github';
import { createClerkClient, ClerkClient } from './clerk';
import { createStripeClient, StripeClient } from './stripe';
import { createNotionClient, NotionClient } from './notion';
import { createAsanaClient, AsanaClient } from './asana';
import { createHuggingFaceClient, HuggingFaceClient } from './huggingface';
import { createTunnelManager, TunnelManager } from './tunnels';
import { createMobileIntegrations, MobileIntegration } from './mobile';

export interface IntegrationClients {
  railway?: RailwayClient;
  vercel?: VercelClient;
  cloudflare?: CloudflareClient;
  digitalocean?: DigitalOceanClient;
  github?: GitHubClient;
  clerk?: ClerkClient;
  stripe?: StripeClient;
  notion?: NotionClient;
  asana?: AsanaClient;
  huggingface?: HuggingFaceClient;
  tunnels?: TunnelManager;
  mobile?: MobileIntegration;
}

/**
 * Create all available integration clients based on environment variables
 */
export function createIntegrationClients(options?: {
  required?: (keyof IntegrationClients)[];
  optional?: (keyof IntegrationClients)[];
}): IntegrationClients {
  const clients: IntegrationClients = {};
  const errors: string[] = [];

  const required = new Set(options?.required || []);

  // Railway
  if (process.env.RAILWAY_TOKEN) {
    try {
      clients.railway = createRailwayClient();
    } catch (e) {
      if (required.has('railway')) errors.push(`Railway: ${e}`);
    }
  } else if (required.has('railway')) {
    errors.push('Railway: RAILWAY_TOKEN not set');
  }

  // Vercel
  if (process.env.VERCEL_TOKEN) {
    try {
      clients.vercel = createVercelClient();
    } catch (e) {
      if (required.has('vercel')) errors.push(`Vercel: ${e}`);
    }
  } else if (required.has('vercel')) {
    errors.push('Vercel: VERCEL_TOKEN not set');
  }

  // Cloudflare
  if (process.env.CLOUDFLARE_API_TOKEN) {
    try {
      clients.cloudflare = createCloudflareClient();
    } catch (e) {
      if (required.has('cloudflare')) errors.push(`Cloudflare: ${e}`);
    }
  } else if (required.has('cloudflare')) {
    errors.push('Cloudflare: CLOUDFLARE_API_TOKEN not set');
  }

  // DigitalOcean
  if (process.env.DIGITALOCEAN_TOKEN) {
    try {
      clients.digitalocean = createDigitalOceanClient();
    } catch (e) {
      if (required.has('digitalocean')) errors.push(`DigitalOcean: ${e}`);
    }
  } else if (required.has('digitalocean')) {
    errors.push('DigitalOcean: DIGITALOCEAN_TOKEN not set');
  }

  // GitHub
  if (process.env.GITHUB_TOKEN) {
    try {
      clients.github = createGitHubClient();
    } catch (e) {
      if (required.has('github')) errors.push(`GitHub: ${e}`);
    }
  } else if (required.has('github')) {
    errors.push('GitHub: GITHUB_TOKEN not set');
  }

  // Clerk
  if (process.env.CLERK_SECRET_KEY) {
    try {
      clients.clerk = createClerkClient();
    } catch (e) {
      if (required.has('clerk')) errors.push(`Clerk: ${e}`);
    }
  } else if (required.has('clerk')) {
    errors.push('Clerk: CLERK_SECRET_KEY not set');
  }

  // Stripe
  if (process.env.STRIPE_SECRET_KEY) {
    try {
      clients.stripe = createStripeClient();
    } catch (e) {
      if (required.has('stripe')) errors.push(`Stripe: ${e}`);
    }
  } else if (required.has('stripe')) {
    errors.push('Stripe: STRIPE_SECRET_KEY not set');
  }

  // Notion
  if (process.env.NOTION_TOKEN) {
    try {
      clients.notion = createNotionClient();
    } catch (e) {
      if (required.has('notion')) errors.push(`Notion: ${e}`);
    }
  } else if (required.has('notion')) {
    errors.push('Notion: NOTION_TOKEN not set');
  }

  // Asana
  if (process.env.ASANA_TOKEN) {
    try {
      clients.asana = createAsanaClient();
    } catch (e) {
      if (required.has('asana')) errors.push(`Asana: ${e}`);
    }
  } else if (required.has('asana')) {
    errors.push('Asana: ASANA_TOKEN not set');
  }

  // Hugging Face
  if (process.env.HUGGINGFACE_TOKEN || process.env.HF_TOKEN) {
    try {
      clients.huggingface = createHuggingFaceClient();
    } catch (e) {
      if (required.has('huggingface')) errors.push(`HuggingFace: ${e}`);
    }
  } else if (required.has('huggingface')) {
    errors.push('HuggingFace: HUGGINGFACE_TOKEN or HF_TOKEN not set');
  }

  // Tunnels (always available)
  clients.tunnels = createTunnelManager();

  // Mobile (always available)
  clients.mobile = createMobileIntegrations();

  if (errors.length > 0) {
    throw new Error(`Failed to create required integration clients:\n${errors.join('\n')}`);
  }

  return clients;
}

/**
 * Check which integrations are available based on environment variables
 */
export function getAvailableIntegrations(): {
  available: string[];
  missing: { name: string; envVar: string }[];
} {
  const integrations = [
    { name: 'railway', envVar: 'RAILWAY_TOKEN' },
    { name: 'vercel', envVar: 'VERCEL_TOKEN' },
    { name: 'cloudflare', envVar: 'CLOUDFLARE_API_TOKEN' },
    { name: 'digitalocean', envVar: 'DIGITALOCEAN_TOKEN' },
    { name: 'github', envVar: 'GITHUB_TOKEN' },
    { name: 'clerk', envVar: 'CLERK_SECRET_KEY' },
    { name: 'stripe', envVar: 'STRIPE_SECRET_KEY' },
    { name: 'notion', envVar: 'NOTION_TOKEN' },
    { name: 'asana', envVar: 'ASANA_TOKEN' },
    { name: 'huggingface', envVar: 'HUGGINGFACE_TOKEN' },
    { name: 'ngrok', envVar: 'NGROK_AUTHTOKEN' },
  ];

  const available: string[] = [];
  const missing: { name: string; envVar: string }[] = [];

  for (const integration of integrations) {
    if (process.env[integration.envVar]) {
      available.push(integration.name);
    } else {
      missing.push(integration);
    }
  }

  // Always available
  available.push('tunnels', 'mobile', 'llm-models');

  return { available, missing };
}
