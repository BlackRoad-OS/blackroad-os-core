# BlackRoad OS · Core Desktop UI (Gen-0)

[![npm version](https://img.shields.io/npm/v/@blackroad/core.svg)](https://www.npmjs.com/package/@blackroad/core)
[![PyPI version](https://img.shields.io/pypi/v/blackroad-core.svg)](https://pypi.org/project/blackroad-core)
[![CI](https://github.com/blackroad-os/blackroad-os-core/actions/workflows/ci.yml/badge.svg)](https://github.com/blackroad-os/blackroad-os-core/actions/workflows/ci.yml)

Ultra-thin desktop/web shell scaffold for BlackRoad OS agents with shared SDKs for TypeScript and Python.

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

## Quickstart

```bash
pnpm i
pnpm dev --filter=web              # http://localhost:3000
pnpm dev --filter=desktop          # launches Tauri window
```

### Docker (web)

```bash
docker build -t blackroad/core-web:0.0.1 -f infra/Dockerfile .
docker run -e PORT=3000 -p 3000:3000 blackroad/core-web:0.0.1
```
