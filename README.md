# BlackRoad OS · Core

[![npm version](https://img.shields.io/npm/v/@blackroad/core.svg)](https://www.npmjs.com/package/@blackroad/core)
[![PyPI version](https://img.shields.io/pypi/v/blackroad-core.svg)](https://pypi.org/project/blackroad-core)
[![CI](https://github.com/blackroad-os/blackroad-os-core/actions/workflows/ci.yml/badge.svg)](https://github.com/blackroad-os/blackroad-os-core/actions/workflows/ci.yml)

🧠 **Main OS Brain** — The primary application kernel for BlackRoad OS, powering the "computer in a browser" experience: windows, sessions, identity, and routing.

## SDK quick install

```bash
npm i @blackroad/core
pip install blackroad-core
```

### Node usage

```ts
import { loadCatalog, RoleGuard } from "@blackroad/core";
const catalog = await loadCatalog();
const guard = new RoleGuard(["operator"]);
guard.canPerform("execute", "task");
```

### Python usage

```py
from blackroad_core import Catalog, RoleGuard
catalog = Catalog.load()
guard = RoleGuard(["admin"])
guard.can_perform("manage", "policy")
```

## What This Repo Owns ✅

### 🧠 Core Domain Logic
- **User + Org + Workspace identity models** - Who is this? Which org are they in?
- **Session + state management** - What's open, where, and for whom
- **Permissions + roles + capabilities** - What can they see/do?

### 🖥️ Desktop Shell
- **App/"window" registry** - What apps exist in the OS
- **Layout + navigation rules** - How a user moves around the OS
- **Cross-app context passing** - Selected org, env, project, agent

### 🌐 Internal Glue
- **Shared types/interfaces** - Used by other repos (`-web`, `-api`, `-operator`, `-prism-console`)
- **Event contracts** - "user logged in", "deployment changed", "agent run started"
- **Canonical enums + constants** - Environments, teams, packs, statuses

## Quickstart

### As a Library

Install the package in your BlackRoad OS service:

```bash
# In other repos (api, operator, web, etc.)
pnpm add @blackroad/core
```

Then import shared types and utilities:

```typescript
import { 
  // Identity types
  User, Org, Workspace, OrgMembership,
  
  // Session types
  Session, SessionContext, WindowState,
  
  // Permission types
  Permission, Role, SystemRoles,
  
  // Desktop shell types
  AppDefinition, LayoutConfig, NavigationConfig, SystemApps,
  
  // Context types
  AppContext, parseDeepLink, buildDeepLink,
  
  // Event types
  DomainEvent, DomainEventTypes,
  
  // Constants
  Environments, Teams, Packs, JobStatuses, ErrorCodes,
  
  // Truth Engine
  TextSnapshot, VerificationJob, TruthState,
  
  // Utilities
  getServiceById, loadCoreConfig, createLogger
} from '@blackroad/core';

// Example: Check user context
const context: AppContext = {
  currentUser: { id: 'user_123', email: 'dev@blackroad.dev', displayName: 'Dev', roles: ['admin'] },
  currentOrg: { id: 'org_456', name: 'Acme', slug: 'acme', plan: 'pro', memberRole: 'admin' },
  environment: { name: 'development', apiBaseUrl: 'https://api.dev.blackroad.dev', features: {} }
};

// Example: Use domain events
const event: DomainEvent = {
  id: 'evt_789',
  type: DomainEventTypes.USER_LOGGED_IN,
  payload: { userId: 'user_123', sessionId: 'sess_abc', orgId: 'org_456', method: 'oauth' },
  severity: 'info',
  timestamp: new Date().toISOString()
};
```

### Development

```bash
pnpm i
pnpm test                   # Run tests
pnpm dev --filter=web       # http://localhost:3000
pnpm dev --filter=desktop   # launches Tauri window
```

### Docker (web)

```bash
docker build -t blackroad/core-web:0.0.1 -f infra/Dockerfile .
docker run -e PORT=3000 -p 3000:3000 blackroad/core-web:0.0.1
```

## Library Structure

```
src/
├── identity/       # User, Org, Workspace + PS-SHA∞ identity
├── session/        # Session + state management types
├── permissions/    # Permissions, roles, capabilities
├── desktop/        # App registry, layout, navigation
├── context/        # Cross-app context passing
├── events/         # Domain events and RoadChain
├── constants/      # Canonical enums and constants
├── truth/          # Truth Engine types
├── agents/         # Agent base types
├── jobs/           # Job types and lifecycle
├── services/       # Service registry
├── config/         # Configuration loading
├── logging/        # Structured logging
├── lucidia/        # Lucidia types and validation
├── results/        # Result/Ok/Err helpers
└── utils/          # General utilities
```

## Available Exports

### Identity 🧬
- `User`, `Org`, `Workspace` - Core entity types
- `OrgMembership`, `WorkspaceMembership` - Relationship types
- `UserStatus`, `OrgStatus`, `WorkspaceStatus` - Status enums
- `IdentityAnchor`, `PsShaInfinity` - PS-SHA∞ identity primitives

### Session 🧭
- `Session`, `SessionContext` - Session and context types
- `WindowState`, `WindowPosition`, `WindowSize` - Window management
- `UserPreferences`, `ThemePreference` - User settings
- `SessionSnapshot` - State persistence

### Permissions 🔐
- `Permission`, `Role`, `AccessPolicy` - RBAC types
- `PermissionCheck`, `PermissionCheckResult` - Access evaluation
- `ResourceType`, `ActionType` - Permission enums
- `SystemRoles` - Built-in role constants

### Desktop Shell 🖥️
- `AppDefinition`, `AppRegistry` - App registration
- `LayoutConfig`, `NavigationConfig` - Shell configuration
- `NavMenuItem`, `NavQuickAction`, `KeyboardShortcut` - Navigation
- `SystemApps` - Built-in app constants

### Context 🧳
- `AppContext`, `UserContextInfo`, `OrgContextInfo` - Context shapes
- `ContextProvider`, `ContextSubscription` - Context management
- `DeepLink`, `parseDeepLink()`, `buildDeepLink()` - Deep linking

### Events 📡
- `DomainEvent`, `DomainEventTypes` - Event contracts
- `UserLoggedInPayload`, `DeploymentChangedPayload`, `AgentRunStartedPayload` - Event payloads
- `JournalEntry`, `RoadChainEvent` - Audit types

### Constants 📚
- `Environments`, `EnvironmentConfig` - Environment definitions
- `Teams`, `TeamConfig` - Team metadata
- `Packs`, `PackConfig` - Domain pack definitions
- `GenericStatuses`, `JobStatuses`, `DeploymentStatuses`, `AgentStatuses` - Status enums
- `Priorities`, `PriorityConfig` - Priority levels
- `ErrorCodes` - Standard error codes

### Service Registry
- `ServiceId`, `ServiceMetadata`, `ServiceKind` - Types for services
- `getServiceById()`, `listServices()`, `listServicesByKind()` - Registry helpers

### Config
- `CoreConfig`, `LogLevel`, `BaseEnv` - Configuration types
- `loadCoreConfig(prefix)` - Load typed config from environment

### Logging
- `LogContext`, `LogEntry` - Logging types
- `createLogger(baseContext)` - Create structured logger

### Truth Engine
- `TextSnapshot`, `VerificationJob`, `TruthState`, `AgentAssessment` - Core types
- `aggregateTruthState()` - Aggregation utilities

See full exports in [src/index.ts](./src/index.ts).

## Testing

All core functionality is tested:

```bash
pnpm test           # Run all tests
pnpm test:watch     # Watch mode
```

Tests cover:
- Identity, session, and permission types
- Desktop shell and context types
- Domain events and constants
- Service registry integrity
- Config loading and validation
- Truth Engine aggregation
- Hashing and identity primitives

## 📏 Design Principles

- `blackroad-os-core` is the **canonical truth** for:
  - 🧭 "Who is this?" → `User`, `Session`
  - 🌍 "Which org/env/workspace are they in?" → `Org`, `Workspace`, `SessionContext`
  - 🕹️ "Which apps are available and what can they see/do?" → `AppRegistry`, `Permission`

- Other repos should **import types/contracts** from here, not re-invent them:
  - `-web` uses view models & enums 🖥️
  - `-api` uses domain types & error shapes 🌐
  - `-operator` uses IDs, statuses, and event names ⚙️
  - `-prism-console` uses models for services, envs, and agents 🕹️

## 🚫 What This Repo Does NOT Own

- 🚫 Direct infra (DNS, Cloudflare, Railway config) → `blackroad-os-infra` ☁️
- 🚫 Pure docs + handbooks → `blackroad-os-docs` 📚 or `blackroad-os-home` 🏠
- 🚫 Brand system (colors, slides, email templates) → `blackroad-os-brand` 🎨
- 🚫 Deep math / field research → `blackroad-os-research` 🧪
- 🚫 Append-only logs / history → `blackroad-os-archive` 🧾
