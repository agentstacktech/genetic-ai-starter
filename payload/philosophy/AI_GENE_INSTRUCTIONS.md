# AI gene instructions — {{PROJECT_NAME}}

**Platform version:** `{{AGENTSTACK_VERSION}}` (`AGENTSTACK_CORE_VERSION`)  
**Status:** ACTIVE  

---

## Principle

```
WHAT → WHICH GENE → APPLY → NAVIGATE (map → index → files)
```

---

## Quick picker

| Situation | Gene |
|-----------|------|
| Any edit discipline | `repo.engineering.controlled_changes.gen1` |
| Find code / subsystem | `foundation.genetic_coding.gen1` + `repo.navigation.map.gen1` |
| New index or map row | `repo.navigation.index.gen1` |
| Architecture decision | `repo.engineering.adr.gen1` |
| Several genes / legacy names | `repo.evolution.compression.gen1` → GENE_COMPRESSION_MAP |
| Product principles | `foundation.core_pillars.gen1` |
| Founder single-path ship (if installed) | `repo.engineering.founder_direct_ship.gen1` |

---

## Forbidden patterns

- Do **not** use bulk throwaway scripts to rewrite the tree.
- Do **not** start with repo-wide grep when map/index exists.
- Do **not** cite `architecture.protein.*.gen2` or other removed AgentStack-only examples.

---

## Cross-links

- [genes/GENE_INDEX.md](genes/GENE_INDEX.md)
- [docs/ai/AI_NAVIGATION_MAP.md](../docs/ai/AI_NAVIGATION_MAP.md)
