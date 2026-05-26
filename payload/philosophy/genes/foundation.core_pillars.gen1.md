# Gene — `foundation.core_pillars.gen1` (umbrella)

**Genetic tag:** `foundation.core_pillars.gen1`  
**Category:** foundation  
**Priority:** **READ FIRST** (before domain clusters in [GENE_COMPRESSION_MAP.md](GENE_COMPRESSION_MAP.md))  
**Status:** ACTIVE  

---

## Intent

**Product-engineering pillars** — the *judgment layer* behind every `.gen1` domain gene. Compression maps (Clusters A–M) answer *where files live*; pillars answer *whether the change is allowed*.

> **Compression warning:** After the 2026 gene wave, many `GENE_*_GEN2.md` files became **redirect stubs** (tag preserved, body moved). Stubs are **not** empty philosophy — they point at umbrellas. If a principle reads like a one-line bullet in PHILOSOPHY_INDEX, open the **pillar gene** below or the **long-form** doc in the right column.

---

## Pillars (with canonical genes)

| Pillar | One-line test | Gene | Long-form / archive |
|--------|---------------|------|---------------------|
| **Creation over Conflict** | Does this **remove** a class of fights (second bus, second inbox)? | [foundation.creation_over_conflict.gen1.md](foundation.creation_over_conflict.gen1.md) | [LANCE_PRINCIPLE_CREATION_OVER_CONFLICT.md](../principles/LANCE_CREATION_OVER_CONFLICT.md) |
| **Elegant Minimalism** | One primitive per job; native over special? | [foundation.elegant_minimalism.gen1.md](foundation.elegant_minimalism.gen1.md) | [ELEGANT_MINIMALISM_PRINCIPLE.md](../principles/ELEGANT_MINIMALISM.md) |
| **Decomposition → Reassembly** | Can we ship **one bite** of the elephant with a done criterion? | [foundation.decomposition_reassembly.gen1.md](foundation.decomposition_reassembly.gen1.md) | PHILOSOPHY_INDEX § Decomposition; stories in [docs/journals/](https://github.com/agentstacktech/AgentStack/tree/main/docs/journals/) |
| **Absolute Optimization** | Max function per unit cost *for the consumer of information* (human, AI, robot)? | [foundation.absolute_optimization.gen1.md](foundation.absolute_optimization.gen1.md) | [FOUNDATION_HERITAGE_READING.md](../archive/FOUNDATION_HERITAGE_READING.md) (heritage wording) |
| **Time-Decomposition-Completion** | Is the slice **finished** (tests, docs, version gate)? | [foundation.time_decomposition.gen1.md](foundation.time_decomposition.gen1.md) | [JOURNAL_STORY_TEMPLATE.md](https://github.com/agentstacktech/AgentStack/tree/main/docs/journals/JOURNAL_STORY_TEMPLATE.md) |
| **Observability first** | Can ops/agent diagnose without guessing? | (cross-cutting) | `shared.diagnostics.unified.gen1`, OpTrace, runbooks |
| **Biomimetic resilience** | Degrade gracefully; no silent user failure? | (cross-cutting) | `shared.immune.system.gen1`, organelle bundles |
| **Controlled change** | Reviewable diffs, no throwaway tree rewriters? | [repo.engineering.controlled_changes.gen1.md](repo.engineering.controlled_changes.gen1.md) | [repo.engineering.founder_direct_ship.gen1.md](repo.engineering.founder_direct_ship.gen1.md) |

---

## How pillars compose (example: messenger 0.4.9)

1. **Creation** — IDB mirror instead of a second polling protocol.  
2. **Minimalism** — one op-log, one delta endpoint.  
3. **Decomposition** — SyncEngine = heap + hedge + breaker modules.  
4. **TDC** — journal + ADR + beacons before percent rollout.  
5. **Observability** — `messengerBeacons`, diagnostics page.

Same pattern for unified 8DNA (0.4.7), dual-shell (0.4.11), ownership plane (0.4.13) — see [EVOLUTION_JOURNAL.md](../PHILOSOPHY_INDEX.md).

---

## AI instructions

1. **Name the pillar** in design summaries (“Creation: extend delta, no parallel inbox”).  
2. If a proposal adds a **second path** “for safety”, default to **merge or delete** unless the user explicitly asked for rollout machinery ([platform-vs-tenant-canary](https://github.com/agentstacktech/AgentStack/tree/main/.cursor/rules/platform-vs-tenant-canary.mdc)).  
3. **Do not** treat empty-looking `GENE_*_GEN2` as doctrine — resolve via [gene_document_resolver.py](https://github.com/agentstacktech/AgentStack/tree/main/philosophy/gene_document_resolver.py) or open the linked `.gen1`.  
4. **Reading order:** this file → pillar gene for your decision → [GENE_COMPRESSION_MAP.md](GENE_COMPRESSION_MAP.md) cluster → subsystem `AI_INDEX.md`.

---

## Cross-links

| Resource | Role |
|----------|------|
| [PHILOSOPHY_INDEX.md](../PHILOSOPHY_INDEX.md) | Insight layer (why) — do not confuse with mechanics |
| [GENE_COMPRESSION_MAP.md](GENE_COMPRESSION_MAP.md) | Mechanics layer (which tags) |
| [docs/journals/README.md](https://github.com/agentstacktech/AgentStack/tree/main/docs/journals/README.md) | Story layer (what shipped when) |
| [archive/FOUNDATION_HERITAGE_READING.md](../archive/FOUNDATION_HERITAGE_READING.md) | How to read post-compression stubs |
| [EVOLUTION_JOURNAL.md](../PHILOSOPHY_INDEX.md) | Organism timeline |
