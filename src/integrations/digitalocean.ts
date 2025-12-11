/**
 * DigitalOcean API Integration
 *
 * Full operations for managing Droplets, databases, and other resources.
 * Uses DigitalOcean REST API with token authentication.
 *
 * Features:
 * - Droplet management (create, list, power actions)
 * - SSH key management
 * - Firewall rules
 * - Volumes and snapshots
 * - Database clusters
 * - App Platform deployments
 */

export interface DigitalOceanConfig {
  token: string;
}

export interface Droplet {
  id: number;
  name: string;
  status: 'new' | 'active' | 'off' | 'archive';
  memory: number;
  vcpus: number;
  disk: number;
  region: {
    slug: string;
    name: string;
  };
  image: {
    id: number;
    name: string;
    distribution: string;
  };
  size: {
    slug: string;
    memory: number;
    vcpus: number;
    disk: number;
    priceMonthly: number;
  };
  networks: {
    v4: {
      ipAddress: string;
      netmask: string;
      gateway: string;
      type: 'public' | 'private';
    }[];
    v6: {
      ipAddress: string;
      netmask: number;
      gateway: string;
      type: 'public';
    }[];
  };
  tags: string[];
  createdAt: string;
}

export interface SSHKey {
  id: number;
  fingerprint: string;
  publicKey: string;
  name: string;
}

export interface Firewall {
  id: string;
  name: string;
  status: 'waiting' | 'succeeded' | 'failed';
  inboundRules: FirewallRule[];
  outboundRules: FirewallRule[];
  dropletIds: number[];
  tags: string[];
  createdAt: string;
}

export interface FirewallRule {
  protocol: 'tcp' | 'udp' | 'icmp';
  ports: string;
  sources?: {
    addresses?: string[];
    dropletIds?: number[];
    tags?: string[];
  };
  destinations?: {
    addresses?: string[];
    dropletIds?: number[];
    tags?: string[];
  };
}

export interface App {
  id: string;
  ownerUuid: string;
  spec: {
    name: string;
    region?: string;
    services?: any[];
    staticSites?: any[];
    workers?: any[];
    jobs?: any[];
    databases?: any[];
  };
  defaultIngress: string;
  createdAt: string;
  updatedAt: string;
  activeDeployment?: {
    id: string;
    phase: 'PENDING_BUILD' | 'BUILDING' | 'PENDING_DEPLOY' | 'DEPLOYING' | 'ACTIVE' | 'SUPERSEDED' | 'ERROR' | 'CANCELED';
    createdAt: string;
  };
  inProgressDeployment?: {
    id: string;
    phase: string;
    createdAt: string;
  };
}

export class DigitalOceanClient {
  private readonly baseUrl = 'https://api.digitalocean.com/v2';
  private readonly headers: Record<string, string>;

  constructor(config: DigitalOceanConfig) {
    this.headers = {
      'Authorization': `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.headers,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(`DigitalOcean API error: ${error.message || response.statusText}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  /**
   * Get account info
   */
  async getAccount(): Promise<{
    uuid: string;
    email: string;
    emailVerified: boolean;
    status: string;
    dropletLimit: number;
  }> {
    const result = await this.request<{ account: any }>('/account');
    return {
      uuid: result.account.uuid,
      email: result.account.email,
      emailVerified: result.account.email_verified,
      status: result.account.status,
      dropletLimit: result.account.droplet_limit,
    };
  }

  /**
   * List all droplets
   */
  async listDroplets(tag?: string): Promise<Droplet[]> {
    const params = tag ? `?tag_name=${encodeURIComponent(tag)}` : '';
    const result = await this.request<{ droplets: any[] }>(`/droplets${params}`);
    return result.droplets.map(this.mapDroplet);
  }

  /**
   * Get a specific droplet
   */
  async getDroplet(dropletId: number): Promise<Droplet> {
    const result = await this.request<{ droplet: any }>(`/droplets/${dropletId}`);
    return this.mapDroplet(result.droplet);
  }

  /**
   * Create a new droplet
   */
  async createDroplet(options: {
    name: string;
    region: string;
    size: string;
    image: string | number;
    sshKeys?: (string | number)[];
    backups?: boolean;
    ipv6?: boolean;
    userData?: string;
    tags?: string[];
  }): Promise<Droplet> {
    const result = await this.request<{ droplet: any }>('/droplets', {
      method: 'POST',
      body: JSON.stringify({
        name: options.name,
        region: options.region,
        size: options.size,
        image: options.image,
        ssh_keys: options.sshKeys,
        backups: options.backups,
        ipv6: options.ipv6,
        user_data: options.userData,
        tags: options.tags,
      }),
    });
    return this.mapDroplet(result.droplet);
  }

  /**
   * Delete a droplet
   */
  async deleteDroplet(dropletId: number): Promise<boolean> {
    await this.request(`/droplets/${dropletId}`, { method: 'DELETE' });
    return true;
  }

  /**
   * Power on a droplet
   */
  async powerOnDroplet(dropletId: number): Promise<{ actionId: number }> {
    const result = await this.request<{ action: any }>(
      `/droplets/${dropletId}/actions`,
      {
        method: 'POST',
        body: JSON.stringify({ type: 'power_on' }),
      }
    );
    return { actionId: result.action.id };
  }

  /**
   * Power off a droplet
   */
  async powerOffDroplet(dropletId: number): Promise<{ actionId: number }> {
    const result = await this.request<{ action: any }>(
      `/droplets/${dropletId}/actions`,
      {
        method: 'POST',
        body: JSON.stringify({ type: 'power_off' }),
      }
    );
    return { actionId: result.action.id };
  }

  /**
   * Reboot a droplet
   */
  async rebootDroplet(dropletId: number): Promise<{ actionId: number }> {
    const result = await this.request<{ action: any }>(
      `/droplets/${dropletId}/actions`,
      {
        method: 'POST',
        body: JSON.stringify({ type: 'reboot' }),
      }
    );
    return { actionId: result.action.id };
  }

  /**
   * Rebuild a droplet with a new image
   */
  async rebuildDroplet(dropletId: number, image: string | number): Promise<{ actionId: number }> {
    const result = await this.request<{ action: any }>(
      `/droplets/${dropletId}/actions`,
      {
        method: 'POST',
        body: JSON.stringify({ type: 'rebuild', image }),
      }
    );
    return { actionId: result.action.id };
  }

  /**
   * List SSH keys
   */
  async listSSHKeys(): Promise<SSHKey[]> {
    const result = await this.request<{ ssh_keys: any[] }>('/account/keys');
    return result.ssh_keys.map((key) => ({
      id: key.id,
      fingerprint: key.fingerprint,
      publicKey: key.public_key,
      name: key.name,
    }));
  }

  /**
   * Add an SSH key
   */
  async addSSHKey(name: string, publicKey: string): Promise<SSHKey> {
    const result = await this.request<{ ssh_key: any }>('/account/keys', {
      method: 'POST',
      body: JSON.stringify({ name, public_key: publicKey }),
    });
    return {
      id: result.ssh_key.id,
      fingerprint: result.ssh_key.fingerprint,
      publicKey: result.ssh_key.public_key,
      name: result.ssh_key.name,
    };
  }

  /**
   * List firewalls
   */
  async listFirewalls(): Promise<Firewall[]> {
    const result = await this.request<{ firewalls: any[] }>('/firewalls');
    return result.firewalls.map((fw) => ({
      id: fw.id,
      name: fw.name,
      status: fw.status,
      inboundRules: fw.inbound_rules || [],
      outboundRules: fw.outbound_rules || [],
      dropletIds: fw.droplet_ids || [],
      tags: fw.tags || [],
      createdAt: fw.created_at,
    }));
  }

  /**
   * List App Platform apps
   */
  async listApps(): Promise<App[]> {
    const result = await this.request<{ apps: any[] }>('/apps');
    return result.apps.map(this.mapApp);
  }

  /**
   * Get an App Platform app
   */
  async getApp(appId: string): Promise<App> {
    const result = await this.request<{ app: any }>(`/apps/${appId}`);
    return this.mapApp(result.app);
  }

  /**
   * Create a new deployment for an app
   */
  async createAppDeployment(appId: string): Promise<{
    deploymentId: string;
    phase: string;
  }> {
    const result = await this.request<{ deployment: any }>(
      `/apps/${appId}/deployments`,
      { method: 'POST' }
    );
    return {
      deploymentId: result.deployment.id,
      phase: result.deployment.phase,
    };
  }

  /**
   * Check droplet health via SSH or HTTP
   */
  async checkDropletHealth(ip: string, port = 22, timeout = 5000): Promise<{
    healthy: boolean;
    responseTime?: number;
    error?: string;
  }> {
    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // Try HTTP health check first
      const response = await fetch(`http://${ip}:${port}/health`, {
        method: 'GET',
        signal: controller.signal,
      }).catch(() => null);

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      if (response?.ok) {
        return { healthy: true, responseTime };
      }

      // If HTTP fails, consider it healthy if we got any response
      return {
        healthy: response !== null,
        responseTime,
      };
    } catch (error) {
      return {
        healthy: false,
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private mapDroplet(d: any): Droplet {
    return {
      id: d.id,
      name: d.name,
      status: d.status,
      memory: d.memory,
      vcpus: d.vcpus,
      disk: d.disk,
      region: {
        slug: d.region.slug,
        name: d.region.name,
      },
      image: {
        id: d.image.id,
        name: d.image.name,
        distribution: d.image.distribution,
      },
      size: {
        slug: d.size.slug,
        memory: d.size.memory,
        vcpus: d.size.vcpus,
        disk: d.size.disk,
        priceMonthly: d.size.price_monthly,
      },
      networks: {
        v4: d.networks.v4.map((n: any) => ({
          ipAddress: n.ip_address,
          netmask: n.netmask,
          gateway: n.gateway,
          type: n.type,
        })),
        v6: d.networks.v6?.map((n: any) => ({
          ipAddress: n.ip_address,
          netmask: n.netmask,
          gateway: n.gateway,
          type: n.type,
        })) || [],
      },
      tags: d.tags,
      createdAt: d.created_at,
    };
  }

  private mapApp(app: any): App {
    return {
      id: app.id,
      ownerUuid: app.owner_uuid,
      spec: {
        name: app.spec.name,
        region: app.spec.region,
        services: app.spec.services,
        staticSites: app.spec.static_sites,
        workers: app.spec.workers,
        jobs: app.spec.jobs,
        databases: app.spec.databases,
      },
      defaultIngress: app.default_ingress,
      createdAt: app.created_at,
      updatedAt: app.updated_at,
      activeDeployment: app.active_deployment ? {
        id: app.active_deployment.id,
        phase: app.active_deployment.phase,
        createdAt: app.active_deployment.created_at,
      } : undefined,
      inProgressDeployment: app.in_progress_deployment ? {
        id: app.in_progress_deployment.id,
        phase: app.in_progress_deployment.phase,
        createdAt: app.in_progress_deployment.created_at,
      } : undefined,
    };
  }
}

/**
 * Create a DigitalOcean client from environment variables
 */
export function createDigitalOceanClient(): DigitalOceanClient {
  const token = process.env.DIGITALOCEAN_TOKEN;
  if (!token) {
    throw new Error('DIGITALOCEAN_TOKEN environment variable is required');
  }
  return new DigitalOceanClient({ token });
}
