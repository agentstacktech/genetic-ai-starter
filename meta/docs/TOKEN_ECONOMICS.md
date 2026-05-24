# Token economics — map-first navigation

**RU:** [TOKEN_ECONOMICS_ru.md](TOKEN_ECONOMICS_ru.md) · **Report:** [benchmarks/results/TOKEN_REPORT.md](../../benchmarks/results/TOKEN_REPORT.md)

**Genes:** `foundation.ai_gene_interface.gen1` · `repo.navigation.map.gen1` · `repo.navigation.index.gen1`

---

## Context token model (step 1.2.1)

Estimates **one agent session’s context load** from benchmark transcripts. Not Cursor API billing.

**Code:** `benchmarks/scripts/lib/token-model.mjs`

| Component | Rule |
|-----------|------|
| File read | `ceil(bytes/4) + 280` (fixture file size when present) |
| Repo-wide `rg` | share of fixture text (55% if ≤40 files), cap 2,500 on small repos |
| Scoped `rg` | 15% share, cap 1,200 |
| Task prompt | 420 base |
| Assistant line | 180 per transcript line |

**shop-api fixture:** ~20 files, ~6.3 KB source (~1,577 tokens if the whole repo were read). One unscoped `rg` line ≈ **1,148** model tokens.

**Large monorepo** (model caps, outside shop-api): up to **14,000** per bad repo-wide `rg`.

### Harness medians (14 tasks, synthetic)

| Arm | All tasks | Discovery only* |
|-----|-----------|-----------------|
| bare | **~2,265** | **~2,985** |
| kit + indexes | **~1,125** | **~1,125** |

\*T01–T03, T06–T08, T12, T14.

Compare **kit vs bare** on discovery; map-only and indexed medians are similar (~1.05k vs ~1.13k).

## Kit path

```
prompt → AI_NAVIGATION_MAP → AI_INDEX (optional) → 1–2 hot files → patch
```

vs bare discovery: `prompt → rg src (~1.1k per line on shop-api) → extra reads`.

## When kit saves less

Single-file tools, rare edits, &lt;5 modules — **minimal** profile. See [ROI_PLAYBOOK.md](ROI_PLAYBOOK.md).

## Tools

```bash
node genetic-ai-starter/benchmarks/scripts/run-matrix.mjs
node genetic-ai-starter/benchmarks/scripts/estimate-tokens.mjs --transcript path.txt
```

## Limits

Synthetic harness policy — not production Cursor averages. Validate on your repo via [benchmarks/METHODOLOGY.md](../../benchmarks/METHODOLOGY.md) § Manual validation.
