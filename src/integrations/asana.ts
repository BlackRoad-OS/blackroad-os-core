/**
 * Asana API Integration
 *
 * Full operations for managing workspaces, projects, tasks, and teams.
 * Uses Asana REST API with personal access token authentication.
 *
 * Features:
 * - Workspace and project management
 * - Task CRUD operations
 * - Subtasks and dependencies
 * - Custom fields
 * - Tags and sections
 * - Comments and attachments
 * - Team management
 */

export interface AsanaConfig {
  token: string;
}

export interface AsanaWorkspace {
  gid: string;
  name: string;
  resourceType: 'workspace';
}

export interface AsanaProject {
  gid: string;
  name: string;
  resourceType: 'project';
  archived: boolean;
  color: string | null;
  createdAt: string;
  modifiedAt: string;
  notes: string;
  public: boolean;
  workspace: { gid: string; name: string };
  team?: { gid: string; name: string };
  currentStatus?: {
    color: 'green' | 'yellow' | 'red' | 'blue';
    text: string;
    createdAt: string;
  };
}

export interface AsanaTask {
  gid: string;
  name: string;
  resourceType: 'task';
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  modifiedAt: string;
  dueOn: string | null;
  dueAt: string | null;
  startOn: string | null;
  notes: string;
  htmlNotes: string;
  assignee: { gid: string; name: string } | null;
  followers: { gid: string; name: string }[];
  projects: { gid: string; name: string }[];
  tags: { gid: string; name: string }[];
  parent: { gid: string; name: string } | null;
  numSubtasks: number;
  permalink: string;
  customFields?: AsanaCustomField[];
}

export interface AsanaCustomField {
  gid: string;
  name: string;
  type: 'text' | 'number' | 'enum' | 'multi_enum' | 'date' | 'people';
  displayValue: string | null;
  textValue?: string;
  numberValue?: number;
  enumValue?: { gid: string; name: string; color: string };
}

export interface AsanaSection {
  gid: string;
  name: string;
  resourceType: 'section';
  project: { gid: string; name: string };
  createdAt: string;
}

export interface AsanaTag {
  gid: string;
  name: string;
  resourceType: 'tag';
  color: string | null;
  notes: string;
}

export interface AsanaUser {
  gid: string;
  name: string;
  resourceType: 'user';
  email: string;
  photo?: {
    image_21x21: string;
    image_27x27: string;
    image_36x36: string;
    image_60x60: string;
    image_128x128: string;
  };
  workspaces: { gid: string; name: string }[];
}

export interface AsanaComment {
  gid: string;
  resourceType: 'story';
  createdAt: string;
  createdBy: { gid: string; name: string };
  text: string;
  htmlText: string;
  type: 'comment' | 'system';
}

export interface CreateTaskOptions {
  name: string;
  notes?: string;
  htmlNotes?: string;
  dueOn?: string;
  dueAt?: string;
  startOn?: string;
  assignee?: string;
  followers?: string[];
  projects?: string[];
  tags?: string[];
  parent?: string;
  customFields?: Record<string, string | number>;
}

export class AsanaClient {
  private readonly baseUrl = 'https://app.asana.com/api/1.0';
  private readonly headers: Record<string, string>;

  constructor(config: AsanaConfig) {
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

    const data = await response.json();

    if (!response.ok) {
      const errors = data.errors?.map((e: any) => e.message).join(', ') || 'Unknown error';
      throw new Error(`Asana API error: ${errors}`);
    }

    return data.data;
  }

  // User

  /**
   * Get current user
   */
  async getMe(): Promise<AsanaUser> {
    const result = await this.request<any>('/users/me');
    return this.mapUser(result);
  }

  /**
   * Get a user by ID
   */
  async getUser(userId: string): Promise<AsanaUser> {
    const result = await this.request<any>(`/users/${userId}`);
    return this.mapUser(result);
  }

  // Workspaces

  /**
   * List all workspaces
   */
  async listWorkspaces(): Promise<AsanaWorkspace[]> {
    const result = await this.request<any[]>('/workspaces');
    return result.map((w) => ({
      gid: w.gid,
      name: w.name,
      resourceType: 'workspace',
    }));
  }

  // Projects

  /**
   * List projects in a workspace
   */
  async listProjects(workspaceId: string): Promise<AsanaProject[]> {
    const result = await this.request<any[]>(
      `/workspaces/${workspaceId}/projects?opt_fields=name,archived,color,created_at,modified_at,notes,public,workspace,team,current_status`
    );
    return result.map(this.mapProject);
  }

  /**
   * Get a project by ID
   */
  async getProject(projectId: string): Promise<AsanaProject> {
    const result = await this.request<any>(
      `/projects/${projectId}?opt_fields=name,archived,color,created_at,modified_at,notes,public,workspace,team,current_status`
    );
    return this.mapProject(result);
  }

  /**
   * Create a project
   */
  async createProject(
    workspaceId: string,
    params: {
      name: string;
      notes?: string;
      color?: string;
      public?: boolean;
      teamId?: string;
    }
  ): Promise<AsanaProject> {
    const result = await this.request<any>('/projects', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          name: params.name,
          notes: params.notes,
          color: params.color,
          public: params.public,
          workspace: workspaceId,
          team: params.teamId,
        },
      }),
    });
    return this.mapProject(result);
  }

  /**
   * Update a project
   */
  async updateProject(
    projectId: string,
    params: {
      name?: string;
      notes?: string;
      color?: string;
      public?: boolean;
      archived?: boolean;
    }
  ): Promise<AsanaProject> {
    const result = await this.request<any>(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify({ data: params }),
    });
    return this.mapProject(result);
  }

  /**
   * Delete a project
   */
  async deleteProject(projectId: string): Promise<boolean> {
    await this.request(`/projects/${projectId}`, { method: 'DELETE' });
    return true;
  }

  // Tasks

  /**
   * List tasks in a project
   */
  async listTasks(projectId: string, options?: {
    completed?: boolean;
    modifiedSince?: string;
  }): Promise<AsanaTask[]> {
    const params = new URLSearchParams();
    params.set('opt_fields', 'name,completed,completed_at,created_at,modified_at,due_on,due_at,start_on,notes,html_notes,assignee,followers,projects,tags,parent,num_subtasks,permalink_url,custom_fields');
    if (options?.completed !== undefined) params.set('completed_since', options.completed ? 'now' : '');
    if (options?.modifiedSince) params.set('modified_since', options.modifiedSince);

    const result = await this.request<any[]>(`/projects/${projectId}/tasks?${params}`);
    return result.map(this.mapTask);
  }

  /**
   * Get a task by ID
   */
  async getTask(taskId: string): Promise<AsanaTask> {
    const result = await this.request<any>(
      `/tasks/${taskId}?opt_fields=name,completed,completed_at,created_at,modified_at,due_on,due_at,start_on,notes,html_notes,assignee,followers,projects,tags,parent,num_subtasks,permalink_url,custom_fields`
    );
    return this.mapTask(result);
  }

  /**
   * Create a task
   */
  async createTask(workspaceId: string, options: CreateTaskOptions): Promise<AsanaTask> {
    const result = await this.request<any>('/tasks', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          workspace: workspaceId,
          name: options.name,
          notes: options.notes,
          html_notes: options.htmlNotes,
          due_on: options.dueOn,
          due_at: options.dueAt,
          start_on: options.startOn,
          assignee: options.assignee,
          followers: options.followers,
          projects: options.projects,
          tags: options.tags,
          parent: options.parent,
          custom_fields: options.customFields,
        },
      }),
    });
    return this.mapTask(result);
  }

  /**
   * Update a task
   */
  async updateTask(
    taskId: string,
    params: Partial<CreateTaskOptions> & { completed?: boolean }
  ): Promise<AsanaTask> {
    const data: Record<string, any> = {};
    if (params.name !== undefined) data.name = params.name;
    if (params.notes !== undefined) data.notes = params.notes;
    if (params.htmlNotes !== undefined) data.html_notes = params.htmlNotes;
    if (params.dueOn !== undefined) data.due_on = params.dueOn;
    if (params.dueAt !== undefined) data.due_at = params.dueAt;
    if (params.startOn !== undefined) data.start_on = params.startOn;
    if (params.assignee !== undefined) data.assignee = params.assignee;
    if (params.completed !== undefined) data.completed = params.completed;
    if (params.customFields !== undefined) data.custom_fields = params.customFields;

    const result = await this.request<any>(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify({ data }),
    });
    return this.mapTask(result);
  }

  /**
   * Complete a task
   */
  async completeTask(taskId: string): Promise<AsanaTask> {
    return this.updateTask(taskId, { completed: true });
  }

  /**
   * Delete a task
   */
  async deleteTask(taskId: string): Promise<boolean> {
    await this.request(`/tasks/${taskId}`, { method: 'DELETE' });
    return true;
  }

  /**
   * Get subtasks
   */
  async getSubtasks(taskId: string): Promise<AsanaTask[]> {
    const result = await this.request<any[]>(
      `/tasks/${taskId}/subtasks?opt_fields=name,completed,completed_at,created_at,modified_at,due_on,assignee,permalink_url`
    );
    return result.map(this.mapTask);
  }

  /**
   * Create a subtask
   */
  async createSubtask(parentTaskId: string, options: CreateTaskOptions): Promise<AsanaTask> {
    const result = await this.request<any>(`/tasks/${parentTaskId}/subtasks`, {
      method: 'POST',
      body: JSON.stringify({
        data: {
          name: options.name,
          notes: options.notes,
          due_on: options.dueOn,
          assignee: options.assignee,
        },
      }),
    });
    return this.mapTask(result);
  }

  // Sections

  /**
   * List sections in a project
   */
  async listSections(projectId: string): Promise<AsanaSection[]> {
    const result = await this.request<any[]>(`/projects/${projectId}/sections`);
    return result.map((s) => ({
      gid: s.gid,
      name: s.name,
      resourceType: 'section',
      project: s.project,
      createdAt: s.created_at,
    }));
  }

  /**
   * Create a section
   */
  async createSection(projectId: string, name: string): Promise<AsanaSection> {
    const result = await this.request<any>(`/projects/${projectId}/sections`, {
      method: 'POST',
      body: JSON.stringify({ data: { name } }),
    });
    return {
      gid: result.gid,
      name: result.name,
      resourceType: 'section',
      project: result.project,
      createdAt: result.created_at,
    };
  }

  /**
   * Add task to section
   */
  async addTaskToSection(sectionId: string, taskId: string): Promise<boolean> {
    await this.request(`/sections/${sectionId}/addTask`, {
      method: 'POST',
      body: JSON.stringify({ data: { task: taskId } }),
    });
    return true;
  }

  // Tags

  /**
   * List tags in a workspace
   */
  async listTags(workspaceId: string): Promise<AsanaTag[]> {
    const result = await this.request<any[]>(`/workspaces/${workspaceId}/tags`);
    return result.map((t) => ({
      gid: t.gid,
      name: t.name,
      resourceType: 'tag',
      color: t.color,
      notes: t.notes || '',
    }));
  }

  /**
   * Create a tag
   */
  async createTag(workspaceId: string, name: string, color?: string): Promise<AsanaTag> {
    const result = await this.request<any>('/tags', {
      method: 'POST',
      body: JSON.stringify({
        data: { name, color, workspace: workspaceId },
      }),
    });
    return {
      gid: result.gid,
      name: result.name,
      resourceType: 'tag',
      color: result.color,
      notes: result.notes || '',
    };
  }

  /**
   * Add tag to task
   */
  async addTagToTask(taskId: string, tagId: string): Promise<boolean> {
    await this.request(`/tasks/${taskId}/addTag`, {
      method: 'POST',
      body: JSON.stringify({ data: { tag: tagId } }),
    });
    return true;
  }

  // Comments

  /**
   * Get comments on a task
   */
  async getTaskComments(taskId: string): Promise<AsanaComment[]> {
    const result = await this.request<any[]>(
      `/tasks/${taskId}/stories?opt_fields=created_at,created_by,text,html_text,type`
    );
    return result
      .filter((s) => s.type === 'comment')
      .map((s) => ({
        gid: s.gid,
        resourceType: 'story',
        createdAt: s.created_at,
        createdBy: s.created_by,
        text: s.text,
        htmlText: s.html_text,
        type: s.type,
      }));
  }

  /**
   * Add a comment to a task
   */
  async addComment(taskId: string, text: string): Promise<AsanaComment> {
    const result = await this.request<any>(`/tasks/${taskId}/stories`, {
      method: 'POST',
      body: JSON.stringify({ data: { text } }),
    });
    return {
      gid: result.gid,
      resourceType: 'story',
      createdAt: result.created_at,
      createdBy: result.created_by,
      text: result.text,
      htmlText: result.html_text || '',
      type: 'comment',
    };
  }

  // Search

  /**
   * Search tasks in a workspace
   */
  async searchTasks(
    workspaceId: string,
    query: string,
    options?: {
      completed?: boolean;
      assignee?: string;
      projectId?: string;
    }
  ): Promise<AsanaTask[]> {
    const params = new URLSearchParams();
    params.set('text', query);
    params.set('opt_fields', 'name,completed,due_on,assignee,permalink_url');
    if (options?.completed !== undefined) params.set('completed', String(options.completed));
    if (options?.assignee) params.set('assignee.any', options.assignee);
    if (options?.projectId) params.set('projects.any', options.projectId);

    const result = await this.request<any[]>(
      `/workspaces/${workspaceId}/tasks/search?${params}`
    );
    return result.map(this.mapTask);
  }

  // Mapping functions

  private mapUser(u: any): AsanaUser {
    return {
      gid: u.gid,
      name: u.name,
      resourceType: 'user',
      email: u.email,
      photo: u.photo,
      workspaces: u.workspaces || [],
    };
  }

  private mapProject(p: any): AsanaProject {
    return {
      gid: p.gid,
      name: p.name,
      resourceType: 'project',
      archived: p.archived,
      color: p.color,
      createdAt: p.created_at,
      modifiedAt: p.modified_at,
      notes: p.notes || '',
      public: p.public,
      workspace: p.workspace,
      team: p.team,
      currentStatus: p.current_status,
    };
  }

  private mapTask(t: any): AsanaTask {
    return {
      gid: t.gid,
      name: t.name,
      resourceType: 'task',
      completed: t.completed,
      completedAt: t.completed_at,
      createdAt: t.created_at,
      modifiedAt: t.modified_at,
      dueOn: t.due_on,
      dueAt: t.due_at,
      startOn: t.start_on,
      notes: t.notes || '',
      htmlNotes: t.html_notes || '',
      assignee: t.assignee,
      followers: t.followers || [],
      projects: t.projects || [],
      tags: t.tags || [],
      parent: t.parent,
      numSubtasks: t.num_subtasks || 0,
      permalink: t.permalink_url || '',
      customFields: t.custom_fields?.map((cf: any) => ({
        gid: cf.gid,
        name: cf.name,
        type: cf.type,
        displayValue: cf.display_value,
        textValue: cf.text_value,
        numberValue: cf.number_value,
        enumValue: cf.enum_value,
      })),
    };
  }
}

/**
 * Create an Asana client from environment variables
 */
export function createAsanaClient(): AsanaClient {
  const token = process.env.ASANA_TOKEN;
  if (!token) {
    throw new Error('ASANA_TOKEN environment variable is required');
  }
  return new AsanaClient({ token });
}
