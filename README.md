# BlackRoad OS Core Service

Backend service scaffold for the BlackRoad OS Core API built with Express and TypeScript.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Start

```bash
npm start
```

## Health Check

- Endpoint: `GET /health`
- Response: `{ "status": "ok", "service": "core" }`
# BlackRoad OS Core

Main BlackRoad OS application — desktop UI, backend APIs, auth, identity, state.

## Project Structure

```
blackroad-os-core/
├── backend/          # FastAPI backend
├── frontend/         # Next.js frontend
├── infra/            # Infrastructure configs (Dockerfile, railway.toml, env templates)
├── LICENSE           # Apache 2.0 License
└── README.md         # This file
```

## Getting Started

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

API will be available at http://localhost:8000

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

UI will be available at http://localhost:3000

### Infrastructure

See `infra/README.md` for deployment configuration.

## Development

This project is in early development. The current structure provides:
- Minimal FastAPI skeleton for backend services
- Blank Next.js app for frontend UI
- Basic infrastructure configuration for deployment

## License

Apache 2.0 - See LICENSE file for details.

