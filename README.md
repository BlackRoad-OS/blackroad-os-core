# BlackRoad OS – Core

Core is the internal engine for BlackRoad OS, exposing foundational metadata endpoints, health probes, and service descriptors used by other platform components.

## Running Locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start in development mode:
   ```bash
   npm run dev
   ```

## Build and Start
```bash
npm run build
npm start
```

## System Endpoints
- `GET /health`
- `GET /info`
- `GET /version`
- `GET /debug/env`

## Environment
Copy `.env.example` to `.env` and adjust values. Key variables:
- `PORT` (default `8080`)
- `OS_ROOT` (default `https://blackroad.systems`)
- `SERVICE_BASE_URL` (default `https://core.blackroad.systems`)
- `LOG_LEVEL` (default `info`)

## Railway Deployment
- Port: `8080`
- Healthcheck: `/health`
- Build command: `npm install && npm run build`
- Start command: `npm start`
- Use the environment variables documented in `.env.example`.
