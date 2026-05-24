# Token economics — map-first navigation

**RU:** [TOKEN_ECONOMICS_ru.md](TOKEN_ECONOMICS_ru.md) · **Metrics:** [metrics.snapshot.json](metrics.snapshot.json)

## Genes

- `foundation.ai_gene_interface.gen1` — compression before opening many genes
- `repo.navigation.map.gen1` · `repo.navigation.index.gen1`

## Philosophy

PHILOSOPHY_INDEX → AI Builder «Fewer steps, lower token use» (navigation layer parallel)

---

## Problem: exploration loops

```
tokens_exploration ≈ N_grep × (context_window + hit_snippets)
```

Repo-wide grep in large trees repeatedly loads overlapping chunks — high variance, wrong-file risk.

## Kit path cost model

```
tokens_kit ≈ tokens(AGENTS) + tokens(map_row) + tokens(AI_INDEX) + tokens(1–2 hot files)
```

Stable path: **one screen map** + **one index** + **target sources** — then optional scoped grep.

## Worked example T02 (JWT)

| Path | Steps | Order-of-magnitude tokens (est.) |
|------|-------|----------------------------------|
| bare | 4× unscoped `rg jwt` | 4 × ~8k = **32k** |
| kit_standard | map row → `sessionMiddleware.ts` | ~2k + ~4k = **6k** |

Harness: [BENEFITS_AND_METRICS.md](BENEFITS_AND_METRICS.md) T02.

## Worked example T06 (multi-area)

| Path | Gene files read | Tokens |
|------|-----------------|--------|
| Open all philosophy | ~17 files | High |
| **Compression map** → 3 cluster genes → map | 3 + map | **~70% less gene prose** |

## Comparison by method

| Method | Typical path | Tokens | Structure |
|--------|--------------|--------|-----------|
| Repo-wide grep | N tool rounds | High | None |
| Embedding RAG only | top-k chunks | Medium | Implicit, drifts |
| README tree | README + guess | Medium | Flat |
| Community AGENTS | AGENTS layout | Medium | No Tier 1 |
| **Genetic kit** | map → index → 2 files | **Low stable** | Explicit lattice |
| **Hybrid (recommended)** | kit + RAG on docs | Medium-low | Map for code, RAG for prose |

## Hybrid stack (kit + RAG)

- **Map/index** = *where* code lives (boundaries, hot files, legacy warnings).
- **RAG** = *what text* matches a fuzzy question in docs/logs.
- Do not replace Tier 1 rows with embeddings alone — indexes stay git-reviewable.

## Gene compression

Before opening parallel genes, use [GENE_COMPRESSION_MAP](../../payload/philosophy/genes/GENE_COMPRESSION_MAP.md) clusters (Nav, Engineering, Product).

## Leading metrics

Track weekly ([ROI_PLAYBOOK.md](ROI_PLAYBOOK.md)):

- `estimatedContextTokens` from scorer (per task)
- TTFHF tool-call proxy
- Map-first **(genetic)** rate in PR summaries

CLI: `node benchmarks/scripts/estimate-tokens.mjs --transcript path.txt`

## When kit saves less

Single-file CLI, throwaway spike, &lt;5 obvious modules — use **minimal** profile only ([ROI_PLAYBOOK.md](ROI_PLAYBOOK.md)).

## Patterns (roadmap)

| Pattern | Kit application |
|---------|-----------------|
| RAPTOR-style summaries | `AI_INDEX.md` as subtree summary node |
| Repo map / compass | hot files ≈ ranked entry points |
| Lost-in-middle | short map/index at start of agent context |
