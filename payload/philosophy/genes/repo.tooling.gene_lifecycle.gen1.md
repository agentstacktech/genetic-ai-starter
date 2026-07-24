# Gene — `repo.tooling.gene_lifecycle.gen1`

**Genetic tag:** `repo.tooling.gene_lifecycle.gen1`  
**Category:** repo / tooling  
**Status:** ACTIVE

---

## Intent

Lifecycle policy for **philosophy genes** in the Genetic AI Starter Kit and {{PROJECT_NAME}}: when to create `gen1`, when to bump to `gen2`, how **DEPRECATED / redirect** stubs work, and how **`validate-genes.mjs`** enforces minimum structure on kit-shipped payload genes.

---

## Generation policy (gen1 → gen2)

| Rule | Detail |
|------|--------|
| **Default** | New work uses **`gen1`** stable contract tags ([foundation.genetic_coding.gen1.md](foundation.genetic_coding.gen1.md)). |
| **Bump trigger** | Create **`gen2`** only when the **contract** changes (new integration boundary, renamed genetic tag semantics, superseded narrative that must stay addressable). |
| **ADR + map** | Every generation bump requires Tier 0/1 row update in `docs/ai/AI_NAVIGATION_MAP.md` and note in [GENE_COMPRESSION_MAP.md](GENE_COMPRESSION_MAP.md). |
| **Founder ship** | Prefer **one canonical file** + redirect stub — no long-lived dual bodies (`repo.engineering.founder_direct_ship.gen1`). |
| **Filename = tag** | `domain.subsystem.role.gen1.md` must match `**Genetic tag:**` metadata; `validate-genes.mjs` warns on mismatch. |

**Examples:** `frontend.agents.constructor.gen2` replaces gen1 + constructor_v2 stubs; `core.hosting.nginx_direct.gen2` supersedes gen1 for new URLs.

---

## Redirect and DEPRECATED stubs

Physical files stay in git for stable links. Tooling resolves bodies via [gene_document_resolver.py](https://github.com/agentstacktech/AgentStack/tree/main/philosophy/gene_document_resolver.py).

| Stub style | Header pattern | Loader behavior |
|------------|----------------|-----------------|
| **Short redirect** | `# Gene: \`tag\` — **redirect**` + `**Canonical:** [tag.gen2.md](...)` | Human follows link; resolver may load umbrella |
| **Compression redirect** | `# Gene (semantic compression redirect)` + `**Umbrella:** [foo.gen1.md](...)` | `read_effective_gene_markdown` loads umbrella body |
| **DEPRECATED** | `**Status:** DEPRECATED` + canonical tag link | Treat as path anchor only; edit canonical gene |

**Do not** delete heritage `GENE_*` files for tag preservation — fold intent into umbrella `.gen1` per [repo.evolution.compression.gen1.md](repo.evolution.compression.gen1.md).

---

## validate-genes enforcement (kit payload)

Script: [genetic-ai-starter/scripts/validate-genes.mjs](../../../scripts/validate-genes.mjs)  
Invoked by: `validate-kit.mjs`, CI sample `payload/.github/workflows/genetic-ai-validate.yml.sample`

**Required sections** (every `*.gen1.md` / `*.gen2.md` under `payload/philosophy/genes/`):

| Section | Pattern |
|---------|---------|
| Gene header | `# Gene —` |
| Genetic tag | `**Genetic tag:** \`...\`` |
| Intent | `## Intent` |
| Cross-links | `## Cross-links` |

**Tag grammar:** 3–5 dot segments; last segment `gen` + digits (`gen1`, `gen2`, …).  
**Skipped:** `GENE_*` heritage files, `templates/*`.

---

## Scaffolding new genes

```bash
node tools/genetic-ai-starter/scripts/new-gene.mjs \
  --target . --type subsystem --domain app --subsystem billing
```

Writes under `philosophy/genes/`, prints Tier 1 map row. Then:

1. Add row to `docs/ai/AI_NAVIGATION_MAP.md`
2. Add entry to `philosophy/genes/GENE_INDEX.md` (monorepo) or payload `GENE_INDEX.md` (kit)
3. Run `node tools/genetic-ai-starter/scripts/validate-genes.mjs` from kit root after payload edits
4. If kit-shipped, mirror gene under `genetic-ai-starter/payload/philosophy/genes/` and list in `KIT_MANIFEST.json` when part of default payload

---

## AI instructions

1. **Edit canonical `.gen1`** (or explicit `.gen2` when marked ACTIVE canonical) — not redirect stubs.
2. **Bump generation** only with ADR + map + compression map cluster update — never silent renames.
3. After adding payload genes, run **`validate-genes`** before merge.
4. Summaries name **genetic tag**, not legacy `GENE_PHILOSOPHY__*` filenames ([foundation.ai_gene_interface.gen1.md](foundation.ai_gene_interface.gen1.md)).

---

## Cross-links

- [foundation.genetic_coding.gen1.md](foundation.genetic_coding.gen1.md) — tag shape and reading order
- [foundation.ai_gene_interface.gen1.md](foundation.ai_gene_interface.gen1.md) — agent read flow
- [repo.evolution.compression.gen1.md](repo.evolution.compression.gen1.md) — compression procedure
- [repo.tooling.genetic_starter.gen1.md](repo.tooling.genetic_starter.gen1.md) — kit Navigation OS
- [repo.tooling.genetic_starter.agentstack_dx.gen1.md](repo.tooling.genetic_starter.agentstack_dx.gen1.md) — DX scaffolder + evals context
- [genetic-ai-starter/scripts/new-gene.mjs](../../../scripts/new-gene.mjs) — gene scaffolder
- [philosophy/gene_document_resolver.py](https://github.com/agentstacktech/AgentStack/tree/main/philosophy/gene_document_resolver.py) — redirect resolution
