# Gene — `foundation.ai_gene_interface.gen1` (foundation tier)

**Genetic tag:** `foundation.ai_gene_interface.gen1`  
**Scope:** How AI agents **read and apply** philosophy without drowning in heritage noise.

**Canonical:** [AI_GENE_INSTRUCTIONS.md](../AI_GENE_INSTRUCTIONS.md) (historical breadth) + **this file** (2026 read order) + `.cursor/rules/genetic-navigation.mdc`.

---

## Problem after compression

Early `AI_GENE_INSTRUCTIONS.md` lists many **`*.gen2`** paths (`architecture.protein.universe…`, `superservice.implementation…`). Those tags remain in **genes_config** for tooling, but **decisions** must come from:

1. [foundation.core_pillars.gen1.md](foundation.core_pillars.gen1.md)  
2. Domain **`.gen1`** umbrella for your cluster  
3. [GENE_COMPRESSION_MAP.md](GENE_COMPRESSION_MAP.md)  
4. Subsystem **`AI_INDEX.md`**

**Do not** pick a random gen2 file because it appears in an old instruction table.

---

## Decision flow (each action)

```
Task in natural language
  → Which pillar applies? (creation / minimalism / decomposition / TDC)
  → Which cluster in GENE_COMPRESSION_MAP?
  → Tier-0/1 row in AI_NAVIGATION_MAP
  → AI_INDEX hot files (1–3)
  → Edit + update index if boundary moved
```

**Loader:** [ai_gene_interface.py](https://github.com/agentstacktech/AgentStack/tree/main/philosophy/ai_gene_interface.py) + [gene_document_resolver.py](https://github.com/agentstacktech/AgentStack/tree/main/philosophy/gene_document_resolver.py) follow **redirect headers** on stubs to umbrella markdown.

---

## Three philosophy layers (do not merge)

| Layer | Reader | File |
|-------|--------|------|
| **Insight (why)** | Founder, PM, architect | [PHILOSOPHY_INDEX.md](../PHILOSOPHY_INDEX.md) |
| **Mechanics (tags)** | Implementer, agent | Genes + [GENE_COMPRESSION_MAP.md](GENE_COMPRESSION_MAP.md) |
| **Story (when)** | Historian, onboarding | [docs/journals/](https://github.com/agentstacktech/AgentStack/tree/main/docs/journals/) |

Promo funnel is a **fourth** audience layer — see `frontend.promo.dual_audience_funnel.gen1`, not shell genes.

---

## When to cite a gene vs an ADR

| Situation | Cite |
|-----------|------|
| **Why** we chose a contour | `.gen1` foundation or domain gene |
| **What** exactly ships (API, schema) | ADR + CHANGELOG |
| **Where** to edit | `AI_INDEX.md` + hot files |
| **Regression hunt** | Runbook + beacons |

---

## AI instructions

- Summaries should name **pillar + genetic tag**, not legacy `GENE_PHILOSOPHY__*` filenames.  
- If two genes say the same thing, trust the **umbrella `.gen1`** linked from [GENE_INDEX.md](GENE_INDEX.md) consolidation table.  
- Read [archive/FOUNDATION_HERITAGE_READING.md](../archive/FOUNDATION_HERITAGE_READING.md) when a stub’s body is empty.

---

## Cross-links

- [foundation.genetic_coding.gen1.md](foundation.genetic_coding.gen1.md)  
- [repo.evolution.compression.gen1.md](repo.evolution.compression.gen1.md) — meta gene for compression procedure
