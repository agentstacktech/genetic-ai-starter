# Gene — `foundation.decomposition_reassembly.gen1`

**Genetic tag:** `foundation.decomposition_reassembly.gen1`  
**Also known as:** Modular Design (v0.2.53), “eat the elephant one bite at a time”  
**Pairs with:** [foundation.time_decomposition.gen1.md](foundation.time_decomposition.gen1.md) (time axis of the same idea)

---

## Core metaphor (Lance / PHILOSOPHY_INDEX)

> **«Слон по кускам»** — сложная система перестаёт пугать, когда у каждого куска есть граница, тест и критерий «готово».

**Decomposition** — разрезать на модули с **явными контрактами**.  
**Reassembly** — собрать в **тонком оркестраторе** (shell, service facade, `compose()`, gene cluster map), не в монолите.

This is **not** microservices for their own sake. It is **cognitive + evolutionary** decomposition: each piece can evolve or be replaced without rewiring the whole organism.

---

## Layer model on AgentStack (biology ↔ engineering)

| Layer | Biology | Engineering | Example |
|-------|---------|-------------|---------|
| **L0** | Atoms | Pure functions, validators | `shared/atoms/timeline_key.py` |
| **L1** | Processes | Processors, protein chain | `core.processors.*` |
| **L2** | Organelles | Small composable services | `RingPoolOrganelle`, support organelles |
| **L3** | Organs | Product surfaces | Messenger, dual-shell, Agents Fleet |
| **Connective tissue** | — | Docs, genes, indexes | `AI_INDEX.md`, this gene |

See [ORGANELLE_LAYERED_MODEL ADR](https://github.com/agentstacktech/AgentStack/tree/main/docs/adr/ORGANELLE_LAYERED_MODEL.md), story [05_EVOLUTION_ORGANS_ORGANELLES.md](https://github.com/agentstacktech/AgentStack/tree/main/docs/journals/stories/05_EVOLUTION_ORGANS_ORGANELLES.md).

---

## Rules for a valid “bite”

1. **Scope** — one sentence “this bite delivers X”.  
2. **Boundary** — public API (REST, MCP, SDK, gene tag) frozen for the slice.  
3. **Done** — tests, runbook or ADR section, beacon if user-visible.  
4. **No hidden coupling** — sideways links in `AI_INDEX.md`, not surprise imports.  
5. **Reassembly check** — orchestrator file stays thin; if it grows > budget, split again ([PERF_BUDGET](https://github.com/agentstacktech/AgentStack/tree/main/docs/dual-shell/PERF_BUDGET.md) for shell).

**TDC** adds the **time** dimension: bites ship in order with explicit completion ([foundation.time_decomposition.gen1.md](foundation.time_decomposition.gen1.md)).

---

## Examples after compression (meaning, not filenames)

| Elephant | Bites | Reassembly |
|----------|-------|------------|
| Plugin ecosystem | 5 layers × skills (Cursor v0.4.9) | One MCP discovery matrix |
| Docs corpus | Index → stories → articles | [docs/journals/README.md](https://github.com/agentstacktech/AgentStack/tree/main/docs/journals/README.md) |
| 8DNA unification | DDL → repo simplify → organelles → visualizer | Single table + L2 catalog |
| AI Builder Renaissance | UAM → catalog → composer → validation → repair | One `generation_v2` path |
| Dual-shell | audience resolver → nav config → shells → pages map | One router, two chromes |

---

## Anti-patterns

- **Horizontal slice “50% done”** — e.g. new table without migration story (violates TDC).  
- **Decompose without reassembly** — 12 micro-hooks nobody owns.  
- **Reassembly without decomposition** — 3k-line “god service” (fight with Creation: new smaller world).

---

## AI instructions

- Large tasks: list bites in PR description; map each to a pillar.  
- Prefer **subsystem `AI_INDEX.md`** over repo-wide grep ([foundation.ai_gene_interface.gen1.md](foundation.ai_gene_interface.gen1.md)).  
- Journals use TDC headings — mirror that structure in substantial changes.

---

## Cross-links

- [foundation.core_pillars.gen1.md](foundation.core_pillars.gen1.md)  
- [foundation.creation_over_conflict.gen1.md](foundation.creation_over_conflict.gen1.md)  
- [GENE_COMPRESSION_MAP.md](GENE_COMPRESSION_MAP.md) — clusters are **reassembly maps**
