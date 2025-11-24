# BlackRoad OS · Core

**Core library and shared types for BlackRoad OS.**

This repository serves as the foundational library for the BlackRoad OS ecosystem, providing:
- **Service Registry** - Central registry of all BlackRoad OS services
- **Shared Types** - Common interfaces and contracts (Truth Engine, services, endpoints)
- **Config Loading** - Environment-based configuration utilities
- **Logging** - Structured logging helpers
- **Core Domain Logic** - Truth Engine types and primitives

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
  getServiceById, 
  loadCoreConfig, 
  createLogger,
  TextSnapshot,
  VerificationJob 
} from '@blackroad/core';

// Use service registry
const apiService = getServiceById('api');
console.log(apiService.health_path); // "/api/health"

// Load config
const config = loadCoreConfig('MY_SERVICE');

// Create structured logger
const logger = createLogger({ 
  service: config.serviceName, 
  env: config.env 
});
logger.info('Service started');
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
├── services/       # Service registry and endpoint types
├── config/         # Configuration loading utilities
├── logging/        # Structured logging helpers
├── truth/          # Truth Engine types (TextSnapshot, VerificationJob, TruthState)
├── agents/         # Agent base types
├── jobs/           # Job types and lifecycle
├── events/         # Domain events and RoadChain
├── identity/       # Identity and PS-SHA∞ hashing
├── lucidia/        # Lucidia types and validation
└── utils/          # General utilities
```

## Available Exports

### Service Registry
- `ServiceId`, `ServiceMetadata`, `ServiceKind` - Types for services
- `HealthResponse`, `ReadyResponse`, `VersionResponse` - Standard endpoint types
- `getServiceById()`, `listServices()`, `listServicesByKind()` - Registry helpers
- `constructServiceUrl()` - URL construction helper
- `validateRegistry()` - Registry integrity validation

### Config
- `CoreConfig`, `LogLevel`, `BaseEnv` - Configuration types
- `loadCoreConfig(prefix)` - Load typed config from environment
- `getRequiredEnv(key)`, `getOptionalEnv(key, default)` - Environment helpers

### Logging
- `LogContext`, `LogEntry` - Logging types
- `createLogger(baseContext)` - Create structured logger
- `logDebug()`, `logInfo()`, `logWarn()`, `logError()` - Standalone logging functions

### Truth Engine
- `TextSnapshot`, `VerificationJob`, `TruthState`, `AgentAssessment` - Core types
- Aggregation and validation utilities

See full exports in [src/index.ts](./src/index.ts).

## Testing

All core functionality is tested:

```bash
pnpm test           # Run all tests
pnpm test:watch     # Watch mode
```

Tests cover:
- Service registry integrity and helpers
- Config loading and validation
- Logging functionality
- Truth Engine types and aggregation
- Hashing and identity primitives
