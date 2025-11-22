# BlackRoad OS Core Service

TypeScript + Express service that provides the core BlackRoad OS API surface. This project is deployed to Railway as the `blackroad-os-core` service.

## Build

```bash
npm install
npm run build
```

## Start (production)

```bash
PORT=${PORT:-8080} npm start
```

The server binds to `0.0.0.0` and listens on `process.env.PORT` (default `8080`), which matches Railway's runtime environment.

## Health Check

- Endpoint: `GET /health`
- Sample response:

```json
{
  "status": "ok",
  "service": "core"
}
```

## Environment Variables

| Name | Required | Description |
| --- | --- | --- |
| `PORT` | No | Port for the HTTP server. Railway sets this automatically; defaults to `8080` locally. |
| `NODE_ENV` | No | Runtime mode (`development` by default). |

## Development

```bash
npm install
npm run dev
```
