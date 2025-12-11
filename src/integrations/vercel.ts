/**
 * Vercel API Integration
 *
 * Full operations for managing deployments, projects, and domains.
 * Uses Vercel REST API with token authentication.
 *
 * Features:
 * - Project management
 * - Deployment triggers and status
 * - Domain configuration
 * - Environment variables
 * - Team management
 */

export interface VercelConfig {
  token: string;
  teamId?: string;
}

export interface VercelProject {
  id: string;
  name: string;
  accountId: string;
  framework: string | null;
  createdAt: number;
  updatedAt: number;
  latestDeployments?: VercelDeployment[];
  targets?: {
    production?: { id: string; url: string };
  };
}

export interface VercelDeployment {
  id: string;
  uid: string;
  name: string;
  url: string;
  state: 'BUILDING' | 'ERROR' | 'INITIALIZING' | 'QUEUED' | 'READY' | 'CANCELED';
  type: 'LAMBDAS';
  createdAt: number;
  buildingAt?: number;
  ready?: number;
  creator: {
    uid: string;
    username: string;
  };
  meta?: {
    githubCommitRef?: string;
    githubCommitSha?: string;
    githubCommitMessage?: string;
  };
}

export interface VercelDomain {
  name: string;
  apexName: string;
  projectId: string;
  verified: boolean;
  verification?: {
    type: string;
    domain: string;
    value: string;
  }[];
  createdAt: number;
  updatedAt: number;
}

export interface VercelEnvVariable {
  id: string;
  key: string;
  value: string;
  type: 'system' | 'secret' | 'encrypted' | 'plain';
  target: ('production' | 'preview' | 'development')[];
  createdAt: number;
  updatedAt: number;
}

export class VercelClient {
  private readonly baseUrl = 'https://api.vercel.com';
  private readonly headers: Record<string, string>;
  private readonly teamId?: string;

  constructor(config: VercelConfig) {
    this.headers = {
      'Authorization': `Bearer ${config.token}`,
      'Content-Type': 'application/json',
    };
    this.teamId = config.teamId;
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const params = new URLSearchParams();
    if (this.teamId) {
      params.set('teamId', this.teamId);
    }
    const separator = path.includes('?') ? '&' : '?';
    const url = `${this.baseUrl}${path}${params.toString() ? separator + params.toString() : ''}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.headers,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      throw new Error(`Vercel API error: ${error.error?.message || response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get current user info
   */
  async getUser(): Promise<{ id: string; email: string; name: string; username: string }> {
    const result = await this.request<{ user: any }>('/v2/user');
    return {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      username: result.user.username,
    };
  }

  /**
   * List all projects
   */
  async listProjects(): Promise<VercelProject[]> {
    const result = await this.request<{ projects: any[] }>('/v9/projects');
    return result.projects.map((project) => ({
      id: project.id,
      name: project.name,
      accountId: project.accountId,
      framework: project.framework,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      targets: project.targets,
    }));
  }

  /**
   * Get a specific project
   */
  async getProject(projectId: string): Promise<VercelProject> {
    const project = await this.request<any>(`/v9/projects/${projectId}`);
    return {
      id: project.id,
      name: project.name,
      accountId: project.accountId,
      framework: project.framework,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      targets: project.targets,
    };
  }

  /**
   * List deployments for a project
   */
  async listDeployments(projectId?: string, limit = 20): Promise<VercelDeployment[]> {
    const params = new URLSearchParams();
    if (projectId) params.set('projectId', projectId);
    params.set('limit', String(limit));

    const result = await this.request<{ deployments: any[] }>(
      `/v6/deployments?${params.toString()}`
    );

    return result.deployments.map((d) => ({
      id: d.id,
      uid: d.uid,
      name: d.name,
      url: d.url,
      state: d.state,
      type: d.type,
      createdAt: d.createdAt,
      buildingAt: d.buildingAt,
      ready: d.ready,
      creator: {
        uid: d.creator.uid,
        username: d.creator.username,
      },
      meta: d.meta,
    }));
  }

  /**
   * Get deployment details
   */
  async getDeployment(deploymentId: string): Promise<VercelDeployment> {
    const d = await this.request<any>(`/v13/deployments/${deploymentId}`);
    return {
      id: d.id,
      uid: d.uid,
      name: d.name,
      url: d.url,
      state: d.readyState || d.state,
      type: d.type,
      createdAt: d.createdAt,
      buildingAt: d.buildingAt,
      ready: d.ready,
      creator: {
        uid: d.creator.uid,
        username: d.creator.username,
      },
      meta: d.meta,
    };
  }

  /**
   * Trigger a new deployment
   */
  async createDeployment(options: {
    name: string;
    gitSource?: {
      type: 'github' | 'gitlab' | 'bitbucket';
      ref: string;
      repoId: string | number;
    };
    target?: 'production' | 'preview';
  }): Promise<{ id: string; url: string }> {
    const result = await this.request<any>('/v13/deployments', {
      method: 'POST',
      body: JSON.stringify({
        name: options.name,
        gitSource: options.gitSource,
        target: options.target,
      }),
    });

    return {
      id: result.id,
      url: result.url,
    };
  }

  /**
   * Cancel a deployment
   */
  async cancelDeployment(deploymentId: string): Promise<boolean> {
    await this.request(`/v12/deployments/${deploymentId}/cancel`, {
      method: 'PATCH',
    });
    return true;
  }

  /**
   * Redeploy a deployment
   */
  async redeployDeployment(deploymentId: string): Promise<{ id: string; url: string }> {
    const result = await this.request<any>(`/v13/deployments?forceNew=1`, {
      method: 'POST',
      body: JSON.stringify({
        deploymentId,
      }),
    });
    return {
      id: result.id,
      url: result.url,
    };
  }

  /**
   * List domains for a project
   */
  async listDomains(projectId: string): Promise<VercelDomain[]> {
    const result = await this.request<{ domains: any[] }>(
      `/v9/projects/${projectId}/domains`
    );
    return result.domains.map((d) => ({
      name: d.name,
      apexName: d.apexName,
      projectId: d.projectId,
      verified: d.verified,
      verification: d.verification,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    }));
  }

  /**
   * Add a domain to a project
   */
  async addDomain(projectId: string, domain: string): Promise<VercelDomain> {
    const result = await this.request<any>(`/v10/projects/${projectId}/domains`, {
      method: 'POST',
      body: JSON.stringify({ name: domain }),
    });
    return {
      name: result.name,
      apexName: result.apexName,
      projectId: result.projectId,
      verified: result.verified,
      verification: result.verification,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  /**
   * Remove a domain from a project
   */
  async removeDomain(projectId: string, domain: string): Promise<boolean> {
    await this.request(`/v9/projects/${projectId}/domains/${domain}`, {
      method: 'DELETE',
    });
    return true;
  }

  /**
   * List environment variables for a project
   */
  async listEnvVariables(projectId: string): Promise<VercelEnvVariable[]> {
    const result = await this.request<{ envs: any[] }>(
      `/v9/projects/${projectId}/env`
    );
    return result.envs.map((e) => ({
      id: e.id,
      key: e.key,
      value: e.value,
      type: e.type,
      target: e.target,
      createdAt: e.createdAt,
      updatedAt: e.updatedAt,
    }));
  }

  /**
   * Create an environment variable
   */
  async createEnvVariable(
    projectId: string,
    variable: {
      key: string;
      value: string;
      type?: 'plain' | 'secret' | 'encrypted';
      target?: ('production' | 'preview' | 'development')[];
    }
  ): Promise<VercelEnvVariable> {
    const result = await this.request<any>(`/v10/projects/${projectId}/env`, {
      method: 'POST',
      body: JSON.stringify({
        key: variable.key,
        value: variable.value,
        type: variable.type || 'encrypted',
        target: variable.target || ['production', 'preview', 'development'],
      }),
    });
    return {
      id: result.id,
      key: result.key,
      value: result.value,
      type: result.type,
      target: result.target,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  /**
   * Delete an environment variable
   */
  async deleteEnvVariable(projectId: string, envId: string): Promise<boolean> {
    await this.request(`/v9/projects/${projectId}/env/${envId}`, {
      method: 'DELETE',
    });
    return true;
  }

  /**
   * Check deployment health
   */
  async checkDeploymentHealth(url: string, timeout = 5000): Promise<{
    healthy: boolean;
    statusCode?: number;
    responseTime?: number;
    error?: string;
  }> {
    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(`https://${url}`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      return {
        healthy: response.ok,
        statusCode: response.status,
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
}

/**
 * Create a Vercel client from environment variables
 */
export function createVercelClient(): VercelClient {
  const token = process.env.VERCEL_TOKEN;
  if (!token) {
    throw new Error('VERCEL_TOKEN environment variable is required');
  }
  return new VercelClient({
    token,
    teamId: process.env.VERCEL_TEAM_ID,
  });
}
