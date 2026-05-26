# Gene — `foundation.genetic_coding.gen1` (foundation tier)

**Genetic tag:** `foundation.genetic_coding.gen1`  
**Scope:** Semantic tags + AI navigation — the **address language** for meaning → module trees.

**Canonical docs:** [docs/AI_INDEXING_SYSTEM.md](../../docs/ai/AI_INDEXING_SYSTEM.md), [docs/AI_NAVIGATION_MAP.md](../../docs/ai/AI_NAVIGATION_MAP.md), [AI_GENE_INSTRUCTIONS.md](../AI_GENE_INSTRUCTIONS.md).

---

## Why tags exist (meaning lost if only filenames remain)

A folder name (`services/`, `modules/`) tells you **where** code lives, not **what task** you are doing. Tags like `core.social.support.gen1` are **semantic addresses**: they bind *intent* (support desk on messenger plane) to a **Tier-1 row** in the navigation map and a **hot-file list** in `AI_INDEX.md`.

**Compression did not delete meaning** — it moved long duplicate prose into:

1. **Umbrella `.gen1` genes** (one contour, one story)  
2. **Cluster tables** in [GENE_COMPRESSION_MAP.md](GENE_COMPRESSION_MAP.md)  
3. **Git history** + heritage `GENE_*_GEN2` stubs (tag preserved)

If a stub looks empty, resolve via [gene_document_resolver.py](https://github.com/agentstacktech/AgentStack/tree/main/philosophy/gene_document_resolver.py) or read the umbrella named in the stub header.

---

## Tag shape

Pattern: `<domain>.<subsystem>.<role>.<generation>`

| Segment | Examples | Notes |
|---------|----------|-------|
| **domain** | `core`, `shared`, `frontend`, `sdk`, `repo`, `docs` | Package / plane |
| **subsystem** | `social.messenger`, `agents.fleet`, `database.8dna` | Bounded context |
| **role** | `gen1` (stable contract), `gen2` (heritage / rare) | Prefer **gen1** for new work |
| **generation** | `gen1` = current contract generation | Bump only with ADR + map row |

**Forming new tags:** follow [AI_INDEXING_SYSTEM.md](../../docs/ai/AI_INDEXING_SYSTEM.md) §2; add **Tier 1** row when ~10+ integration points.

---

## Reading order (agents)

1. [foundation.core_pillars.gen1.md](foundation.core_pillars.gen1.md) — judgment  
2. [GENE_COMPRESSION_MAP.md](GENE_COMPRESSION_MAP.md) — cluster for your subsystem  
3. `docs/ai/AI_NAVIGATION_MAP.md` — genetic tag → path  
4. Subsystem **`AI_INDEX.md`** — hot files only  
5. Targeted symbol search — **after** the above

**Anti-pattern:** unscoped ripgrep across `` or `src/` for exploration.

---

## Heritage

- GEN2 format era + v0.2.54 refactor — [54_GEN2_FORMAT_AND_AI_GENE_INSTRUCTIONS.md](https://github.com/agentstacktech/AgentStack/tree/main/docs/journals/stories/54_GEN2_FORMAT_AND_AI_GENE_INSTRUCTIONS.md)  
- [archive/genes-legacy/AI_INDEX.md](../archive/FOUNDATION_HERITAGE_READING.md) — legacy filename → umbrella  
- [archive/FOUNDATION_HERITAGE_READING.md](../archive/FOUNDATION_HERITAGE_READING.md)

---

## Cross-links

- [foundation.ai_gene_interface.gen1.md](foundation.ai_gene_interface.gen1.md)  
- `.cursor/rules/genetic-navigation.mdc`
