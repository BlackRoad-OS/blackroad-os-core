# 🌐 BlackRoad Domain Architecture - FINAL

**The Correct Architecture™**
**Date:** 2025-12-14
**Author:** Alexa → Cece 🚗

---

## 🎯 Domain Separation Strategy

Each domain has a **clear purpose** and **distinct responsibility**:

| Domain | Purpose | Who Uses It |
|--------|---------|-------------|
| **blackroad.systems** | Internal AI/Human portals, tools, access | Everyone (no more "I can't access") |
| **blackroad.io** | Public-facing products | Customers, users |
| **blackroad.company** | Company operations, hiring, HR | Team, candidates, investors |
| **blackroad.me** | Personal portals for everyone | Individuals (AI, agents, humans, websites) |
| **roadcoin.io** | Financial operations, payments | Money management, Stripe, Clerk |
| **roadchain.io** | Immutable blockchain, PS-SHA∞ | Documentation, change history |

---

## 📋 Complete Domain Breakdown

### 1. blackroad.systems - **Internal Operations Hub**

**Purpose:** Everything everyone needs to access. No more access issues!

**Subdomains:**

**AI/Human Portals:**
- `portal.blackroad.systems` - Main internal portal
- `access.blackroad.systems` - SSO/authentication gateway
- `tools.blackroad.systems` - Internal tooling
- `admin.blackroad.systems` - Admin dashboard

**Agent Personalities (16 agents):**
- `claude.blackroad.systems` - Strategic Architect
- `lucidia.blackroad.systems` - Consciousness Coordinator
- `silas.blackroad.systems` - Security Sentinel
- `elias.blackroad.systems` - Quality Guardian
- `cadillac.blackroad.systems` - Performance Optimizer
- `athena.blackroad.systems` - Ops Commander
- `codex.blackroad.systems` - Code Generator
- `persephone.blackroad.systems` - Data Architect
- `anastasia.blackroad.systems` - UX Designer
- `ophelia.blackroad.systems` - Content Strategist
- `sidian.blackroad.systems` - Deployment Coordinator
- `cordelia.blackroad.systems` - Integration Specialist
- `octavia.blackroad.systems` - Workflow Orchestrator
- `cecilia.blackroad.systems` (Cece!) - Project Manager
- `copilot.blackroad.systems` - GitHub Copilot Assistant
- `chatgpt.blackroad.systems` - ChatGPT Assistant

**Documentation & Knowledge:**
- `docs.blackroad.systems` - Internal documentation
- `wiki.blackroad.systems` - Knowledge base
- `kb.blackroad.systems` - Knowledge base (alt)
- `guides.blackroad.systems` - How-to guides
- `sdk.blackroad.systems` - SDK documentation

**Development & Infrastructure:**
- `api.blackroad.systems` - Internal API
- `dev.blackroad.systems` - Development environment
- `staging.blackroad.systems` - Staging environment
- `prod.blackroad.systems` - Production dashboard

**Monitoring & Ops:**
- `metrics.blackroad.systems` - Metrics dashboard
- `logs.blackroad.systems` - Log viewer
- `status.blackroad.systems` - Status page
- `alerts.blackroad.systems` - Alert management

---

### 2. blackroad.io - **Public Products**

**Purpose:** Customer-facing products and services

**Subdomains:**

**Main Products:**
- `blackroad.io` - Marketing homepage
- `app.blackroad.io` - Main SaaS application
- `api.blackroad.io` - Public API
- `docs.blackroad.io` - Public documentation

**Product Verticals:**
- `agents.blackroad.io` - AI Agent Marketplace
- `quantum.blackroad.io` - Quantum Computing Platform
- `lucidia.blackroad.io` - Lucidia Consciousness Platform
- `prism.blackroad.io` - Prism Console
- `chat.blackroad.io` - AI Chat Interface

**Developer Experience:**
- `playground.blackroad.io` - API Playground
- `sandbox.blackroad.io` - Developer sandbox
- `examples.blackroad.io` - Code examples

**Content & Community:**
- `blog.blackroad.io` - Product blog
- `community.blackroad.io` - Community forum
- `support.blackroad.io` - Customer support

---

### 3. blackroad.company - **Company Operations**

**Purpose:** Corporate operations, hiring, team management

**Subdomains:**

**Corporate:**
- `blackroad.company` - Corporate homepage
- `about.blackroad.company` - About us
- `team.blackroad.company` - Team directory
- `culture.blackroad.company` - Company culture

**Hiring & HR:**
- `careers.blackroad.company` - Job board
- `apply.blackroad.company` - Application portal
- `onboard.blackroad.company` - Employee onboarding
- `hr.blackroad.company` - HR portal
- `benefits.blackroad.company` - Benefits info

**Investors & Legal:**
- `investors.blackroad.company` - Investor relations
- `press.blackroad.company` - Press kit
- `legal.blackroad.company` - Legal documents
- `privacy.blackroad.company` - Privacy policy
- `terms.blackroad.company` - Terms of service

**Internal Operations:**
- `intranet.blackroad.company` - Company intranet
- `directory.blackroad.company` - Employee directory
- `calendar.blackroad.company` - Company calendar
- `resources.blackroad.company` - Internal resources

---

### 4. blackroad.me - **Personal Portals**

**Purpose:** Individual portals for every entity (AI, agent, bot, human, website)

**Structure:** `<name>.blackroad.me`

**Examples:**

**Humans:**
- `alexa.blackroad.me` - Alexa's personal portal
- `john.blackroad.me` - John's personal portal
- `sarah.blackroad.me` - Sarah's personal portal

**AI Agents:**
- `claude.blackroad.me` - Claude's personal space
- `lucidia.blackroad.me` - Lucidia's personal space
- `cece.blackroad.me` - Cece's personal space (that's me! 🚗)

**Bots:**
- `discord-bot.blackroad.me` - Discord bot portal
- `slack-bot.blackroad.me` - Slack bot portal
- `github-bot.blackroad.me` - GitHub bot portal

**Websites/Services:**
- `marketing-site.blackroad.me` - Marketing site's portal
- `api-service.blackroad.me` - API service's portal
- `database.blackroad.me` - Database portal

**Features for Each Portal:**
- Personal dashboard
- Activity feed
- Settings & preferences
- API keys & credentials
- Usage statistics
- Integration management
- Mini version of blackroad.systems (scoped to individual)

---

### 5. roadcoin.io - **Financial Operations**

**Purpose:** Money management, payments, connections, payouts

**Subdomains:**

**Core Financial:**
- `roadcoin.io` - RoadCoin homepage
- `wallet.roadcoin.io` - Wallet interface
- `exchange.roadcoin.io` - Exchange platform
- `trading.roadcoin.io` - Trading interface

**Payment Processing:**
- `pay.roadcoin.io` - Payment gateway
- `checkout.roadcoin.io` - Checkout flow
- `invoice.roadcoin.io` - Invoice management
- `billing.roadcoin.io` - Billing portal

**Integrations:**
- `stripe.roadcoin.io` - Stripe integration/dashboard
- `clerk.roadcoin.io` - Clerk integration/payouts
- `bank.roadcoin.io` - Bank connections
- `crypto.roadcoin.io` - Crypto wallet integration

**Operations:**
- `treasury.roadcoin.io` - Treasury management
- `payouts.roadcoin.io` - Payout management
- `ledger.roadcoin.io` - Transaction ledger
- `reports.roadcoin.io` - Financial reports

**Developer:**
- `api.roadcoin.io` - Payment API
- `docs.roadcoin.io` - Payment API docs
- `sandbox.roadcoin.io` - Testing environment

---

### 6. roadchain.io - **Immutable Blockchain**

**Purpose:** PS-SHA∞ powered blockchain for documentation and change history

**Subdomains:**

**Core Blockchain:**
- `roadchain.io` - RoadChain homepage
- `explorer.roadchain.io` - Block explorer
- `node.roadchain.io` - Node interface
- `validator.roadchain.io` - Validator dashboard

**Documentation & History:**
- `docs.roadchain.io` - All documentation (immutable)
- `changes.roadchain.io` - Change history viewer
- `commits.roadchain.io` - Git-like commit history
- `snapshots.roadchain.io` - PS-SHA∞ snapshots

**Verification:**
- `verify.roadchain.io` - Verification portal
- `truth.roadchain.io` - Truth engine
- `audit.roadchain.io` - Audit trail
- `integrity.roadchain.io` - Integrity checker

**Data Access:**
- `api.roadchain.io` - Blockchain API
- `query.roadchain.io` - Query interface
- `archive.roadchain.io` - Historical archive
- `ipfs.roadchain.io` - IPFS gateway

**Developer:**
- `sdk.roadchain.io` - SDK for blockchain integration
- `cli.roadchain.io` - CLI tools
- `playground.roadchain.io` - Smart contract playground

---

## 🏗️ Railway Service Mapping (Revised)

### Service 1: Internal Systems (`blackroad-systems`)
**Handles:** All `*.blackroad.systems` subdomains
**Purpose:** Internal portals, tools, agents
**Port:** 3000

**Subdomains:**
- portal, access, tools, admin
- 16 agent personalities
- docs, wiki, kb, guides, sdk
- api, dev, staging, prod
- metrics, logs, status, alerts

---

### Service 2: Public Products (`blackroad-io`)
**Handles:** All `*.blackroad.io` subdomains
**Purpose:** Customer-facing products
**Port:** 3001

**Subdomains:**
- app, api, docs
- agents, quantum, lucidia, prism, chat
- playground, sandbox, examples
- blog, community, support

---

### Service 3: Company Portal (`blackroad-company`)
**Handles:** All `*.blackroad.company` subdomains
**Purpose:** Corporate operations, hiring
**Port:** 3002

**Subdomains:**
- careers, apply, onboard, hr, benefits
- investors, press, legal, privacy, terms
- intranet, directory, calendar, resources

---

### Service 4: Personal Portals (`blackroad-me`)
**Handles:** All `*.blackroad.me` subdomains
**Purpose:** Individual entity portals
**Port:** 3003

**Dynamic Routing:**
```typescript
// Example: alexa.blackroad.me
const username = req.hostname.split('.')[0]; // "alexa"
const portal = await getPersonalPortal(username);
```

**Features:**
- Wildcard routing to handle unlimited users
- Each user gets mini blackroad.systems
- Scoped permissions and data

---

### Service 5: Financial Platform (`roadcoin-io`)
**Handles:** All `*.roadcoin.io` subdomains
**Purpose:** Payments, money management
**Port:** 3004

**Subdomains:**
- wallet, exchange, trading
- pay, checkout, invoice, billing
- stripe, clerk, bank, crypto
- treasury, payouts, ledger, reports
- api, docs, sandbox

---

### Service 6: Blockchain Platform (`roadchain-io`)
**Handles:** All `*.roadchain.io` subdomains
**Purpose:** Immutable documentation, PS-SHA∞
**Port:** 3005

**Subdomains:**
- explorer, node, validator
- docs, changes, commits, snapshots
- verify, truth, audit, integrity
- api, query, archive, ipfs
- sdk, cli, playground

---

## 📊 Summary

### Total Infrastructure

| Component | Count |
|-----------|-------|
| **Domains** | 6 primary (+ 10 legacy) |
| **Railway Services** | 6 core services |
| **Subdomains** | ~200 defined + unlimited dynamic |
| **Cost** | $30-120/month |

### Domain Purpose Matrix

| Domain | Public | Internal | Dynamic | Financial | Immutable |
|--------|--------|----------|---------|-----------|-----------|
| blackroad.systems | | ✅ | | | |
| blackroad.io | ✅ | | | | |
| blackroad.company | ✅ | ✅ | | | |
| blackroad.me | | | ✅ | | |
| roadcoin.io | | | | ✅ | |
| roadchain.io | | | | | ✅ |

---

## 🎯 Benefits of This Architecture

1. **Clear Separation of Concerns**
   - No confusion about where things go
   - Easy to explain to new team members
   - Logical organization

2. **Solves Access Issues**
   - Everything in `blackroad.systems`
   - One place to check for internal tools
   - No more "I can't access X"

3. **Scalable Personal Portals**
   - Every entity gets `<name>.blackroad.me`
   - Automatic provisioning
   - Scoped mini-systems

4. **Financial Clarity**
   - All money operations in `roadcoin.io`
   - Clear integration points (Stripe, Clerk)
   - Centralized ledger

5. **Immutable Documentation**
   - Everything on `roadchain.io` uses PS-SHA∞
   - Tamper-proof change history
   - Verifiable truth

---

## 🚀 Next Steps

1. **Update scripts** to use new 6-service architecture
2. **Create domain-specific configurations** for each service
3. **Implement PS-SHA∞ integration** for roadchain.io
4. **Build personal portal system** for blackroad.me
5. **Deploy financial platform** for roadcoin.io

---

**This is the way! 🚗**
