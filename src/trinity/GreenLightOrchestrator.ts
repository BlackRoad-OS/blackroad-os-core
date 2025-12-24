/**
 * GreenLight Orchestrator
 * 
 * Manages project management template lifecycle:
 * - Task and project state management
 * - Workflow coordination
 * - Team collaboration tracking
 * - Progress monitoring
 */

import { EventEmitter } from 'events';
import {
  TrinityLight,
  GreenLightTemplate,
  GreenLightState,
  TemplateHealth,
} from './types';

export class GreenLightOrchestrator extends EventEmitter {
  private templates: Map<string, GreenLightTemplate> = new Map();
  private stateHistory: Map<string, GreenLightState[]> = new Map();

  constructor() {
    super();
  }

  /**
   * Load GreenLight templates from .trinity/greenlight/scripts/
   */
  async loadTemplates(scriptsPath: string): Promise<void> {
    this.emit('templates:loading', { path: scriptsPath });
    
    // TODO: Parse memory-greenlight-templates.sh and extract template functions
    
    this.emit('templates:loaded', { count: this.templates.size });
  }

  /**
   * Create a new GreenLight task/item
   */
  async createTask(
    name: string,
    description: string,
    scale: string = '👉', // micro
    domain: string = '🛣️', // platform
    priority: string = '📌', // medium
    effort: string = '🍖' // medium
  ): Promise<GreenLightTemplate> {
    const template: GreenLightTemplate = {
      id: this.generateTemplateId(name),
      light: TrinityLight.GREEN,
      name,
      description,
      state: GreenLightState.INBOX,
      scale,
      domain,
      priority,
      effort,
      version: '1.0.0',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      metadata: {},
    };

    this.templates.set(template.id, template);
    this.initializeStateHistory(template.id);
    this.emit('task:created', template);

    return template;
  }

  /**
   * Transition a task to a new state
   */
  async transitionState(
    templateId: string,
    newState: GreenLightState,
    reason?: string
  ): Promise<GreenLightTemplate> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    const oldState = template.state;
    
    // Validate state transition
    this.validateStateTransition(oldState, newState);

    // Update template
    const updated = {
      ...template,
      state: newState,
      updated_at: new Date().toISOString(),
    };

    this.templates.set(templateId, updated);
    
    // Record state history
    const history = this.stateHistory.get(templateId) || [];
    history.push(newState);
    this.stateHistory.set(templateId, history);

    this.emit('state:transitioned', {
      template: updated,
      oldState,
      newState,
      reason,
    });

    return updated;
  }

  /**
   * Assign a task to someone
   */
  async assignTask(
    templateId: string,
    assignee: string
  ): Promise<GreenLightTemplate> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    const updated = {
      ...template,
      assigned_to: assignee,
      updated_at: new Date().toISOString(),
    };

    this.templates.set(templateId, updated);
    this.emit('task:assigned', { template: updated, assignee });

    return updated;
  }

  /**
   * Update task priority
   */
  async updatePriority(
    templateId: string,
    priority: string
  ): Promise<GreenLightTemplate> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    const updated = {
      ...template,
      priority,
      updated_at: new Date().toISOString(),
    };

    this.templates.set(templateId, updated);
    this.emit('task:priority-updated', { template: updated, priority });

    return updated;
  }

  /**
   * Link task to project/epic
   */
  async linkToProject(
    templateId: string,
    project: string,
    epic?: string
  ): Promise<GreenLightTemplate> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    const updated = {
      ...template,
      project,
      epic,
      updated_at: new Date().toISOString(),
    };

    this.templates.set(templateId, updated);
    this.emit('task:linked', { template: updated, project, epic });

    return updated;
  }

  /**
   * Get tasks by state
   */
  getTasksByState(state: GreenLightState): GreenLightTemplate[] {
    return Array.from(this.templates.values()).filter((t) => t.state === state);
  }

  /**
   * Get tasks by assignee
   */
  getTasksByAssignee(assignee: string): GreenLightTemplate[] {
    return Array.from(this.templates.values()).filter(
      (t) => t.assigned_to === assignee
    );
  }

  /**
   * Get tasks by project
   */
  getTasksByProject(project: string): GreenLightTemplate[] {
    return Array.from(this.templates.values()).filter(
      (t) => t.project === project
    );
  }

  /**
   * Get task state history
   */
  getStateHistory(templateId: string): GreenLightState[] {
    return this.stateHistory.get(templateId) || [];
  }

  /**
   * Check GreenLight system health
   */
  async checkHealth(templateId?: string): Promise<TemplateHealth> {
    if (templateId) {
      const template = this.templates.get(templateId);
      if (!template) {
        throw new Error(`Template not found: ${templateId}`);
      }

      const checks = [
        {
          name: 'Valid state',
          passed: Object.values(GreenLightState).includes(template.state),
        },
        {
          name: 'Has assignee or in backlog',
          passed:
            template.assigned_to !== undefined ||
            template.state === GreenLightState.BACKLOG ||
            template.state === GreenLightState.INBOX,
        },
      ];

      return {
        template_id: templateId,
        light: TrinityLight.GREEN,
        status: checks.every((c) => c.passed) ? 'healthy' : 'degraded',
        last_check: new Date().toISOString(),
        checks,
      };
    }

    // Overall system health
    const totalTasks = this.templates.size;
    const blockedTasks = this.getTasksByState(GreenLightState.BLOCKED).length;
    const wipTasks = this.getTasksByState(GreenLightState.WIP).length;

    const checks = [
      {
        name: 'System responsive',
        passed: true,
      },
      {
        name: 'Blocked tasks manageable',
        passed: blockedTasks < totalTasks * 0.2, // Less than 20% blocked
      },
      {
        name: 'WIP manageable',
        passed: wipTasks < 10, // Less than 10 tasks in progress
      },
    ];

    return {
      template_id: 'system',
      light: TrinityLight.GREEN,
      status: checks.every((c) => c.passed) ? 'healthy' : 'degraded',
      last_check: new Date().toISOString(),
      checks,
    };
  }

  /**
   * List all tasks
   */
  listTasks(): GreenLightTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get a specific task
   */
  getTask(templateId: string): GreenLightTemplate | undefined {
    return this.templates.get(templateId);
  }

  // Helper methods

  private generateTemplateId(name: string): string {
    const base = name.toLowerCase().replace(/\s+/g, '-');
    const timestamp = Date.now();
    return `greenlight-${base}-${timestamp}`;
  }

  private initializeStateHistory(templateId: string): void {
    this.stateHistory.set(templateId, [GreenLightState.INBOX]);
  }

  private validateStateTransition(
    from: GreenLightState,
    to: GreenLightState
  ): void {
    // Define valid transitions
    const validTransitions: Record<GreenLightState, GreenLightState[]> = {
      [GreenLightState.VOID]: [GreenLightState.INBOX],
      [GreenLightState.INBOX]: [
        GreenLightState.BACKLOG,
        GreenLightState.TODO,
        GreenLightState.ARCHIVED,
      ],
      [GreenLightState.BACKLOG]: [
        GreenLightState.TODO,
        GreenLightState.ARCHIVED,
      ],
      [GreenLightState.TODO]: [
        GreenLightState.WIP,
        GreenLightState.BACKLOG,
        GreenLightState.ARCHIVED,
      ],
      [GreenLightState.WIP]: [
        GreenLightState.REVIEW,
        GreenLightState.BLOCKED,
        GreenLightState.DONE,
        GreenLightState.TODO,
      ],
      [GreenLightState.REVIEW]: [
        GreenLightState.DONE,
        GreenLightState.WIP,
        GreenLightState.BLOCKED,
      ],
      [GreenLightState.BLOCKED]: [
        GreenLightState.WIP,
        GreenLightState.TODO,
        GreenLightState.ARCHIVED,
      ],
      [GreenLightState.DONE]: [GreenLightState.ARCHIVED, GreenLightState.WIP],
      [GreenLightState.ARCHIVED]: [], // No transitions from archived
    };

    const allowed = validTransitions[from] || [];
    if (!allowed.includes(to)) {
      throw new Error(
        `Invalid state transition: ${from} -> ${to}. Allowed: ${allowed.join(', ')}`
      );
    }
  }
}
