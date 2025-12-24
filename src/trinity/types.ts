/**
 * Trinity Template System Types
 * 
 * Type definitions for the Light Trinity system:
 * - 🔴 RedLight: Visual templates (worlds, websites, animations)
 * - 💚 GreenLight: Project management templates
 * - 💛 YellowLight: Infrastructure templates
 */

/**
 * The three lights of the Trinity system
 */
export enum TrinityLight {
  RED = 'redlight',
  GREEN = 'greenlight',
  YELLOW = 'yellowlight',
}

/**
 * RedLight template categories
 */
export enum RedLightCategory {
  WORLD = 'world',
  WEBSITE = 'website',
  ANIMATION = 'animation',
  DESIGN = 'design',
  GAME = 'game',
  APP = 'app',
  VISUAL = 'visual',
}

/**
 * GreenLight lifecycle states
 */
export enum GreenLightState {
  VOID = 'void',
  INBOX = 'inbox',
  BACKLOG = 'backlog',
  TODO = 'todo',
  WIP = 'wip',
  REVIEW = 'review',
  BLOCKED = 'blocked',
  DONE = 'done',
  ARCHIVED = 'archived',
}

/**
 * YellowLight platform types
 */
export enum YellowLightPlatform {
  CLOUDFLARE = 'cloudflare',
  RAILWAY = 'railway',
  DIGITALOCEAN = 'digitalocean',
  PI = 'pi',
  VERCEL = 'vercel',
  NETLIFY = 'netlify',
}

/**
 * Base template interface
 */
export interface TrinityTemplate {
  id: string;
  light: TrinityLight;
  name: string;
  description: string;
  version: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}

/**
 * RedLight template for visual experiences
 */
export interface RedLightTemplate extends TrinityTemplate {
  light: TrinityLight.RED;
  category: RedLightCategory;
  file_path: string;
  deployed_url?: string;
  preview_url?: string;
  tags: string[];
  dependencies: string[];
  features: string[];
  performance_metrics?: {
    fps?: number;
    load_time_ms?: number;
    memory_mb?: number;
  };
}

/**
 * GreenLight template for project management
 */
export interface GreenLightTemplate extends TrinityTemplate {
  light: TrinityLight.GREEN;
  state: GreenLightState;
  scale: string; // emoji like 👉, 🌸, 🎢, 🌌
  domain: string; // emoji like 🛣️, 🌀, ⛓️
  priority: string; // emoji like 🔥, ⭐, 📌
  effort: string; // emoji like 🫧, 🍖, 🏗️
  assigned_to?: string;
  project?: string;
  epic?: string;
}

/**
 * YellowLight template for infrastructure
 */
export interface YellowLightTemplate extends TrinityTemplate {
  light: TrinityLight.YELLOW;
  platform: YellowLightPlatform;
  deployment_type: 'service' | 'database' | 'worker' | 'connector';
  service_name: string;
  url?: string;
  health_check_url?: string;
  environment: 'development' | 'staging' | 'production';
  configuration: Record<string, any>;
}

/**
 * Template deployment request
 */
export interface TemplateDeploymentRequest {
  template_id: string;
  light: TrinityLight;
  target_environment: string;
  configuration?: Record<string, any>;
  dry_run?: boolean;
}

/**
 * Template deployment result
 */
export interface TemplateDeploymentResult {
  success: boolean;
  template_id: string;
  deployment_id: string;
  url?: string;
  deployed_at: string;
  duration_ms: number;
  logs: string[];
  errors?: string[];
}

/**
 * Template orchestration task
 */
export interface TrinityOrchestrationTask {
  id: string;
  light: TrinityLight;
  operation: 'create' | 'update' | 'deploy' | 'archive' | 'delete';
  template: TrinityTemplate;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  created_at: string;
  started_at?: string;
  completed_at?: string;
  result?: any;
  error?: string;
}

/**
 * Cross-light coordination pattern
 */
export interface TrinityCoordination {
  id: string;
  name: string;
  description: string;
  lights: TrinityLight[];
  workflow: TrinityWorkflowStep[];
}

/**
 * Workflow step for Trinity orchestration
 */
export interface TrinityWorkflowStep {
  id: string;
  light: TrinityLight;
  action: string;
  template_id?: string;
  depends_on?: string[];
  parallel?: boolean;
}

/**
 * Template analytics snapshot
 */
export interface TemplateAnalytics {
  template_id: string;
  light: TrinityLight;
  views?: number;
  interactions?: number;
  deployments?: number;
  avg_performance?: Record<string, number>;
  last_updated: string;
}

/**
 * Template health status
 */
export interface TemplateHealth {
  template_id: string;
  light: TrinityLight;
  status: 'healthy' | 'degraded' | 'down';
  last_check: string;
  checks: {
    name: string;
    passed: boolean;
    message?: string;
  }[];
}
