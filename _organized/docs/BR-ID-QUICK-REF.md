# BR-ID Quick Reference Guide

**Last Updated**: 2025-12-12

## Quick Lookup

### Common IDs

#### Infrastructure
```bash
BR-INF-SRV-0001  # DigitalOcean Droplet (159.65.43.12)
BR-INF-SRV-0002  # Raspberry Pi (192.168.4.49)
BR-INF-NET-0001  # Cloudflare Tunnel
BR-INF-STR-0001  # Railway PostgreSQL
```

#### Security
```bash
BR-SEC-ENV-0001  # Main .env file
BR-SEC-TKN-0001  # Railway API token
BR-SEC-TKN-0002  # Cloudflare API token
BR-SEC-TKN-0003  # Cloudflare DNS token
BR-SEC-CRD-0001  # Credentials inventory
```

#### Applications
```bash
BR-APP-WEB-0001  # blackroad.io (main site)
BR-APP-API-0001  # API Gateway (port 8000)
BR-APP-WRK-0001  # Auth Worker
```

#### Organizations
```bash
BR-ORG-GHO-0002  # BlackRoad-AI (GitHub)
BR-ORG-GHO-0003  # BlackRoad-OS (GitHub)
BR-ORG-CFO-0001  # Cloudflare Account
BR-ORG-RWO-0001  # blackroad-os-core (Railway)
```

## Search Commands

### Find ID Details
```bash
# Search framework doc
grep "BR-INF-SRV-0001" ~/blackroad-sandbox/BR-ID-FRAMEWORK.md

# Search YAML inventory
grep -A 5 "BR-INF-SRV-0001" ~/blackroad-sandbox/BR-ID-INVENTORY.yaml
```

### List All IDs in Category
```bash
# Infrastructure
grep "BR-INF-" ~/blackroad-sandbox/BR-ID-FRAMEWORK.md

# Security
grep "BR-SEC-" ~/blackroad-sandbox/BR-ID-FRAMEWORK.md

# Applications
grep "BR-APP-" ~/blackroad-sandbox/BR-ID-FRAMEWORK.md
```

### Find Resources by Type
```bash
# All servers
grep "BR-INF-SRV" ~/blackroad-sandbox/BR-ID-INVENTORY.yaml

# All environment files
grep "BR-SEC-ENV" ~/blackroad-sandbox/BR-ID-INVENTORY.yaml

# All web apps
grep "BR-APP-WEB" ~/blackroad-sandbox/BR-ID-INVENTORY.yaml
```

## ID Categories Cheatsheet

| Code | Category | Description |
|------|----------|-------------|
| INF | Infrastructure | Servers, networks, storage |
| SEC | Security | Secrets, tokens, credentials |
| APP | Applications | Web apps, APIs, workers |
| SRC | Source Code | Repos, packages, libraries |
| DAT | Data | Databases, KV stores, files |
| SVC | Services | Running processes, daemons |
| ORG | Organizations | GitHub, Cloudflare, Railway |
| DOC | Documentation | Markdown, API docs, runbooks |
| CFG | Configuration | Config files, settings |
| INT | Integrations | Third-party services |

## Subcategory Codes

### Infrastructure (INF)
- **SRV**: Servers
- **NET**: Network
- **STR**: Storage
- **CNT**: Containers
- **REG**: Registries

### Security (SEC)
- **ENV**: Environment Variables
- **TKN**: Tokens & API Keys
- **CRT**: Certificates
- **CRD**: Credentials
- **CRP**: Crypto Wallets

### Applications (APP)
- **WEB**: Web Applications
- **API**: API Services
- **WRK**: Workers
- **CLI**: Command Line Tools
- **DSK**: Desktop Apps

### Source Code (SRC)
- **REP**: Repositories
- **PKG**: Packages
- **MON**: Monorepo Workspaces
- **TMP**: Templates
- **SDK**: SDKs

### Services (SVC)
- **PRC**: Processes
- **DMN**: Daemons
- **MCP**: MCP Servers
- **TUN**: Tunnels
- **MON**: Monitoring

## Common Tasks

### Assign New ID
1. Determine category and subcategory
2. Find next number in sequence
3. Format: `BR-[CAT]-[SUB]-[####]`
4. Document in both files

### Reference ID in Code
```javascript
// JavaScript/TypeScript
const SERVER_ID = 'BR-INF-SRV-0001'; // DigitalOcean Droplet

// Python
SERVER_ID = "BR-INF-SRV-0001"  # DigitalOcean Droplet
```

### Reference ID in Documentation
```markdown
Deploy [BR-APP-WEB-0001] using [BR-CFG-DEP-0003]
```

### Tag Resource with ID
```yaml
# In config files
metadata:
  br_id: BR-APP-API-0001
  name: api-gateway
```

## Files

### Framework Documentation
```bash
~/blackroad-sandbox/BR-ID-FRAMEWORK.md
```
Full framework specification with all IDs and detailed tables.

### Machine-Readable Inventory
```bash
~/blackroad-sandbox/BR-ID-INVENTORY.yaml
```
YAML format for automated tools and scripts.

### This Quick Reference
```bash
~/blackroad-sandbox/BR-ID-QUICK-REF.md
```

## Examples

### Infrastructure Reference
```markdown
Server [BR-INF-SRV-0001] hosts the main API at 159.65.43.12
Database [BR-INF-STR-0001] runs on Railway
Tunnel [BR-INF-NET-0001] connects via Cloudflare
```

### Security Reference
```markdown
Deploy using token [BR-SEC-TKN-0001] from [BR-SEC-ENV-0001]
Credentials stored in [BR-SEC-CRD-0001]
```

### Application Reference
```markdown
[BR-APP-WEB-0001] deployed to blackroad.io
[BR-APP-API-0001] running on port 8000
[BR-APP-WRK-0001] handles authentication
```

## Tips

1. **Always use BR-IDs** in documentation for clarity
2. **Search before assigning** to avoid duplicates
3. **Never reuse retired IDs** - mark as [RETIRED]
4. **Keep both files in sync** when adding new IDs
5. **Tag resources** with their BR-ID in metadata

## Contact

Questions about BR-IDs:
- **Primary**: amundsonalexa@gmail.com
- **Company**: blackroad.systems@gmail.com

---

**Quick Ref Version**: 1.0.0
**Framework Version**: 1.0.0
