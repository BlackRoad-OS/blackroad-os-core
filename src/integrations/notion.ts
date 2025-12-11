/**
 * Notion API Integration
 *
 * Full operations for managing pages, databases, and blocks.
 * Uses Notion REST API with integration token authentication.
 *
 * Features:
 * - Database queries and creation
 * - Page management
 * - Block manipulation
 * - Search functionality
 * - User management
 * - Comments
 */

export interface NotionConfig {
  token: string;
}

export interface NotionUser {
  id: string;
  type: 'person' | 'bot';
  name: string | null;
  avatarUrl: string | null;
  email?: string;
}

export interface NotionDatabase {
  id: string;
  title: string;
  description: string | null;
  icon: { type: string; emoji?: string; external?: { url: string } } | null;
  cover: { type: string; external?: { url: string } } | null;
  properties: Record<string, NotionProperty>;
  url: string;
  createdTime: string;
  lastEditedTime: string;
  archived: boolean;
}

export interface NotionProperty {
  id: string;
  type: string;
  name: string;
}

export interface NotionPage {
  id: string;
  parentType: 'database_id' | 'page_id' | 'workspace';
  parentId: string;
  archived: boolean;
  icon: { type: string; emoji?: string; external?: { url: string } } | null;
  cover: { type: string; external?: { url: string } } | null;
  properties: Record<string, any>;
  url: string;
  createdTime: string;
  lastEditedTime: string;
  createdBy: { id: string };
  lastEditedBy: { id: string };
}

export interface NotionBlock {
  id: string;
  type: string;
  hasChildren: boolean;
  archived: boolean;
  createdTime: string;
  lastEditedTime: string;
  content: any;
}

export interface NotionSearchResult {
  id: string;
  type: 'page' | 'database';
  title: string;
  url: string;
  lastEditedTime: string;
}

export interface QueryDatabaseOptions {
  filter?: any;
  sorts?: { property: string; direction: 'ascending' | 'descending' }[];
  startCursor?: string;
  pageSize?: number;
}

export class NotionClient {
  private readonly baseUrl = 'https://api.notion.com/v1';
  private readonly headers: Record<string, string>;

  constructor(config: NotionConfig) {
    this.headers = {
      'Authorization': `Bearer ${config.token}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
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
      throw new Error(`Notion API error: ${data.message || response.statusText}`);
    }

    return data;
  }

  // Users

  /**
   * Get current bot user
   */
  async getMe(): Promise<NotionUser> {
    const result = await this.request<any>('/users/me');
    return this.mapUser(result);
  }

  /**
   * List all users
   */
  async listUsers(): Promise<NotionUser[]> {
    const result = await this.request<{ results: any[] }>('/users');
    return result.results.map(this.mapUser);
  }

  /**
   * Get a user by ID
   */
  async getUser(userId: string): Promise<NotionUser> {
    const result = await this.request<any>(`/users/${userId}`);
    return this.mapUser(result);
  }

  // Databases

  /**
   * Get a database
   */
  async getDatabase(databaseId: string): Promise<NotionDatabase> {
    const result = await this.request<any>(`/databases/${databaseId}`);
    return this.mapDatabase(result);
  }

  /**
   * Query a database
   */
  async queryDatabase(
    databaseId: string,
    options: QueryDatabaseOptions = {}
  ): Promise<{ results: NotionPage[]; hasMore: boolean; nextCursor: string | null }> {
    const body: any = {};
    if (options.filter) body.filter = options.filter;
    if (options.sorts) body.sorts = options.sorts;
    if (options.startCursor) body.start_cursor = options.startCursor;
    if (options.pageSize) body.page_size = options.pageSize;

    const result = await this.request<any>(`/databases/${databaseId}/query`, {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return {
      results: result.results.map(this.mapPage),
      hasMore: result.has_more,
      nextCursor: result.next_cursor,
    };
  }

  /**
   * Create a database
   */
  async createDatabase(params: {
    parentPageId: string;
    title: string;
    properties: Record<string, { type: string; [key: string]: any }>;
    icon?: { type: 'emoji'; emoji: string };
  }): Promise<NotionDatabase> {
    const result = await this.request<any>('/databases', {
      method: 'POST',
      body: JSON.stringify({
        parent: { type: 'page_id', page_id: params.parentPageId },
        title: [{ type: 'text', text: { content: params.title } }],
        properties: params.properties,
        icon: params.icon,
      }),
    });
    return this.mapDatabase(result);
  }

  // Pages

  /**
   * Get a page
   */
  async getPage(pageId: string): Promise<NotionPage> {
    const result = await this.request<any>(`/pages/${pageId}`);
    return this.mapPage(result);
  }

  /**
   * Create a page
   */
  async createPage(params: {
    parentDatabaseId?: string;
    parentPageId?: string;
    properties: Record<string, any>;
    children?: any[];
    icon?: { type: 'emoji'; emoji: string } | { type: 'external'; external: { url: string } };
    cover?: { type: 'external'; external: { url: string } };
  }): Promise<NotionPage> {
    const parent = params.parentDatabaseId
      ? { type: 'database_id', database_id: params.parentDatabaseId }
      : { type: 'page_id', page_id: params.parentPageId };

    const result = await this.request<any>('/pages', {
      method: 'POST',
      body: JSON.stringify({
        parent,
        properties: params.properties,
        children: params.children,
        icon: params.icon,
        cover: params.cover,
      }),
    });
    return this.mapPage(result);
  }

  /**
   * Update a page
   */
  async updatePage(
    pageId: string,
    params: {
      properties?: Record<string, any>;
      icon?: { type: 'emoji'; emoji: string } | { type: 'external'; external: { url: string } } | null;
      cover?: { type: 'external'; external: { url: string } } | null;
      archived?: boolean;
    }
  ): Promise<NotionPage> {
    const result = await this.request<any>(`/pages/${pageId}`, {
      method: 'PATCH',
      body: JSON.stringify(params),
    });
    return this.mapPage(result);
  }

  /**
   * Archive (delete) a page
   */
  async archivePage(pageId: string): Promise<NotionPage> {
    return this.updatePage(pageId, { archived: true });
  }

  // Blocks

  /**
   * Get block children
   */
  async getBlockChildren(
    blockId: string,
    options?: { startCursor?: string; pageSize?: number }
  ): Promise<{ results: NotionBlock[]; hasMore: boolean; nextCursor: string | null }> {
    const params = new URLSearchParams();
    if (options?.startCursor) params.set('start_cursor', options.startCursor);
    if (options?.pageSize) params.set('page_size', String(options.pageSize));

    const result = await this.request<any>(
      `/blocks/${blockId}/children${params.toString() ? '?' + params : ''}`
    );

    return {
      results: result.results.map(this.mapBlock),
      hasMore: result.has_more,
      nextCursor: result.next_cursor,
    };
  }

  /**
   * Append block children
   */
  async appendBlockChildren(
    blockId: string,
    children: any[]
  ): Promise<{ results: NotionBlock[] }> {
    const result = await this.request<any>(`/blocks/${blockId}/children`, {
      method: 'PATCH',
      body: JSON.stringify({ children }),
    });
    return { results: result.results.map(this.mapBlock) };
  }

  /**
   * Delete a block
   */
  async deleteBlock(blockId: string): Promise<boolean> {
    await this.request(`/blocks/${blockId}`, { method: 'DELETE' });
    return true;
  }

  // Search

  /**
   * Search pages and databases
   */
  async search(params?: {
    query?: string;
    filter?: { value: 'page' | 'database'; property: 'object' };
    sort?: { direction: 'ascending' | 'descending'; timestamp: 'last_edited_time' };
    startCursor?: string;
    pageSize?: number;
  }): Promise<{ results: NotionSearchResult[]; hasMore: boolean; nextCursor: string | null }> {
    const result = await this.request<any>('/search', {
      method: 'POST',
      body: JSON.stringify({
        query: params?.query,
        filter: params?.filter,
        sort: params?.sort,
        start_cursor: params?.startCursor,
        page_size: params?.pageSize,
      }),
    });

    return {
      results: result.results.map((r: any) => ({
        id: r.id,
        type: r.object,
        title: this.extractTitle(r),
        url: r.url,
        lastEditedTime: r.last_edited_time,
      })),
      hasMore: result.has_more,
      nextCursor: result.next_cursor,
    };
  }

  // Helper: Create rich text
  createRichText(content: string): any[] {
    return [{ type: 'text', text: { content } }];
  }

  // Helper: Create common block types
  createParagraphBlock(text: string): any {
    return {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: this.createRichText(text),
      },
    };
  }

  createHeadingBlock(text: string, level: 1 | 2 | 3): any {
    const type = `heading_${level}` as const;
    return {
      object: 'block',
      type,
      [type]: {
        rich_text: this.createRichText(text),
      },
    };
  }

  createBulletedListBlock(text: string): any {
    return {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: this.createRichText(text),
      },
    };
  }

  createTodoBlock(text: string, checked = false): any {
    return {
      object: 'block',
      type: 'to_do',
      to_do: {
        rich_text: this.createRichText(text),
        checked,
      },
    };
  }

  createCodeBlock(code: string, language = 'plain text'): any {
    return {
      object: 'block',
      type: 'code',
      code: {
        rich_text: this.createRichText(code),
        language,
      },
    };
  }

  // Mapping functions

  private extractTitle(obj: any): string {
    if (obj.title) {
      return obj.title.map((t: any) => t.plain_text).join('');
    }
    if (obj.properties?.title) {
      return obj.properties.title.title?.map((t: any) => t.plain_text).join('') || '';
    }
    if (obj.properties?.Name) {
      return obj.properties.Name.title?.map((t: any) => t.plain_text).join('') || '';
    }
    return 'Untitled';
  }

  private mapUser(u: any): NotionUser {
    return {
      id: u.id,
      type: u.type,
      name: u.name,
      avatarUrl: u.avatar_url,
      email: u.person?.email,
    };
  }

  private mapDatabase(db: any): NotionDatabase {
    return {
      id: db.id,
      title: db.title.map((t: any) => t.plain_text).join(''),
      description: db.description?.map((d: any) => d.plain_text).join('') || null,
      icon: db.icon,
      cover: db.cover,
      properties: Object.fromEntries(
        Object.entries(db.properties).map(([name, prop]: [string, any]) => [
          name,
          { id: prop.id, type: prop.type, name },
        ])
      ),
      url: db.url,
      createdTime: db.created_time,
      lastEditedTime: db.last_edited_time,
      archived: db.archived,
    };
  }

  private mapPage(p: any): NotionPage {
    const parent = p.parent;
    let parentType: 'database_id' | 'page_id' | 'workspace';
    let parentId: string;

    if (parent.database_id) {
      parentType = 'database_id';
      parentId = parent.database_id;
    } else if (parent.page_id) {
      parentType = 'page_id';
      parentId = parent.page_id;
    } else {
      parentType = 'workspace';
      parentId = '';
    }

    return {
      id: p.id,
      parentType,
      parentId,
      archived: p.archived,
      icon: p.icon,
      cover: p.cover,
      properties: p.properties,
      url: p.url,
      createdTime: p.created_time,
      lastEditedTime: p.last_edited_time,
      createdBy: p.created_by,
      lastEditedBy: p.last_edited_by,
    };
  }

  private mapBlock(b: any): NotionBlock {
    return {
      id: b.id,
      type: b.type,
      hasChildren: b.has_children,
      archived: b.archived,
      createdTime: b.created_time,
      lastEditedTime: b.last_edited_time,
      content: b[b.type],
    };
  }
}

/**
 * Create a Notion client from environment variables
 */
export function createNotionClient(): NotionClient {
  const token = process.env.NOTION_TOKEN;
  if (!token) {
    throw new Error('NOTION_TOKEN environment variable is required');
  }
  return new NotionClient({ token });
}
