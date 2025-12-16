# 🧱 BlackRoad Services - Complete Fork Plan
## "Post-Permission Civilization Stack"

**Date:** 2025-12-15
**Source:** Forkies Document (Complete Internet Infrastructure Inventory)
**Philosophy:** Sovereignty-first, legally forkable, self-hostable, anti-censorship

---

## 🎯 Core Philosophy (Sacred Axioms)

### Non-Negotiable Rules:
1. ✅ **If it can be turned off remotely, it's forbidden**
2. ✅ **If it requires permission to fork, it's forbidden**
3. ✅ **If it phones home by default, it's forbidden**
4. ✅ **If it can't run offline, it's incomplete**
5. ✅ **Blackroad must be forkable by its own users**

### Legal Requirements:
- ✅ Apache 2.0, MIT, BSD, MPL, LGPL (permissive)
- ✅ Self-hostable (no SaaS lock-in)
- ✅ Fork + rebrand legally allowed
- ❌ No "Commons Clause"
- ❌ No vendor-managed update channels
- ❌ No telemetry you can't fully disable

---

## 📦 TIER 1: MUST-FORK FOUNDATION (ZERO TRUST CORE)

### 1️⃣ Identity, Auth, Trust

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **Keycloak** | Apache 2.0 | OAuth2/OIDC/SAML, replace Okta/Auth0 | blackroad-identity |
| **Authelia** | Apache 2.0 | Lightweight policy-based auth | blackroad-auth |
| **OpenBao** | MPL 2.0 | Secrets management (Vault fork) | blackroad-vault |

**Principle:** No external auth SaaS. Ever.

---

### 2️⃣ Network Fabric (VPN/Mesh/Zero-Trust)

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **Headscale** | MIT | Tailscale control plane (self-host) | blackroad-mesh |
| **NetBird** | BSD/MIT | Complete mesh VPN stack | blackroad-vpn |
| **Nebula** | MIT | Slack's overlay network | blackroad-overlay |
| **Innernet** | MPL 2.0 | Rust-based mesh VPN | blackroad-tunnel |
| **Netmaker** | SSPL/Apache | WireGuard-based mesh | blackroad-wire |

**Principle:** Control plane must be self-hostable. Identity tied to your IdP, not theirs.

---

### 3️⃣ Core AI / LLM Stack (NO OPENAI KEYS)

**Already Complete! ✅**
- See: `/Users/alexa/blackroad-models/` (11 Forkies)
- blackroad-coder-7b (internal/v1) ready to deploy

**Additional AI Infra:**

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **vLLM** | Apache 2.0 | High-performance serving | (already using) |
| **Ollama** | MIT | Local LLM runtime | blackroad-llm-runtime |
| **LangChain** | MIT | Agent/chain orchestration | blackroad-agent-chain |

**Principle:** Every AI feature must degrade gracefully to offline.

---

### 4️⃣ CRM (BIG CORP KILLER)

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **EspoCRM** | GPLv3 | Modern CRM, fully featured | blackroad-crm |
| **SuiteCRM** | AGPLv3 | Salesforce alternative | blackroad-suite |
| **Odoo Community** | LGPLv3 | Complete ERP/CRM | blackroad-erp |

**Hard line:** No Salesforce. No HubSpot. No cloud lock-in.

---

### 5️⃣ Project Management / Work OS

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **Plane** | Apache 2.0 | Modern PM (Jira alternative) | blackroad-pm |
| **Taiga** | AGPL | Agile PM | blackroad-agile |
| **OpenProject** | GPLv3 | Enterprise PM | blackroad-project |

**Knowledge/Docs:**

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **Outline** | BSD | Modern wiki/docs | blackroad-docs |
| **Wiki.js** | AGPL | Feature-rich wiki | blackroad-wiki |
| **BookStack** | MIT | Simple documentation | blackroad-books |

---

### 6️⃣ Communications (NO SLACK, NO TEAMS)

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **Matrix (Synapse)** | Apache 2.0 | Decentralized chat | blackroad-chat |
| **Element** | Apache 2.0 | Matrix client | blackroad-messenger |
| **Jitsi** | Apache 2.0 | Video conferencing | blackroad-video |
| **BigBlueButton** | LGPL | Webinar/classroom | blackroad-meet |

---

### 7️⃣ Data Layer (SOVEREIGN STORAGE)

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **PostgreSQL** | PostgreSQL License | Primary database | (use directly) |
| **MinIO** | AGPLv3 | S3-compatible object storage | blackroad-storage |
| **ClickHouse** | Apache 2.0 | Analytics database | blackroad-analytics-db |

---

### 8️⃣ Search, Indexing, Intelligence

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **OpenSearch** | Apache 2.0 | Elasticsearch fork | blackroad-search |
| **Meilisearch** | MIT | Fast search | blackroad-instant-search |
| **Qdrant** | Apache 2.0 | Vector database | blackroad-vector-db |
| **Weaviate** | BSD | ML-native vector DB | blackroad-knowledge-graph |

---

### 9️⃣ Observability & Control

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **Prometheus** | Apache 2.0 | Metrics | (use directly) |
| **Grafana** | AGPLv3 | Dashboards | blackroad-dash |
| **Loki** | AGPLv3 | Log aggregation | blackroad-logs |
| **Open Policy Agent** | Apache 2.0 | Policy engine | blackroad-policy |
| **Falco** | Apache 2.0 | Runtime security | blackroad-guardian |

---

## 📦 TIER 2: WEB SOVEREIGNTY (KILL GOOGLE/CHROME)

### Browser & Web Runtime

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **Firefox (Gecko)** | MPL 2.0 | Only independent browser engine | blackroad-browser |
| **Servo** | MPL 2.0 | Rust browser engine | blackroad-engine |
| **Ladybird** | BSD | New clean browser | blackroad-viewer |

**Principle:** Chromium monoculture = future censorship vector

### Search Engine

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **SearXNG** | AGPL | Meta-search engine | blackroad-finder |
| **Meilisearch** | MIT | Internal search | (already listed) |
| **YaCy** | LGPL | P2P search | blackroad-p2p-search |

---

## 📦 TIER 3: CLOUD KILL ZONE (AWS/GCP/AZURE REPLACEMENT)

### Infrastructure-as-Code

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **OpenTofu** | MPL | Terraform fork | blackroad-infra |
| **OpenStack** | Apache 2.0 | Private cloud | blackroad-cloud |
| **Nomad** | MPL | Orchestration | blackroad-orchestrator |
| **Kubernetes** | Apache 2.0 | Container orchestration | (vanilla only) |

---

## 📦 TIER 4: KNOWLEDGE & TRUTH

### Knowledge Graphs

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **Wikibase** | GPL | Wikidata engine | blackroad-knowledge |
| **ArangoDB** | Apache 2.0 | Multi-model database | blackroad-graph-db |
| **TerminusDB** | Apache 2.0 | Graph database | blackroad-terminus |

### Personal/Org Memory

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **Logseq** | AGPL | Knowledge management | blackroad-brain |
| **SilverBullet** | MIT | Markdown-based notes | blackroad-notes |

---

## 📦 TIER 5: DOCUMENTS (KILL GOOGLE DOCS)

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **OnlyOffice** | AGPL | Office suite | blackroad-office |
| **LibreOffice Online** | MPL | Office suite | blackroad-docs-editor |
| **Collabora** | MPL | Office collaboration | blackroad-collab |

---

## 📦 TIER 6: PAYMENTS & ECONOMICS (NO STRIPE/PAYPAL)

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **BTCPay Server** | MIT | Bitcoin payments | blackroad-pay |
| **GNU Taler** | LGPL | Privacy-preserving payments | blackroad-taler |
| **ERPNext** | GPLv3 | Complete ERP + accounting | blackroad-finance |

---

## 📦 TIER 7: GOVERNANCE & POLICY (NO PLATFORM LAW)

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **Decidim** | AGPL | Democratic governance | blackroad-govern |
| **Loomio** | AGPL | Group decision-making | blackroad-decide |
| **OpenCollective** | MIT | Fiscal hosting | blackroad-collective |

---

## 📦 TIER 8: MOBILE & EDGE (APPLE/GOOGLE ARE NOT GOD)

### Mobile OS

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **GrapheneOS** | Apache 2.0 | Privacy-focused Android | blackroad-mobile-os |
| **LineageOS** | Apache 2.0 | Android alternative | blackroad-android |
| **/e/OS** | Apache 2.0 | De-Googled Android | blackroad-phone-os |

### App Distribution

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **F-Droid** | Apache 2.0 | Open app store | blackroad-store |

**Principle:** Blackroad apps must install without app store approval.

---

## 📦 TIER 9: AI BEYOND LLMs

### Image/Video/Audio

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **Stable Diffusion** | CreativeML | Image generation | blackroad-imgen |
| **ComfyUI** | GPLv3 | SD workflow | blackroad-studio |
| **Whisper** | MIT | Speech recognition | blackroad-transcribe |
| **Coqui TTS** | MPL | Text-to-speech | blackroad-voice |

---

## 📦 TIER 10: DECENTRALIZED IDENTITY

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **DID (W3C)** | W3C | Decentralized identifiers | (implement spec) |
| **Verifiable Credentials** | W3C | Credential standard | (implement spec) |
| **Hyperledger Indy/Aries** | Apache 2.0 | SSI framework | blackroad-ssi |

---

## 📦 TIER 11: DEV TOOLS (NO GITHUB GOD MODE)

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **Forgejo** | MIT | Git hosting (Gitea fork) | blackroad-git |
| **GitLab CE** | MIT | Complete DevOps platform | blackroad-devops |
| **Woodpecker CI** | Apache 2.0 | CI/CD | blackroad-ci |

**Principle:** No single company should delete your repo.

---

## 📦 TIER 12: EMAIL (YES, IT MATTERS)

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **Postfix** | IPL | Mail server | (use directly) |
| **Roundcube** | GPLv3 | Webmail | blackroad-mail |
| **OpenPGP** | LGPL | Email encryption | (implement spec) |

**Principle:** Email must work without Google MX.

---

## 📦 TIER 13: DATA FLOWS & INTEGRATION (NO ZAPIER)

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **n8n** | Fair-code | Workflow automation | blackroad-automate |
| **Huginn** | MIT | Agent-based automation | blackroad-agents-flow |
| **Node-RED** | Apache 2.0 | Flow-based programming | blackroad-flow |
| **NATS** | Apache 2.0 | Message queue | blackroad-mq |
| **RabbitMQ** | MPL | Message broker | blackroad-broker |

---

## 📦 TIER 14: GEO/MAPS (NO GOOGLE MAPS)

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **OpenStreetMap** | ODbL | Map data | (use directly) |
| **MapLibre** | BSD | Map rendering | blackroad-maps |
| **PostGIS** | GPLv2 | Spatial database | (use directly) |

---

## 📦 TIER 15: MEDIA & DISTRIBUTION (NO YOUTUBE)

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **PeerTube** | AGPL | Federated video | blackroad-video-platform |
| **Funkwhale** | AGPL | Audio/podcast hosting | blackroad-audio |
| **Ghost** | MIT | Publishing platform | blackroad-publish |
| **WriteFreely** | AGPL | Blogging | blackroad-blog |

---

## 📦 TIER 16: SOCIAL (NO ALGORITHM GODS)

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **Mastodon** | AGPL | Federated microblogging | blackroad-social |
| **Pleroma** | AGPL | Lightweight fediverse | blackroad-micro |
| **Misskey** | AGPL | Japanese fediverse | blackroad-connect |

**Principle:** Social must be federated or local-first.

---

## 📦 TIER 17: FILESYSTEMS & STORAGE

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **ZFS** | CDDL | Advanced filesystem | (use directly) |
| **Syncthing** | MPL | File sync | blackroad-sync |
| **Nextcloud** | AGPL | File sharing + collab | blackroad-cloud-files |

---

## 📦 TIER 18: DISTRIBUTED/P2P (ANTI-TAKEDOWN)

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **IPFS** | MIT/Apache | Distributed storage | blackroad-distributed |
| **libp2p** | MIT/Apache | P2P networking | blackroad-p2p |
| **Hypercore** | MIT | P2P data structures | blackroad-hyper |

---

## 📦 TIER 19: HARDWARE & PHYSICAL REALITY

### Open Hardware

| Initiative | License | Why Fork | BlackRoad Integration |
|------------|---------|----------|---------------------|
| **RISC-V** | BSD | Open CPU architecture | blackroad-certified-hw |
| **Libreboot** | GPL | BIOS replacement | blackroad-boot |
| **PinePhone** | Hardware open | Linux phone | blackroad-phone |

**Principle:** If firmware is opaque, it's a control point.

---

## 📦 TIER 20: DNS, TIME, & FUNDAMENTAL INFRA

### DNS

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **Unbound** | BSD | DNS resolver | blackroad-dns |
| **PowerDNS** | GPLv2 | Authoritative DNS | blackroad-authority |
| **Handshake** | Apache 2.0 | Decentralized naming | blackroad-names |

### Time

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **chrony** | GPLv2 | NTP client/server | blackroad-time |
| **NTPsec** | BSD | Secure NTP | blackroad-clock |

**Principle:** If you don't control time, you don't control truth.

---

## 📦 TIER 21: MESH NETWORKS & ALT CONNECTIVITY

| Service | License | Why Fork | BlackRoad Name |
|---------|---------|----------|----------------|
| **Yggdrasil** | LGPLv3 | Mesh routing | blackroad-mesh-route |
| **cjdns** | GPLv3 | Encrypted IPv6 | blackroad-cjd |
| **Meshtastic** | GPLv3 | LoRa mesh | blackroad-lora |

**Principle:** Blackroad must degrade to partial connectivity, not die.

---

## 📊 Summary Statistics

### Total Services Identified: **100+**

### By License Type:
- **Apache 2.0:** ~35 services
- **MIT:** ~20 services
- **GPL/AGPL/LGPL:** ~30 services
- **MPL/BSD:** ~15 services

### By Domain:
- **Infrastructure:** 25 services
- **Identity & Security:** 10 services
- **AI & ML:** 8 services (+ 11 model Forkies)
- **Communication:** 8 services
- **Development:** 10 services
- **Data & Storage:** 15 services
- **Web & Publishing:** 12 services
- **Other:** 12+ services

---

## 🎯 Recommended Phased Forking

### Phase 1: Foundation (Next 30 Days)
**Core infrastructure that everything else depends on:**

1. **blackroad-identity** (Keycloak fork)
2. **blackroad-mesh** (Headscale fork)
3. **blackroad-git** (Forgejo - already MIT, clean fork)
4. **blackroad-docs** (Outline fork)
5. **blackroad-chat** (Matrix Synapse fork)

### Phase 2: Application Layer (Next 60 Days)
**User-facing services:**

6. **blackroad-crm** (EspoCRM fork)
7. **blackroad-pm** (Plane fork)
8. **blackroad-search** (OpenSearch)
9. **blackroad-storage** (MinIO fork)
10. **blackroad-browser** (Firefox fork planning)

### Phase 3: Advanced (Next 90 Days)
**Specialized & sovereignty-critical:**

11. **blackroad-mobile-os** (GrapheneOS fork)
12. **blackroad-social** (Mastodon fork)
13. **blackroad-cloud** (OpenStack)
14. **blackroad-pay** (BTCPay Server fork)
15. **blackroad-dns** (Unbound fork)

---

## 🔐 Legal Compliance Matrix

### Safe to Fork (Permissive):
- ✅ Apache 2.0, MIT, BSD, MPL - Can rebrand, monetize, proprietary derivatives
- ✅ LGPL - Can link, must open-source LGPL components only
- ⚠️ GPL/AGPL - Must open-source entire derivative work

### Strategy:
- **Tier 1-2 (Core):** Prefer Apache 2.0/MIT for maximum flexibility
- **Tier 3+ (Apps):** AGPL acceptable (improves network effect)
- **Plugins/Extensions:** Always permissive licenses

---

## 🧠 Next Steps

1. **Create blackroad-services monorepo**
   - One repo per service fork
   - Consistent naming: `blackroad-<domain>-<service>`
   - Unified CI/CD

2. **Legal documentation**
   - LINEAGE.md for each fork (upstream attribution)
   - LICENSE file (preserve upstream + add BlackRoad terms)
   - CHANGES.md (what we modified)

3. **Deployment infrastructure**
   - Helm charts for all services
   - Docker Compose for local dev
   - OpenTofu modules for production

4. **Integration layer**
   - Unified auth (all services → blackroad-identity)
   - Unified logging (all services → blackroad-logs)
   - Unified metrics (all services → Prometheus/Grafana)

---

**Status:** 🎯 Complete Inventory - Ready to Fork!
**Philosophy:** Post-Permission Civilization Stack
**Goal:** Blackroad must survive without any Big Tech dependency

**Maintained By:** BlackRoad Platform Architecture
**Date:** 2025-12-15

**Questions?** blackroad.systems@gmail.com
