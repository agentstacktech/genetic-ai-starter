# Gene — `foundation.core_pillars.gen1`

**Genetic tag:** `foundation.core_pillars.gen1`  
**Category:** foundation  
**Priority:** HIGH for all agents  
**Status:** ACTIVE  

---

## Intent

Universal product-engineering pillars. Apply when designing features, reviewing diffs, or choosing between two implementations.

---

## Pillars

### Creation over Conflict

Prefer **one wire, one source of truth**. Extend existing contours instead of parallel products (second cache, second protocol, duplicate admin surface).

### Elegant Minimalism

**One primitive per job.** One facade, one table, one reducer — not three overlapping abstractions.

### Decomposition → Reassembly

Split into **testable slices** (atoms → services → UI). Compose in thin orchestrators; avoid big-bang files.

### Observability first

**Beacons, metrics, runbooks** before tuning blind. Every critical path should be diagnosable without reproducing production manually.

### Biomimetic resilience

**Graceful degrade:** missing capability → pass-through or safe default, not hard failure for users.

### Controlled change

Pair with `repo.engineering.controlled_changes.gen1` — reviewable diffs, maintained tools, no throwaway tree rewriters.

---

## AI instructions

- When proposing architecture, name which pillar supports the choice.
- When a solution adds a second path “for safety”, check **Creation over Conflict** — merge or delete instead.
- Do **not** cite legacy `*.gen2` protein-universe genes; use this gene + domain-specific `.gen1` files.

---

## Cross-links

| Resource | Role |
|----------|------|
| [PHILOSOPHY_INDEX.md](../PHILOSOPHY_INDEX.md) | Master index |
| [repo.engineering.controlled_changes.gen1.md](repo.engineering.controlled_changes.gen1.md) | How to edit code |
| [GENE_COMPRESSION_MAP.md](GENE_COMPRESSION_MAP.md) | Multi-gene reading order |
