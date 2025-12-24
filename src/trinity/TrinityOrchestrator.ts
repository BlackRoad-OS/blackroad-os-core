/**
 * Trinity Orchestrator
 * 
 * Unified orchestrator that coordinates all three lights:
 * - 🔴 RedLight: Visual templates
 * - 💚 GreenLight: Project management
 * - 💛 YellowLight: Infrastructure
 * 
 * Enables cross-light workflows and coordination patterns.
 */

import { EventEmitter } from 'events';
import { RedLightOrchestrator } from './RedLightOrchestrator';
import { GreenLightOrchestrator } from './GreenLightOrchestrator';
import { YellowLightOrchestrator } from './YellowLightOrchestrator';
import {
  TrinityLight,
  TrinityCoordination,
  TrinityWorkflowStep,
  TrinityOrchestrationTask,
  TrinityTemplate,
} from './types';

/**
 * Trinity workflow templates for common coordination patterns
 */
export interface TrinityWorkflowTemplate {
  id: string;
  name: string;
  description: string;
  steps: TrinityWorkflowStep[];
}

/**
 * Main Trinity orchestrator that coordinates all three lights
 */
export class TrinityOrchestrator extends EventEmitter {
  private redLight: RedLightOrchestrator;
  private greenLight: GreenLightOrchestrator;
  private yellowLight: YellowLightOrchestrator;
  
  private coordinations: Map<string, TrinityCoordination> = new Map();
  private tasks: Map<string, TrinityOrchestrationTask> = new Map();
  private workflowTemplates: Map<string, TrinityWorkflowTemplate> = new Map();

  constructor() {
    super();
    
    // Initialize all three lights
    this.redLight = new RedLightOrchestrator();
    this.greenLight = new GreenLightOrchestrator();
    this.yellowLight = new YellowLightOrchestrator();

    // Set up event forwarding
    this.setupEventForwarding();
    
    // Initialize workflow templates
    this.initializeWorkflowTemplates();
  }

  /**
   * Initialize the Trinity system
   */
  async initialize(trinityBasePath: string = '.trinity'): Promise<void> {
    this.emit('trinity:initializing', { path: trinityBasePath });

    // Load templates from each light
    await Promise.all([
      this.redLight.loadTemplates(`${trinityBasePath}/redlight/templates`),
      this.greenLight.loadTemplates(`${trinityBasePath}/greenlight/scripts`),
      this.yellowLight.loadTemplates(`${trinityBasePath}/yellowlight/scripts`),
    ]);

    this.emit('trinity:initialized', {
      redlight: this.redLight.listTemplates().length,
      greenlight: this.greenLight.listTasks().length,
      yellowlight: this.yellowLight.listInfrastructure().length,
    });
  }

  /**
   * Execute a cross-light coordination workflow
   * 
   * Example: Deploy a RedLight template
   * 1. GreenLight: Create deployment task
   * 2. RedLight: Deploy template to platform
   * 3. YellowLight: Configure infrastructure
   * 4. GreenLight: Mark task complete
   */
  async executeCoordination(
    coordination: TrinityCoordination
  ): Promise<TrinityOrchestrationTask[]> {
    this.emit('coordination:started', coordination);

    const tasks: TrinityOrchestrationTask[] = [];

    try {
      // Execute workflow steps
      for (const step of coordination.workflow) {
        const task = await this.executeWorkflowStep(step, coordination);
        tasks.push(task);

        if (task.status === 'failed') {
          throw new Error(`Workflow step failed: ${step.id}`);
        }
      }

      this.emit('coordination:completed', { coordination, tasks });
      return tasks;
    } catch (error) {
      this.emit('coordination:failed', { coordination, error });
      throw error;
    }
  }

  /**
   * Execute a single workflow step
   */
  private async executeWorkflowStep(
    step: TrinityWorkflowStep,
    coordination: TrinityCoordination
  ): Promise<TrinityOrchestrationTask> {
    const task: TrinityOrchestrationTask = {
      id: this.generateTaskId(),
      light: step.light,
      operation: 'deploy', // Default operation
      template: {} as TrinityTemplate, // Would be populated from step
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    this.tasks.set(task.id, task);
    task.status = 'in_progress';
    task.started_at = new Date().toISOString();

    try {
      // Execute based on light
      let result: any;
      
      switch (step.light) {
        case TrinityLight.RED:
          result = await this.executeRedLightStep(step);
          break;
        case TrinityLight.GREEN:
          result = await this.executeGreenLightStep(step);
          break;
        case TrinityLight.YELLOW:
          result = await this.executeYellowLightStep(step);
          break;
      }

      task.status = 'completed';
      task.completed_at = new Date().toISOString();
      task.result = result;
    } catch (error) {
      task.status = 'failed';
      task.completed_at = new Date().toISOString();
      task.error = error instanceof Error ? error.message : String(error);
    }

    this.tasks.set(task.id, task);
    return task;
  }

  /**
   * Execute a RedLight workflow step
   */
  private async executeRedLightStep(step: TrinityWorkflowStep): Promise<any> {
    this.emit('redlight:step', step);
    // Delegate to RedLight orchestrator
    return { success: true, step: step.id };
  }

  /**
   * Execute a GreenLight workflow step
   */
  private async executeGreenLightStep(step: TrinityWorkflowStep): Promise<any> {
    this.emit('greenlight:step', step);
    // Delegate to GreenLight orchestrator
    return { success: true, step: step.id };
  }

  /**
   * Execute a YellowLight workflow step
   */
  private async executeYellowLightStep(step: TrinityWorkflowStep): Promise<any> {
    this.emit('yellowlight:step', step);
    // Delegate to YellowLight orchestrator
    return { success: true, step: step.id };
  }

  /**
   * Create a coordination from a workflow template
   */
  createCoordinationFromTemplate(
    templateId: string,
    name: string,
    context: Record<string, any> = {}
  ): TrinityCoordination {
    const template = this.workflowTemplates.get(templateId);
    if (!template) {
      throw new Error(`Workflow template not found: ${templateId}`);
    }

    const coordination: TrinityCoordination = {
      id: this.generateCoordinationId(),
      name,
      description: template.description,
      lights: this.extractLights(template.steps),
      workflow: template.steps,
    };

    this.coordinations.set(coordination.id, coordination);
    return coordination;
  }

  /**
   * Get orchestrator for a specific light
   */
  getOrchestrator(light: TrinityLight): any {
    switch (light) {
      case TrinityLight.RED:
        return this.redLight;
      case TrinityLight.GREEN:
        return this.greenLight;
      case TrinityLight.YELLOW:
        return this.yellowLight;
    }
  }

  /**
   * Get overall Trinity system health
   */
  async getSystemHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    lights: {
      redlight: any;
      greenlight: any;
      yellowlight: any;
    };
  }> {
    const [redHealth, greenHealth, yellowHealth] = await Promise.all([
      this.redLight.checkHealth('system').catch(() => ({ status: 'down' })),
      this.greenLight.checkHealth().catch(() => ({ status: 'down' })),
      this.yellowLight.performHealthCheck('system').catch(() => ({ status: 'down' })),
    ]);

    const allHealthy = [redHealth, greenHealth, yellowHealth].every(
      (h: any) => h.status === 'healthy'
    );
    const anyDown = [redHealth, greenHealth, yellowHealth].some(
      (h: any) => h.status === 'down'
    );

    return {
      status: anyDown ? 'down' : allHealthy ? 'healthy' : 'degraded',
      lights: {
        redlight: redHealth,
        greenlight: greenHealth,
        yellowlight: yellowHealth,
      },
    };
  }

  // Workflow templates initialization

  private initializeWorkflowTemplates(): void {
    // Template: Deploy Earth Template
    this.workflowTemplates.set('deploy-earth-template', {
      id: 'deploy-earth-template',
      name: 'Deploy Earth Template',
      description: 'Complete workflow to create and deploy Earth 3D template',
      steps: [
        {
          id: 'create-greenlight-task',
          light: TrinityLight.GREEN,
          action: 'Create deployment task',
        },
        {
          id: 'create-redlight-template',
          light: TrinityLight.RED,
          action: 'Create Earth template',
          depends_on: ['create-greenlight-task'],
        },
        {
          id: 'deploy-to-cloudflare',
          light: TrinityLight.YELLOW,
          action: 'Deploy to Cloudflare Pages',
          depends_on: ['create-redlight-template'],
        },
        {
          id: 'configure-dns',
          light: TrinityLight.YELLOW,
          action: 'Configure DNS',
          depends_on: ['deploy-to-cloudflare'],
        },
        {
          id: 'complete-greenlight-task',
          light: TrinityLight.GREEN,
          action: 'Mark deployment complete',
          depends_on: ['configure-dns'],
        },
      ],
    });

    // Template: API Service Deployment
    this.workflowTemplates.set('deploy-api-service', {
      id: 'deploy-api-service',
      name: 'Deploy API Service',
      description: 'Deploy backend API service with monitoring',
      steps: [
        {
          id: 'create-deployment-task',
          light: TrinityLight.GREEN,
          action: 'Create deployment task',
        },
        {
          id: 'provision-infrastructure',
          light: TrinityLight.YELLOW,
          action: 'Provision Railway service',
          depends_on: ['create-deployment-task'],
        },
        {
          id: 'configure-database',
          light: TrinityLight.YELLOW,
          action: 'Configure database connection',
          depends_on: ['provision-infrastructure'],
        },
        {
          id: 'deploy-service',
          light: TrinityLight.YELLOW,
          action: 'Deploy service to platform',
          depends_on: ['configure-database'],
        },
        {
          id: 'health-check',
          light: TrinityLight.YELLOW,
          action: 'Run health checks',
          depends_on: ['deploy-service'],
        },
        {
          id: 'update-greenlight',
          light: TrinityLight.GREEN,
          action: 'Mark deployment complete',
          depends_on: ['health-check'],
        },
      ],
    });

    // Template: Full Stack Feature
    this.workflowTemplates.set('deploy-full-stack-feature', {
      id: 'deploy-full-stack-feature',
      name: 'Deploy Full Stack Feature',
      description: 'Deploy a complete feature with frontend, backend, and tracking',
      steps: [
        {
          id: 'create-feature-epic',
          light: TrinityLight.GREEN,
          action: 'Create feature epic and tasks',
        },
        {
          id: 'create-ui-template',
          light: TrinityLight.RED,
          action: 'Create UI template',
          depends_on: ['create-feature-epic'],
          parallel: true,
        },
        {
          id: 'provision-api',
          light: TrinityLight.YELLOW,
          action: 'Provision API service',
          depends_on: ['create-feature-epic'],
          parallel: true,
        },
        {
          id: 'deploy-ui',
          light: TrinityLight.RED,
          action: 'Deploy UI to Cloudflare',
          depends_on: ['create-ui-template'],
        },
        {
          id: 'deploy-api',
          light: TrinityLight.YELLOW,
          action: 'Deploy API to Railway',
          depends_on: ['provision-api'],
        },
        {
          id: 'integration-test',
          light: TrinityLight.YELLOW,
          action: 'Run integration tests',
          depends_on: ['deploy-ui', 'deploy-api'],
        },
        {
          id: 'complete-feature',
          light: TrinityLight.GREEN,
          action: 'Mark feature complete',
          depends_on: ['integration-test'],
        },
      ],
    });
  }

  // Helper methods

  private setupEventForwarding(): void {
    // Forward events from each light to the main orchestrator
    this.redLight.on('*', (event: string, ...args: any[]) => {
      this.emit(`redlight:${event}`, ...args);
    });

    this.greenLight.on('*', (event: string, ...args: any[]) => {
      this.emit(`greenlight:${event}`, ...args);
    });

    this.yellowLight.on('*', (event: string, ...args: any[]) => {
      this.emit(`yellowlight:${event}`, ...args);
    });
  }

  private extractLights(steps: TrinityWorkflowStep[]): TrinityLight[] {
    const lights = new Set(steps.map((s) => s.light));
    return Array.from(lights);
  }

  private generateTaskId(): string {
    return `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCoordinationId(): string {
    return `coord-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
