# BlackRoad Network Map
## Canonical IP Address Plane Documentation

**Created**: 2025-12-13
**Authority**: Alexa Amundson
**Verification**: PS-SHA-∞
**Source of Truth**: GitHub (BlackRoad-OS/blackroad-os-core)

---

## Network Architecture Overview

BlackRoad OS operates across five distinct network planes, each serving specific purposes in the sovereign computing stack:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PUBLIC INTERNET (IPv4/IPv6)                  │
│                                                                     │
│  159.65.43.12 (DigitalOcean - codex-infinity)                      │
│  ├─ Headscale Control Server (future)                              │
│  ├─ Public Gateway                                                 │
│  └─ Cloudflare Tunnel Endpoint                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
        ┌───────────────────────────┼──────────────────────────┐
        │                           │                          │
┌───────▼────────┐        ┌─────────▼────────┐     ┌──────────▼─────────┐
│  MESH PLANE    │        │   LAN PLANE      │     │   DOCKER PLANE     │
│  100.x.x.x/8   │◄───────┤   192.168.4.0/24 ├────►│   172.x.x.x/16     │
│                │        │                  │     │                    │
│  Tailscale     │        │  Home Network    │     │  Container Network │
│  (→ Headscale) │        │  Physical Devices│     │  Services          │
└────────────────┘        └──────────────────┘     └────────────────────┘
        │
        │
┌───────▼────────────────────────────────────────────────────────────┐
│                        IPv6 PLANE (Future)                         │
│                        2001:db8::/32 (example)                     │
└────────────────────────────────────────────────────────────────────┘
```

---

## 1. LAN Plane (192.168.4.0/24)

**Purpose**: Local Area Network - physical devices on home network
**Router**: 192.168.4.1
**DHCP Range**: 192.168.4.100-192.168.4.200 (reserved for dynamic)
**Static Range**: 192.168.4.1-192.168.4.99 (reserved for servers)

### Device Registry

| Device Name | IP Address | MAC Address | Purpose | Status | Notes |
|-------------|------------|-------------|---------|--------|-------|
| **Router** | 192.168.4.1 | TBD | Gateway, DNS | Active | ISP router |
| **MacBook Pro** | 192.168.4.27 | TBD | Development workstation | Active | Primary dev machine |
| **Raspberry Pi 5 #1** | 192.168.4.49 | TBD | Headscale server, K3s master | Active | Hostname: `alice` or `lucidia` |
| **iPhone Koder** | 192.168.4.68:8080 | TBD | Mobile development | Active | Port 8080 agent: `br-8080-cadillac` |
| **Raspberry Pi 400** | 192.168.4.64 | TBD | Desktop, development | Active | Built-in keyboard |
| **Raspberry Pi Zero 2 W** | TBD | TBD | Edge sensor | Planned | Low-power |
| **Raspberry Pi 5 #2** | TBD | TBD | K3s worker node | Planned | 8GB RAM |
| **Raspberry Pi 5 #3** | TBD | TBD | K3s worker node | Planned | 8GB RAM |
| **Jetson Orin Nano** | TBD | TBD | GPU inference server | Planned | vLLM deployment |

### Port Allocations

| Port | Service | Device | Status |
|------|---------|--------|--------|
| 22 | SSH | All Pi devices | Active |
| 80 | HTTP | Raspberry Pi 5 #1 | Planned |
| 443 | HTTPS | Raspberry Pi 5 #1 | Planned |
| 5432 | PostgreSQL | Docker on MacBook | Active |
| 6379 | Redis | Docker on MacBook | Active |
| 8000 | FastAPI Backend | MacBook | Active |
| 8080 | iPhone Dev Server | iPhone Koder | Active |
| 9000 | MinIO | Raspberry Pi 5 #1 | Planned |
| 6443 | K3s API | Raspberry Pi 5 #1 | Planned |

---

## 2. Mesh Plane (100.x.x.x/8)

**Purpose**: Tailscale mesh VPN (migrating to Headscale)
**Current Provider**: Tailscale (proprietary)
**Target Provider**: Headscale (MIT license, self-hosted)
**Control Server**: Future deployment on 159.65.43.12

### Mesh Device Registry

| Device | Mesh IP | LAN IP | Status | Hostname |
|--------|---------|--------|--------|----------|
| MacBook Pro | 100.x.x.1 | 192.168.4.27 | Active | `macbook-dev` |
| Raspberry Pi 5 #1 | 100.x.x.2 | 192.168.4.49 | Active | `alice` |
| iPhone Koder | 100.x.x.3 | 192.168.4.68 | Active | `iphone-koder` |
| Raspberry Pi 400 | 100.x.x.4 | 192.168.4.64 | Active | `pi400` |
| DigitalOcean Droplet | 100.x.x.5 | 159.65.43.12 | Active | `codex-infinity` |
| Raspberry Pi 5 #2 | 100.x.x.6 | TBD | Planned | `pi5-worker-1` |
| Raspberry Pi 5 #3 | 100.x.x.7 | TBD | Planned | `pi5-worker-2` |
| Raspberry Pi Zero 2 W | 100.x.x.8 | TBD | Planned | `pi-zero-edge` |
| Jetson Orin Nano | 100.x.x.9 | TBD | Planned | `jetson-gpu` |

### Mesh Migration Plan

**Current State**: Tailscale
- ✅ All devices connected
- ✅ Working mesh connectivity
- ❌ Proprietary control plane
- ❌ Cannot fork

**Target State**: Headscale
- [ ] Deploy Headscale on DigitalOcean (159.65.43.12)
- [ ] Configure DERP relay server
- [ ] Migrate devices one by one
- [ ] Verify connectivity
- [ ] Decommission Tailscale account

**Migration Steps**:
1. Deploy Headscale container on 159.65.43.12
2. Create pre-authentication keys for each device
3. Test connectivity with one device (Raspberry Pi 5 #1)
4. Roll out to remaining devices
5. Update DNS records to point to Headscale
6. Document new mesh topology

---

## 3. Docker Plane (172.x.x.x/16)

**Purpose**: Container networking for services
**Current Deployment**: Docker Desktop (MacBook)
**Future Deployment**: K3s cluster (Raspberry Pi)

### Container Network Registry

| Container | Internal IP | Exposed Port | Host | Status |
|-----------|-------------|--------------|------|--------|
| **PostgreSQL** | 172.17.0.2 | 5432 → 5432 | MacBook | Active |
| **Redis** | 172.17.0.3 | 6379 → 6379 | MacBook | Active |
| **FastAPI Backend** | Host network | 8000 → 8000 | MacBook | Active |
| **MinIO** | TBD | 9000 → 9000 | Pi 5 #1 | Planned |
| **Headscale** | TBD | 443 → 443 | DigitalOcean | Planned |
| **Keycloak** | TBD | 8080 → 8080 | Pi 5 #1 | Planned |
| **Mattermost** | TBD | 8065 → 8065 | Pi 5 #2 | Planned |
| **Qdrant** | TBD | 6333 → 6333 | Pi 5 #3 | Planned |

### K3s Cluster Architecture (Future)

```
Master Node: Raspberry Pi 5 #1 (192.168.4.49)
├─ Control Plane
├─ etcd database
└─ Core services (Headscale, MinIO, Keycloak)

Worker Node 1: Raspberry Pi 5 #2
├─ Application pods
└─ Mattermost, Plane

Worker Node 2: Raspberry Pi 5 #3
├─ Data services
└─ Qdrant, PostgreSQL replicas

GPU Node: Jetson Orin Nano
└─ vLLM inference pods
```

---

## 4. Public IPv4 Plane

**Purpose**: Internet-accessible services
**Provider**: DigitalOcean

### Public IP Inventory

| IP Address | Hostname | Services | Provider | Cost |
|------------|----------|----------|----------|------|
| **159.65.43.12** | codex-infinity | Headscale (planned), Gateway | DigitalOcean | $6/mo |

### Domain → IP Mappings

All domains managed via Cloudflare DNS:

| Domain | Type | Target | Purpose |
|--------|------|--------|---------|
| blackroad.io | A | GitHub Pages (185.199.x.x) | Main app |
| blackroad.systems | A | Railway (variable) | Backend API |
| roadchain.io | A | GitHub Pages | Blockchain explorer |
| lucidia.earth | A | GitHub Pages | Breath engine |
| codex-infinity.com | A | 159.65.43.12 | Research archive |
| gateway.blackroad.io | CNAME | Cloudflare Workers | API gateway |
| status.blackroad.io | CNAME | Cloudflare Pages | Status page |
| docs.blackroad.io | CNAME | Cloudflare Pages | Documentation |
| app.blackroad.io | CNAME | Cloudflare Pages | Web app |
| cece.blackroad.io | CNAME | Cloudflare Pages | Cece agent |
| core.blackroad.systems | A | Railway | Core API |
| operator.blackroad.systems | A | Railway | Operator service |

### Cloudflare Infrastructure

**Zones**: 16 domains
**Pages Projects**: 8 deployments
**KV Namespaces**: 8 stores
**D1 Databases**: 1 database
**Workers**: 5+ scripts
**Tunnels**: Planned for local → public routing

---

## 5. IPv6 Plane (Future)

**Purpose**: Next-generation addressing for global reach
**Status**: Planned

### IPv6 Strategy

1. **Obtain IPv6 Prefix**: Request /48 or /56 from ISP
2. **Subnet Allocation**:
   - `2001:db8:1::/64` → LAN devices
   - `2001:db8:2::/64` → Mesh network
   - `2001:db8:3::/64` → Docker containers
   - `2001:db8:4::/64` → Public services

3. **Benefits**:
   - Direct device addressing (no NAT)
   - Better security (IPsec built-in)
   - Simpler routing
   - Future-proof

4. **Implementation Timeline**: Q3 2025

---

## Network Security

### Firewall Rules (iptables/nftables)

**LAN Plane**:
- Allow all internal traffic (192.168.4.0/24)
- Allow SSH from mesh plane
- Block all external access except via Cloudflare Tunnel

**Mesh Plane**:
- Allow all traffic between mesh nodes
- Require WireGuard encryption
- Log all connection attempts

**Docker Plane**:
- Isolate containers by default
- Explicit service → service communication
- No direct external access (proxy via reverse proxy)

**Public Plane**:
- Cloudflare DDoS protection
- Rate limiting (OPA policies)
- Fail2ban for SSH
- UFW firewall on DigitalOcean droplet

### Zero Trust Architecture

**Policy Engine**: Open Policy Agent (OPA)
**Authentication**: Keycloak (SSO)
**Authorization**: JWT tokens + RBAC
**Encryption**: TLS 1.3 everywhere

**Rules**:
1. Never trust, always verify
2. All traffic encrypted (even internal mesh)
3. Least privilege access
4. Audit all access attempts

---

## Service Discovery

### DNS Records

**Internal DNS** (Pi-hole or CoreDNS on Raspberry Pi 5 #1):
```
alice.local          → 192.168.4.49
pi400.local          → 192.168.4.64
macbook.local        → 192.168.4.27
iphone.local         → 192.168.4.68

db.blackroad.local   → 172.17.0.2 (PostgreSQL)
cache.blackroad.local → 172.17.0.3 (Redis)
api.blackroad.local  → 192.168.4.27:8000
```

**External DNS** (Cloudflare):
- All public domains point to Cloudflare
- Cloudflare proxies traffic to origin (Railway, GitHub Pages, or Tunnel)
- SSL/TLS managed by Cloudflare

---

## Monitoring & Observability

### Network Monitoring

| Tool | Purpose | Deployment | Status |
|------|---------|------------|--------|
| **Prometheus** | Metrics collection | K3s cluster | Planned |
| **Grafana** | Visualization | K3s cluster | Planned |
| **Loki** | Log aggregation | K3s cluster | Planned |
| **Uptime Kuma** | Status monitoring | Raspberry Pi | Planned |

### Metrics to Track

- Network latency (mesh vs LAN)
- Bandwidth usage per device
- Container resource utilization
- API response times
- Agent spawn rates
- Database query performance

---

## Backup & Disaster Recovery

### Backup Strategy

**Tier 1: Critical Data** (PostgreSQL, user data)
- Frequency: Hourly
- Retention: 30 days
- Destination: MinIO (encrypted) + Cloudflare R2
- RPO: 1 hour

**Tier 2: Application State** (Redis, session data)
- Frequency: Daily
- Retention: 7 days
- Destination: MinIO
- RPO: 24 hours

**Tier 3: Static Assets** (code, configs)
- Frequency: On change (Git)
- Retention: Infinite
- Destination: GitHub
- RPO: Real-time

### Disaster Recovery

**Scenario 1: Single device failure**
- Replace device
- Restore from backup
- Rejoin mesh network
- RTO: 2 hours

**Scenario 2: Network outage**
- Fall back to LAN-only mode
- Agent operations continue locally
- Sync when connectivity restored
- RTO: 0 (no downtime)

**Scenario 3: Data center failure (DigitalOcean)**
- Headscale control server lost
- Mesh network continues peer-to-peer
- Redeploy control server to backup VPS
- RTO: 4 hours

---

## Bandwidth & Performance

### Expected Traffic Patterns

**LAN Plane**:
- SSH: 100 KB/s average
- Web traffic: 1-5 MB/s
- Database queries: 500 KB/s

**Mesh Plane**:
- Agent communication: 2-10 MB/s
- File sync: Variable (0-100 MB/s)
- API calls: 100 KB/s

**Public Plane**:
- Website traffic: 10-50 MB/s
- API traffic: 5-20 MB/s
- Webhook events: 10 KB/s

### Capacity Planning

**Home Internet**:
- Download: 500 Mbps (62.5 MB/s)
- Upload: 50 Mbps (6.25 MB/s)
- Latency: <20ms local, <50ms Cloudflare

**Raspberry Pi Cluster**:
- Ethernet: 1 Gbps (125 MB/s)
- WiFi: 802.11ac (433 Mbps / 54 MB/s)
- Disk I/O: 500 MB/s (SSD)

**DigitalOcean Droplet** ($6/mo):
- Bandwidth: 1 TB/month
- Network: 1 Gbps
- CPU: 1 vCPU
- RAM: 1 GB

---

## Future Expansions

### Short-term (0-6 months)

1. **Deploy Headscale** on 159.65.43.12
   - Migrate from Tailscale
   - Document new mesh IPs

2. **Set up K3s Cluster** on Raspberry Pi nodes
   - Master: 192.168.4.49
   - Workers: 2x additional Pi 5

3. **Deploy MinIO** for object storage
   - 3-node distributed setup
   - S3-compatible API

4. **Implement Keycloak SSO**
   - Single sign-on for all apps
   - OIDC provider

### Long-term (6-12 months)

5. **Add Jetson Orin Nano** for GPU inference
   - vLLM deployment
   - Local LLM hosting

6. **Migrate off Railway** to self-hosted K3s
   - Full sovereignty
   - No cloud dependencies

7. **IPv6 Implementation**
   - Direct device addressing
   - Global reachability

8. **Edge Node Expansion**
   - Additional Raspberry Pi Zero devices
   - Geographic distribution

---

## IP Allocation Summary

### Reserved Ranges

**LAN** (192.168.4.0/24):
- `.1` → Router
- `.2-.99` → Static servers (59 IPs)
- `.100-.200` → DHCP pool (101 IPs)
- `.201-.254` → Reserved future (54 IPs)

**Mesh** (100.x.x.x/8):
- `.1-.99` → Core infrastructure
- `.100-.999` → User devices
- `.1000+` → Agent runtime instances

**Docker** (172.x.x.x/16):
- Managed by Docker/K3s
- Auto-assigned

---

## Change Log

| Date | Change | Author | Reason |
|------|--------|--------|--------|
| 2025-12-13 | Initial network map created | Alexa | Document current state |
| TBD | Headscale deployed | Alexa | Mesh VPN sovereignty |
| TBD | K3s cluster online | Alexa | Container orchestration |
| TBD | IPv6 enabled | Alexa | Future-proof addressing |

---

## Appendix: Network Verification Commands

### Check LAN Connectivity
```bash
# From any device
ping 192.168.4.1           # Router
ping 192.168.4.49          # Raspberry Pi 5 #1

# Scan network
nmap -sn 192.168.4.0/24
```

### Check Mesh Connectivity
```bash
# From any mesh device
tailscale status           # Current (Tailscale)
headscale nodes list       # Future (Headscale)

# Test mesh connection
ping 100.x.x.2             # Raspberry Pi via mesh
```

### Check Docker Networking
```bash
# On Docker host
docker network ls
docker network inspect bridge

# Container connectivity
docker exec <container> ping 172.17.0.2
```

### Check Public Accessibility
```bash
# From external machine
dig blackroad.io +short
curl -I https://blackroad.io

# From DigitalOcean droplet
curl -I https://core.blackroad.systems
```

---

*This network map is the canonical source of truth for BlackRoad's network infrastructure. Update it whenever topology changes occur.*

**Maintained by**: Alexa Amundson
**Review Queue**: blackroad.systems@gmail.com
**Verification**: PS-SHA-∞ hash chain
**Source of Truth**: GitHub (BlackRoad-OS/blackroad-os-operator)
