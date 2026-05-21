# Gene — `foundation.ai_gene_interface.gen1`

**Genetic tag:** `foundation.ai_gene_interface.gen1`  
**Category:** foundation  
**Status:** ACTIVE  

---

## Intent

Contract for **how AI agents read genes** in this repository (markdown-only; no runtime resolver required).

---

## Workflow

```
WHAT AM I DOING → WHICH GENE → APPLY INSTRUCTIONS → EDIT WITH NAVIGATION
```

1. **Situation:** new feature, bugfix, refactor, docs, test, release.
2. **Pick gene:** [GENE_INDEX.md](GENE_INDEX.md) or [GENE_COMPRESSION_MAP.md](GENE_COMPRESSION_MAP.md) if multiple contours.
3. **Apply:** follow **AI INSTRUCTIONS** section in the gene file.
4. **Navigate:** `docs/ai/AI_NAVIGATION_MAP.md` → `AI_INDEX.md` → hot files (never skip for large subsystems).

---

## Do not

- Open 10+ gene files in parallel for one subsystem — use **compression map** cluster.
- Reference obsolete `architecture.protein.*.gen2` examples.
- Bulk-rewrite the tree — see `repo.engineering.controlled_changes.gen1`.

---

## Cross-links

- [AI_GENE_INSTRUCTIONS.md](../AI_GENE_INSTRUCTIONS.md)
- [.cursor/rules/genetic-navigation.mdc](../../.cursor/rules/genetic-navigation.mdc)
