# BlackRoad OS – Core Service

The Core service is the backbone of BlackRoad OS, exposing foundational metadata endpoints and providing orchestration hooks for other OS components.

## Standard API Endpoints
- `GET /health` → Liveness payload `{ ok: true, service: "core", ts: <ISO timestamp> }`
- `GET /info` → Service metadata `{ name, id, version, time, env }`
- `GET /version` → Version payload `{ version, service }`
- `GET /debug/env` → Safe environment snapshot for debugging

## Local Development
1. **Prerequisites:** Node.js 18+, npm, PostgreSQL, optional Redis.
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment:** copy `.env.example` to `.env` and adjust values (at minimum `DATABASE_URL`).
4. **Run in development mode:**
   ```bash
   npm run dev
   ```
   The server listens on `CORE_PORT`/`PORT` (default `8080`).

## Build and Start
```bash
npm run build
npm start
```

## Testing
```bash
npm test
```
The Jest suite covers health and info endpoints.

## Deployment (Railway)
Railway uses the commands defined in `railway.json`:
- Build: `npm install && npm run build`
- Start: `npm start`
- Service port: `8080`
- Healthcheck: `/health`

## Environment Variables
| Name | Purpose | Default |
| --- | --- | --- |
| `NODE_ENV` | Runtime environment | `development` |
| `CORE_PORT` / `PORT` | HTTP port | `8080` |
| `DATABASE_URL` | PostgreSQL connection string | (none) |
| `REDIS_URL` | Redis connection string | (unset) |
| `PUBLIC_CORE_URL` | Public core URL used by clients | (unset) |
| `SERVICE_BASE_URL` | Base URL exposed by this service | `https://core.blackroad.systems` |
| `OS_ROOT` | BlackRoad OS root URL | `https://blackroad.systems` |
| `LOG_LEVEL` | Logging level hint | `info` |
| `COMMIT_SHA` | Optional commit identifier for logs | (unset) |

## Project Structure
- `src/index.ts` – server entrypoint
- `src/server.ts` – Express app factory and middleware wiring
- `src/routes/` – HTTP route handlers
- `src/config/` – service constants
- `src/db.ts` / `src/redis.ts` – database and cache clients
- `tests/` – Jest test suite

## Containerization
The provided `Dockerfile` builds and runs the service using a multi-stage Node 18 Alpine image, exposing port `8080` and running `npm start` in the runtime stage.
