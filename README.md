# BlackRoad OS — Core
The primary BlackRoad OS runtime — identity, desktop environment, UI engine, and state manager.

## Overview
BlackRoad OS Core provides the foundational runtime for the entire BlackRoad ecosystem. It manages identity, global state, UI layout, deterministic rendering, session logic, multi-agent embedding hooks, and the Pocket OS environment. All system components — Prism, Operator, API, and Web — interface with Core.

## Structured Table

| Field | Value |
| --- | --- |
| **Purpose** | OS runtime, identity, UI, session, global state |
| **Depends On** | API Gateway, Operator Engine |
| **Used By** | Prism Console, Web Client |
| **Owner** | Alexa + Cece (Core Engineering Group) |
| **Status** | Active — foundational |

## Roadmap

Columns:
- Backlog
- In Architecture
- In Dev
- Testing
- Release Ready
- Shipped

Sample tasks:
- Deterministic UI layout engine
- Pocket OS container template
- Identity/session handshake
- Operator dispatch integration
- Agent viewport layer

## Deployment & Environments

This repository hosts the **core backend API** (`core-api`) for BlackRoad OS and is deployed via Railway.

- **Railway project**: `blackroad-os-core` (ID `602cb63b-6c98-4032-9362-64b7a90f7d94`)
- **Service name**: `core-api`
- **Environments**:
  - `dev` → core development Railway environment
  - `staging` → https://staging.core.blackroad.systems
  - `prod` → https://core.blackroad.systems

### Backing services
- `core-db` (Postgres) → `DATABASE_URL`
- `core-cache` (Redis, optional) → `REDIS_URL`

### Required environment variables
- `NODE_ENV` (development | staging | production)
- `PORT` (HTTP port, respects Railway-assigned port)
- `DATABASE_URL` (Postgres connection string)
- `REDIS_URL` (Redis connection string, optional)
- `PUBLIC_BASE_URL` (public-facing base URL for this API)

### Deploying
Deployment is automated via GitHub Actions (`deploy-core.yml`) and targets Railway using the `RAILWAY_TOKEN` secret. Branches map to environments as follows:
- `dev` branch → `dev` environment
- `staging` branch → `staging` environment
- `main` branch → `prod` environment

Builds run `npm ci && npm run build`, and the service starts with `npm run start`. Health checks are performed against the `/health` endpoint after staging and production deploys.
