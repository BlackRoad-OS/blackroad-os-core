# BlackRoad OS — Core API

The canonical backend for BlackRoad OS. The core API exposes identity and ledger primitives, powers the desktop/runtime experiences, and coordinates with supporting services (UI, operator, and web clients).

## What it does
- Hosts the HTTP API surface for the BlackRoad OS runtime and ledger.
- Provides health/version metadata for orchestration and deployment checks.
- Connects to Postgres (required) and Redis (optional) for persistence and caching.

## HTTP surface
- `GET /` → simple welcome payload for sanity checks.
- `GET /health` → liveness response `{ status: "ok", service: "core" }`.
- `GET /version` → build metadata `{ version, commit, env }`.

## Running locally
1. **Prerequisites:** Node.js 20+, Postgres, optional Redis.
2. **Install dependencies:**
   ```bash
   npm ci
   ```
3. **Set environment:**
   - Required: `DATABASE_URL`, `PUBLIC_CORE_URL` (only enforced outside development), `CORE_PORT` (or `PORT`), `NODE_ENV` (defaults to `development`).
   - Optional: `REDIS_URL`, `COMMIT_SHA` (or `GIT_COMMIT_SHA`/`RAILWAY_GIT_COMMIT_SHA`).
4. **Run the server:**
   ```bash
   npm run dev
   ```
   The API listens on `CORE_PORT` (falls back to `PORT` or `3000`).

> Migrations are not provided in this repository; point `DATABASE_URL` at the target Postgres instance provisioned for your environment.

## Building & production start
```bash
npm run build
npm run start
```

## Deployment
- **Platform:** Railway service `core-api` defined in `railway.json` (build: `npm run build`, start: `npm run start`, health: `/health`).
- **Automation:** GitHub Actions workflow `.github/workflows/core-deploy.yaml` triggers on pushes to `main`, installs dependencies, runs tests/build, deploys via Railway CLI (`RAILWAY_TOKEN` and `RAILWAY_PROJECT_ID` secrets), and verifies `/health`.

## Environment variables
| Name | Required | Purpose |
| --- | --- | --- |
| `CORE_PORT` / `PORT` | Yes (one of them) | HTTP port for the service |
| `DATABASE_URL` | Yes | Postgres connection string |
| `PUBLIC_CORE_URL` | Yes (non-development) | Public base URL for the core API |
| `REDIS_URL` | No | Redis connection string |
| `NODE_ENV` | No | Runtime environment (`development` default) |
| `COMMIT_SHA` / `GIT_COMMIT_SHA` / `RAILWAY_GIT_COMMIT_SHA` | No | Build commit reported by `/version` |

## Manual checks
- `curl http://localhost:3000/health` → expect `{ "status": "ok", "service": "core" }`.
- `curl http://localhost:3000/version` → expect version metadata with resolved environment and commit.
