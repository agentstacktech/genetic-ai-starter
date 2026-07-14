# Gene — `repo.tooling.gene_lifecycle.gen1`

**Genetic tag:** `repo.tooling.gene_lifecycle.gen1`  
**Status:** ACTIVE (payload mirror)

---

## Intent

Gene **gen1 default**; **gen2** only on contract change + ADR + map row. Redirect stubs preserve stable URLs — edit canonical `.gen1` / marked canonical `.gen2`.

**validate-genes.mjs** (kit) requires: Gene header, Genetic tag, `## Intent`, `## Cross-links` on every payload `*.gen1.md` / `*.gen2.md`.

```bash
node tools/genetic-ai-starter/scripts/new-gene.mjs --target . --type subsystem --domain app --subsystem billing
node tools/genetic-ai-starter/scripts/validate-genes.mjs
```

---

## Cross-links

- [`foundation.genetic_coding.gen1.md`](foundation.genetic_coding.gen1.md)
- [`foundation.ai_gene_interface.gen1.md`](foundation.ai_gene_interface.gen1.md)
- [`repo.evolution.compression.gen1.md`](repo.evolution.compression.gen1.md)
- [`repo.tooling.genetic_starter.gen1.md`](repo.tooling.genetic_starter.gen1.md)
