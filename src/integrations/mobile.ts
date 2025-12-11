/**
 * Mobile App Integrations
 *
 * Integration utilities for iOS mobile development apps:
 * - Warp (terminal)
 * - Shellfish (SSH client)
 * - Working Copy (Git client)
 * - Pyto (Python IDE)
 *
 * These integrations provide URL scheme handlers and
 * configuration generators for iOS app interoperability.
 */

// =============================================================================
// WARP TERMINAL INTEGRATION
// =============================================================================

export interface WarpConfig {
  theme?: string;
  font?: string;
  fontSize?: number;
  shellIntegration?: boolean;
  aiFeatures?: boolean;
}

export interface WarpSession {
  name: string;
  host: string;
  port?: number;
  user?: string;
  identityFile?: string;
  command?: string;
}

export class WarpClient {
  private config: WarpConfig;

  constructor(config: WarpConfig = {}) {
    this.config = {
      theme: config.theme || 'dark',
      font: config.font || 'JetBrains Mono',
      fontSize: config.fontSize || 13,
      shellIntegration: config.shellIntegration ?? true,
      aiFeatures: config.aiFeatures ?? true,
    };
  }

  /**
   * Generate URL scheme to open Warp with a command
   */
  openWithCommand(command: string): string {
    return `warp://action/new_tab?command=${encodeURIComponent(command)}`;
  }

  /**
   * Generate URL to open Warp to a specific directory
   */
  openDirectory(path: string): string {
    return `warp://action/new_tab?path=${encodeURIComponent(path)}`;
  }

  /**
   * Generate SSH connection command
   */
  sshCommand(session: WarpSession): string {
    let cmd = `ssh`;
    if (session.port && session.port !== 22) {
      cmd += ` -p ${session.port}`;
    }
    if (session.identityFile) {
      cmd += ` -i ${session.identityFile}`;
    }
    cmd += ` ${session.user || 'root'}@${session.host}`;
    if (session.command) {
      cmd += ` "${session.command}"`;
    }
    return cmd;
  }

  /**
   * Generate URL to open SSH session in Warp
   */
  openSSH(session: WarpSession): string {
    return this.openWithCommand(this.sshCommand(session));
  }

  /**
   * Generate Warp workflow configuration
   */
  generateWorkflow(name: string, steps: { command: string; description?: string }[]): object {
    return {
      name,
      steps: steps.map((step, index) => ({
        id: `step_${index + 1}`,
        command: step.command,
        description: step.description || `Step ${index + 1}`,
      })),
    };
  }

  /**
   * Generate Warp settings JSON
   */
  generateSettings(): object {
    return {
      theme: this.config.theme,
      font: {
        family: this.config.font,
        size: this.config.fontSize,
      },
      shell_integration: this.config.shellIntegration,
      ai: {
        enabled: this.config.aiFeatures,
      },
      keybindings: {
        new_tab: 'cmd+t',
        close_tab: 'cmd+w',
        split_pane_right: 'cmd+d',
        split_pane_down: 'cmd+shift+d',
      },
    };
  }
}

// =============================================================================
// SHELLFISH SSH CLIENT INTEGRATION
// =============================================================================

export interface ShellfishHost {
  name: string;
  hostname: string;
  port?: number;
  username: string;
  authMethod: 'password' | 'key' | 'agent';
  keyFile?: string;
  proxyJump?: string;
  localPortForward?: { localPort: number; remoteHost: string; remotePort: number }[];
  remotePortForward?: { remotePort: number; localHost: string; localPort: number }[];
}

export interface ShellfishSnippet {
  name: string;
  command: string;
  category?: string;
}

export class ShellfishClient {
  /**
   * Generate URL scheme to open Shellfish
   */
  open(): string {
    return 'shellfish://';
  }

  /**
   * Generate URL to connect to a host
   */
  connect(host: string, user?: string, port?: number): string {
    let url = `shellfish://connect?host=${encodeURIComponent(host)}`;
    if (user) url += `&user=${encodeURIComponent(user)}`;
    if (port) url += `&port=${port}`;
    return url;
  }

  /**
   * Generate SSH config entry for a host
   */
  generateSSHConfig(host: ShellfishHost): string {
    let config = `Host ${host.name}\n`;
    config += `  HostName ${host.hostname}\n`;
    config += `  User ${host.username}\n`;

    if (host.port && host.port !== 22) {
      config += `  Port ${host.port}\n`;
    }

    if (host.authMethod === 'key' && host.keyFile) {
      config += `  IdentityFile ${host.keyFile}\n`;
    }

    if (host.proxyJump) {
      config += `  ProxyJump ${host.proxyJump}\n`;
    }

    host.localPortForward?.forEach((fwd) => {
      config += `  LocalForward ${fwd.localPort} ${fwd.remoteHost}:${fwd.remotePort}\n`;
    });

    host.remotePortForward?.forEach((fwd) => {
      config += `  RemoteForward ${fwd.remotePort} ${fwd.localHost}:${fwd.localPort}\n`;
    });

    return config;
  }

  /**
   * Generate Shellfish hosts configuration
   */
  generateHostsConfig(hosts: ShellfishHost[]): object {
    return {
      version: 1,
      hosts: hosts.map((host) => ({
        name: host.name,
        hostname: host.hostname,
        port: host.port || 22,
        username: host.username,
        authentication: {
          method: host.authMethod,
          keyFile: host.keyFile,
        },
        tunnels: {
          local: host.localPortForward || [],
          remote: host.remotePortForward || [],
        },
      })),
    };
  }

  /**
   * Generate snippets configuration
   */
  generateSnippets(snippets: ShellfishSnippet[]): object {
    return {
      version: 1,
      snippets: snippets.map((snippet) => ({
        name: snippet.name,
        command: snippet.command,
        category: snippet.category || 'General',
      })),
    };
  }
}

// =============================================================================
// WORKING COPY GIT CLIENT INTEGRATION
// =============================================================================

export interface WorkingCopyRepo {
  name: string;
  url: string;
  branch?: string;
}

export class WorkingCopyClient {
  private readonly callbackUrl?: string;

  constructor(callbackUrl?: string) {
    this.callbackUrl = callbackUrl;
  }

  /**
   * Generate URL to open Working Copy
   */
  open(): string {
    return 'working-copy://';
  }

  /**
   * Generate URL to clone a repository
   */
  cloneRepo(url: string, name?: string): string {
    let wcUrl = `working-copy://clone?remote=${encodeURIComponent(url)}`;
    if (name) wcUrl += `&name=${encodeURIComponent(name)}`;
    if (this.callbackUrl) wcUrl += `&x-success=${encodeURIComponent(this.callbackUrl)}`;
    return wcUrl;
  }

  /**
   * Generate URL to open a specific repository
   */
  openRepo(name: string): string {
    return `working-copy://open?repo=${encodeURIComponent(name)}`;
  }

  /**
   * Generate URL to pull a repository
   */
  pullRepo(name: string): string {
    let url = `working-copy://pull?repo=${encodeURIComponent(name)}`;
    if (this.callbackUrl) url += `&x-success=${encodeURIComponent(this.callbackUrl)}`;
    return url;
  }

  /**
   * Generate URL to push a repository
   */
  pushRepo(name: string): string {
    let url = `working-copy://push?repo=${encodeURIComponent(name)}`;
    if (this.callbackUrl) url += `&x-success=${encodeURIComponent(this.callbackUrl)}`;
    return url;
  }

  /**
   * Generate URL to commit changes
   */
  commit(name: string, message: string): string {
    let url = `working-copy://commit?repo=${encodeURIComponent(name)}`;
    url += `&message=${encodeURIComponent(message)}`;
    if (this.callbackUrl) url += `&x-success=${encodeURIComponent(this.callbackUrl)}`;
    return url;
  }

  /**
   * Generate URL to checkout a branch
   */
  checkout(name: string, branch: string): string {
    return `working-copy://checkout?repo=${encodeURIComponent(name)}&branch=${encodeURIComponent(branch)}`;
  }

  /**
   * Generate URL to open a file
   */
  openFile(repo: string, path: string): string {
    return `working-copy://open?repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(path)}`;
  }

  /**
   * Generate URL to write content to a file
   */
  writeFile(repo: string, path: string, content: string): string {
    let url = `working-copy://write?repo=${encodeURIComponent(repo)}`;
    url += `&path=${encodeURIComponent(path)}`;
    url += `&text=${encodeURIComponent(content)}`;
    if (this.callbackUrl) url += `&x-success=${encodeURIComponent(this.callbackUrl)}`;
    return url;
  }

  /**
   * Generate URL to read a file (returns content via x-callback-url)
   */
  readFile(repo: string, path: string, callbackUrl: string): string {
    return `working-copy://read?repo=${encodeURIComponent(repo)}&path=${encodeURIComponent(path)}&x-success=${encodeURIComponent(callbackUrl)}`;
  }

  /**
   * Generate URL chain for git workflow
   */
  gitWorkflow(repo: string, commitMessage: string): {
    commit: string;
    push: string;
    full: string;
  } {
    return {
      commit: this.commit(repo, commitMessage),
      push: this.pushRepo(repo),
      full: `working-copy://chain?repo=${encodeURIComponent(repo)}&command=commit,push&message=${encodeURIComponent(commitMessage)}`,
    };
  }
}

// =============================================================================
// PYTO PYTHON IDE INTEGRATION
// =============================================================================

export interface PytoScript {
  name: string;
  code: string;
  runOnOpen?: boolean;
}

export class PytoClient {
  /**
   * Generate URL to open Pyto
   */
  open(): string {
    return 'pyto://';
  }

  /**
   * Generate URL to run Python code
   */
  runCode(code: string): string {
    return `pyto://code/${encodeURIComponent(code)}`;
  }

  /**
   * Generate URL to open a script by path
   */
  openScript(path: string): string {
    return `pyto://open?path=${encodeURIComponent(path)}`;
  }

  /**
   * Generate URL to run a script
   */
  runScript(path: string): string {
    return `pyto://run?path=${encodeURIComponent(path)}`;
  }

  /**
   * Generate Python script for API interaction
   */
  generateAPIScript(options: {
    baseUrl: string;
    endpoint: string;
    method?: string;
    headers?: Record<string, string>;
    body?: any;
  }): string {
    const method = options.method || 'GET';
    const headers = options.headers || {};

    let code = `import requests
import json

url = "${options.baseUrl}${options.endpoint}"
headers = ${JSON.stringify(headers, null, 2)}
`;

    if (options.body && ['POST', 'PUT', 'PATCH'].includes(method)) {
      code += `body = ${JSON.stringify(options.body, null, 2)}

response = requests.${method.toLowerCase()}(url, headers=headers, json=body)
`;
    } else {
      code += `
response = requests.${method.toLowerCase()}(url, headers=headers)
`;
    }

    code += `
print(f"Status: {response.status_code}")
print(json.dumps(response.json(), indent=2))
`;

    return code;
  }

  /**
   * Generate SSH deployment script
   */
  generateSSHScript(options: {
    host: string;
    user: string;
    commands: string[];
    keyPath?: string;
  }): string {
    return `import paramiko
import sys

# SSH Configuration
host = "${options.host}"
user = "${options.user}"
${options.keyPath ? `key_path = "${options.keyPath}"` : '# Using password authentication'}

# Commands to execute
commands = ${JSON.stringify(options.commands, null, 2)}

try:
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    ${options.keyPath
      ? 'client.connect(host, username=user, key_filename=key_path)'
      : '# client.connect(host, username=user, password="your_password")'}

    for cmd in commands:
        print(f"Running: {cmd}")
        stdin, stdout, stderr = client.exec_command(cmd)
        print(stdout.read().decode())
        err = stderr.read().decode()
        if err:
            print(f"Error: {err}", file=sys.stderr)

    client.close()
    print("Done!")
except Exception as e:
    print(f"Error: {e}", file=sys.stderr)
`;
  }

  /**
   * Generate health check script
   */
  generateHealthCheckScript(endpoints: { name: string; url: string }[]): string {
    return `import requests
from concurrent.futures import ThreadPoolExecutor
import time

endpoints = ${JSON.stringify(endpoints, null, 2)}

def check_health(endpoint):
    name = endpoint['name']
    url = endpoint['url']
    try:
        start = time.time()
        response = requests.get(url, timeout=10)
        elapsed = (time.time() - start) * 1000
        status = "OK" if response.ok else "FAIL"
        return f"{name}: {status} ({response.status_code}) - {elapsed:.0f}ms"
    except Exception as e:
        return f"{name}: ERROR - {str(e)}"

print("Health Check Results:")
print("-" * 50)

with ThreadPoolExecutor(max_workers=5) as executor:
    results = list(executor.map(check_health, endpoints))

for result in results:
    print(result)
`;
  }
}

// =============================================================================
// FACTORY FUNCTIONS
// =============================================================================

/**
 * Create a Warp client with optional configuration
 */
export function createWarpClient(config?: WarpConfig): WarpClient {
  return new WarpClient(config);
}

/**
 * Create a Shellfish client
 */
export function createShellfishClient(): ShellfishClient {
  return new ShellfishClient();
}

/**
 * Create a Working Copy client with optional callback URL
 */
export function createWorkingCopyClient(callbackUrl?: string): WorkingCopyClient {
  return new WorkingCopyClient(callbackUrl);
}

/**
 * Create a Pyto client
 */
export function createPytoClient(): PytoClient {
  return new PytoClient();
}

// =============================================================================
// UNIFIED MOBILE INTEGRATION
// =============================================================================

export interface MobileIntegration {
  warp: WarpClient;
  shellfish: ShellfishClient;
  workingCopy: WorkingCopyClient;
  pyto: PytoClient;
}

/**
 * Create all mobile integrations
 */
export function createMobileIntegrations(options?: {
  warpConfig?: WarpConfig;
  workingCopyCallback?: string;
}): MobileIntegration {
  return {
    warp: createWarpClient(options?.warpConfig),
    shellfish: createShellfishClient(),
    workingCopy: createWorkingCopyClient(options?.workingCopyCallback),
    pyto: createPytoClient(),
  };
}
