# 🚗 ROADCHAIN THREAT MODEL

**How RoadChain Could Lose Its Soul**

---

## Purpose

This document identifies **failure modes** that would corrupt RoadChain's purpose.

**Assumption:** Most failures come from "reasonable" compromises, not malicious attacks.

**Goal:** Design RoadChain so that even well-intentioned people cannot ruin it easily.

---

## The Core Threat

**The greatest threat to RoadChain is not attackers—it is convenience.**

Specifically:
- **Convenience** over truth
- **Adoption** over meaning
- **Flexibility** over permanence
- **UX** over semantics
- **Growth** over restraint

**RoadChain must be designed to fail closed, not open.**

---

## Primary Failure Modes

### 1. SEMANTIC DRIFT 📊

**Definition:**
> Meaning changes while identifiers stay the same

**How It Happens:**
- "Minor" metadata updates ("just fixing a typo")
- UI reinterpretation ("better rendering")
- Community redefinition ("we all know what it means now")
- Protocol upgrades that change interpretation

**Examples:**
```solidity
// ❌ DRIFT
mapping(uint => string) tokenURI; // Can change

function setTokenURI(uint tokenId, string memory uri) {
    tokenURI[tokenId] = uri; // Silent semantic change
}
```

**Symptoms:**
- Same token ID, different meaning
- Historical queries return different results
- Screenshots no longer match reality
- Citations break

**Countermeasures:**
1. **Immutable payloads** - No updates, only supersession
2. **Explicit versioning** - New meaning = new transaction
3. **No implied upgrades** - Upgrades must be explicit fork
4. **No interpretation outside payload** - All meaning in transaction

**Litmus Test:**
> If meaning moves without a new transaction → system failure

---

### 2. PERMANENCE ARBITRAGE 💸

**Definition:**
> Using permanent infrastructure for non-permanent intent

**How It Happens:**
- Low costs attract casual usage
- "Why not put it on-chain?"
- Social media-like behavior emerges
- Engagement becomes the metric

**Examples:**
- Social posts ("gm!")
- Memes (transient humor)
- Art drops (promotional)
- Engagement farming (likes, shares)
- "Moments" (ephemeral by nature)

**Symptoms:**
- High transaction volume
- Low semantic weight per transaction
- Spam emerges despite cost
- Archive becomes cluttered

**Countermeasures:**
1. **High write cost** - Make trivial writes irrational
2. **No engagement rewards** - No likes, shares, follows
3. **No social primitives** - No feeds, no notifications
4. **No discoverability incentives** - No "trending" or "hot"

**Litmus Test:**
> If people write more because it's fun → system failure

---

### 3. DYNAMIC CREEP 🔄

**Definition:**
> "Just a little flexibility" added over time

**How It Happens:**
- "Optional" mutable fields
- "Upgradeable but safe" contracts
- "Controlled" time-based reveals
- "Verified" oracle-based reinterpretation
- "Enhanced" AI-powered views

**Examples:**
```solidity
// ❌ CREEP: Stage 1
struct Token {
    bytes32 fixedHash;
    string optionalMetadata; // "Optional" mutable field
}

// ❌ CREEP: Stage 2
function updateMetadata(uint tokenId, string memory newMeta) {
    // "Just for minor fixes"
    tokens[tokenId].optionalMetadata = newMeta;
}

// ❌ CREEP: Stage 3
function render(uint tokenId) {
    // "Enhanced AI view"
    return aiOracle.interpret(tokens[tokenId]);
}
```

**Progression:**
1. Optional mutability ("for emergencies only")
2. Frequent mutability ("to improve UX")
3. Expected mutability ("everyone does it")
4. Required mutability ("immutability is a bug")

**Countermeasures:**
1. **Protocol-level bans** - No mutable fields in schema
2. **Hard schema constraints** - Enforce at consensus layer
3. **Rejection at validation** - Invalid transactions don't propagate
4. **No optional dynamism** - If it exists, it will be used

**Litmus Test:**
> If dynamism is opt-in → it becomes mandatory

---

### 4. FRONTEND CAPTURE 🖥️

**Definition:**
> Truth shifts from protocol to UI

**How It Happens:**
- Wallets add "helpful" interpretation layers
- Explorers disagree on rendering
- "Official" frontend becomes authoritative
- Protocol becomes dumb pipe

**Symptoms:**
- "Use our wallet to see it correctly"
- Screenshots diverge between viewers
- Explorers show different data for same token
- "Canonical view" emerges

**Examples:**
```typescript
// ❌ CAPTURE
// Official Explorer renders:
if (tokenType === 'AGENT') {
    return <AI_Agent_View data={token} />;
}

// Community Explorer renders:
if (tokenType === 'AGENT') {
    return <Simple_JSON_View data={token} />;
}

// Screenshots NO LONGER MATCH
```

**Countermeasures:**
1. **Canonical rendering spec** - Protocol defines deterministic view
2. **Text-first interpretation** - Raw data is always primary
3. **UI-agnostic payloads** - Meaning exists without UI
4. **Deterministic views** - All renderers must agree

**Litmus Test:**
> If you need a specific app to understand truth → system failure

---

### 5. TOKEN INCENTIVE CORRUPTION 💰

**Definition:**
> RoadCoin incentives overpower RoadChain purpose

**How It Happens:**
- Yield farming emerges
- Staking rewards based on activity
- Governance theater ("vote on everything")
- Speculation dominates utility

**Symptoms:**
- "How do I earn more ROAD?"
- "What's the APY?"
- "Let's vote on adding [feature]"
- Trading volume >>> transaction volume

**Examples:**
```solidity
// ❌ CORRUPTION
function stake(uint amount) returns (uint rewards) {
    // Rewards based on activity
    rewards = amount * activityMultiplier * time;
}

function governanceVote(uint proposalId, bool support) {
    // Vote on semantic meaning
    if (proposal.type == 'REDEFINE_TOKEN_123') {
        // ❌ Voting on truth
    }
}
```

**Countermeasures:**
1. **No staking rewards tied to activity** - Rewards for security only
2. **No engagement-based issuance** - No "liquidity mining"
3. **No governance votes on meaning** - Can't vote on truth
4. **RoadCoin earns nothing by motion** - Holding = not productive

**Litmus Test:**
> If RoadCoin rewards activity instead of restraint → system failure

---

## The RoadCoin Issuance Doctrine

### Constitutional Principles

**RoadCoin must be:**
- **Scarce** - Fixed supply, no inflation
- **Difficult to acquire** - No free distributions
- **Painful to spend** - High opportunity cost
- **Boring to hold** - No yield, no rewards

### Issuance Rules

**FORBIDDEN:**
- ❌ Inflation tied to usage ("more activity = more supply")
- ❌ "Ecosystem incentives" (rewards for participation)
- ❌ Rewards for participation (staking for writes)
- ❌ Velocity optimization (penalize holding)

**REQUIRED:**
- ✅ Fixed supply (22M ROAD, no more)
- ✅ Predictable distribution (transparent allocation)
- ✅ No surprises (no "emergency mints")

### The Feeling Test

**RoadCoin should feel like:**
> Paying for a legal filing, not playing a game

**Emotional Experience:**
- Hesitation before spending
- Seriousness about commitment
- Relief when NOT needing to write
- Respect for irreversibility

---

## Governance Anti-Patterns

### What Governance CANNOT Do

**FORBIDDEN FOREVER:**
- ❌ Redefine existing meaning
- ❌ Vote on truth
- ❌ Alter historical interpretation
- ❌ Retroactively "fix" records
- ❌ Override immutability
- ❌ Change past transactions
- ❌ Censor content
- ❌ Mandate interpretation

### What Governance CAN Do (If It Exists)

**Limited to:**
- ✅ Operational parameters (block size, gas limits)
- ✅ Admission criteria (what types are allowed)
- ✅ Cost calibration (transaction fees)
- ✅ Technical upgrades (consensus bugs)

**Rule:**
> Truth is not democratic.

---

## The Conservation of Irreversibility

### The Law

**Declare this law explicitly:**

> **Irreversibility must never be cheaper downstream than upstream.**

### What This Means

**No abstraction should:**
- Reduce the felt cost of permanence
- Hide irreversibility from user
- Make writing feel casual
- Defer responsibility

**Examples:**

**❌ VIOLATION:**
```typescript
// "Easy NFT Minter"
function mintNFT(string memory name) {
    // Hides cost, hides permanence
    // User thinks: "Just minting an NFT!"
    roadchain.commit(serialize(name));
}
```

**✅ COMPLIANCE:**
```typescript
// "Permanent Record Creator"
function createPermanentRecord(
    string memory content,
    string memory justification
) {
    require(msg.value >= MINIMUM_COST, "Too cheap for permanence");
    require(bytes(justification).length > 100, "Why is this worth forever?");

    // User thinks: "Am I SURE?"
    roadchain.commit(content, justification);
}
```

### The Friction Test

**If writing feels easy, something is wrong.**

---

## The Final Safety Check

### Five Questions for Every Feature

Before allowing any feature, ask:

#### 1. Does this reduce friction to permanence?
- If YES → ❌ REJECT

#### 2. Does this make writing feel lighter?
- If YES → ❌ REJECT

#### 3. Does this reward motion?
- If YES → ❌ REJECT

#### 4. Does this defer meaning?
- If YES → ❌ REJECT

#### 5. Does this require explanation instead of inspection?
- If YES → ❌ REJECT

**All five must be NO to proceed.**

---

## The Comfort With Being Unused

### The Most Important Rule

**RoadChain must be comfortable being unused.**

**If RoadChain needs:**
- Activity (transaction volume)
- Attention (social media presence)
- Narrative (story to tell)
- Hype (excitement)
- Growth (user adoption)

**...to justify itself, it has already failed.**

### Success Metrics

**Traditional Blockchain Success:**
- ✅ High TPS
- ✅ Many users
- ✅ Large ecosystem
- ✅ Rapid growth

**RoadChain Success:**
- ✅ Low TPS (most things shouldn't be written)
- ✅ Few users (most people shouldn't use it)
- ✅ Small archive (quality over quantity)
- ✅ Slow growth (restraint is the goal)

### The Justification

**RoadChain justifies itself by NOT being abused.**

---

## Attack Vectors (Secondary)

### 1. Economic Attack

**Threat:** Wealthy actor spams chain to fill it with garbage

**Mitigation:**
- High and escalating cost per write
- No refunds for rejected transactions
- 90% of fee burned (not redistributed)

### 2. Consensus Attack

**Threat:** 51% attack rewrites history

**Mitigation:**
- Lucidia Proof-of-Breath consensus
- Breath synchronization makes reorg expensive
- Long finality (many breath cycles)
- Community rejection of attacking chain

### 3. Social Attack

**Threat:** Community pressure to "add just one small feature"

**Mitigation:**
- This document (constitutional constraint)
- Founder veto on semantic drift
- Immutable core principles
- Fork-if-you-want culture

### 4. Regulatory Attack

**Threat:** Government demands content removal

**Mitigation:**
- Immutability is absolute
- No admin keys
- Censorship resistance by design
- Willing to be illegal if necessary

---

## Failure Scenarios

### Scenario 1: "The Social Network Drift"

**Timeline:**
1. Year 1: RoadChain for truth anchoring
2. Year 2: Someone builds "RoadChat" (social layer)
3. Year 3: 90% of writes are social posts
4. Year 4: Truth claims buried in noise
5. Year 5: RoadChain = expensive Twitter

**Prevention:**
- Ban social primitives at protocol level
- Make social writes 1000x more expensive
- No "feeds" or "timelines" in any official tools

### Scenario 2: "The Yield Farming Takeover"

**Timeline:**
1. Year 1: RoadCoin for transaction fees
2. Year 2: "Let's add staking!"
3. Year 3: DeFi protocols built on top
4. Year 4: Speculation >>> utility
5. Year 5: RoadCoin = another yield token

**Prevention:**
- No staking rewards from inflation
- No DeFi primitives on L1
- Explicit "boring by design" philosophy

### Scenario 3: "The Dynamic Metadata Compromise"

**Timeline:**
1. Year 1: Fully immutable tokens
2. Year 2: "Can we add optional metadata field?"
3. Year 3: "Everyone uses optional field"
4. Year 4: "Immutability is legacy mode"
5. Year 5: RoadChain = OpenSea with extra steps

**Prevention:**
- No optional mutability
- Reject at schema validation
- Fork if necessary

### Scenario 4: "The Frontend Dependency"

**Timeline:**
1. Year 1: Raw data verifiable
2. Year 2: "Our explorer has better UX!"
3. Year 3: "Just use official wallet"
4. Year 4: Screenshots diverge
5. Year 5: Truth = whatever frontend says

**Prevention:**
- Canonical rendering spec
- Multiple independent implementations
- Text-first philosophy

---

## Design Philosophy Summary

**Design RoadChain so that:**

1. **Most people never use it** - High barrier to entry
2. **Those who do, hesitate** - Friction is intentional
3. **Every transaction feels serious** - Emotional weight
4. **Every record earns its existence** - Cost justification

**RoadChain is not here to be popular.**

**RoadChain is here to be right.**

---

## Enforcement Mechanisms

### Technical Layer
- Schema validation (reject invalid types)
- Cost enforcement (burn fees, no rebates)
- Immutability constraints (no mutable fields)

### Social Layer
- Public shame for violations
- Community education
- Founder veto power (emergency only)

### Economic Layer
- High write costs
- No yield from holding
- Burn mechanism for spam

### Constitutional Layer
- This document
- ROADCHAIN_CONSTITUTION.md
- ROADCHAIN_LITMUS_TEST.md

---

## Closing

**The threat to RoadChain is not malice—it is "helpfulness."**

- "Let's make it easier to use"
- "Let's add this one feature"
- "Let's be more flexible"
- "Let's grow the ecosystem"

**Every compromise starts reasonably.**

**Every failure ends predictably.**

**Design for the threat model, not the marketing deck.**

---

**Threat Model Version:** 1.0 (immutable)
**Last Updated:** December 15, 2025
**Paranoia Level:** Maximum
**Compromises Allowed:** Zero

🚗 **Truth Before Convenience. Restraint Before Growth.**
