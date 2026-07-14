# Doc claims audit — evidence vs limitations

**Genes:** `repo.tooling.genetic_starter.docs.gen1` · `repo.tooling.genetic_starter.benchmark.gen1`

**Philosophy:** PHILOSOPHY_INDEX → Observability first

---

## Claims table

| Claim (marketing-safe) | Evidence | Limitation |
|------------------------|----------|------------|
| weak arm median **2.5**, **0%** success | [metrics.snapshot.json](metrics.snapshot.json) `agents_md_weak` | Synthetic harness, not live Cursor |
| kit + indexes **100%** success, median **9** | metrics.snapshot `kit_standard_indexed` | Pre-filled indexes on shop-api fixture |
| agents_md median **8**, map-first genetic **7%** | metrics.snapshot `agents_md` | Optimistic arm — not production AGENTS alone |
| **~2.5–3×** fewer context tokens (discovery) | [TOKEN_REPORT.md](../../benchmarks/results/TOKEN_REPORT.md) step 1.2.1 | shop-api ~6 KB, not large monorepo |
| «Weak agent ≈ top model» on **process** KPIs | T04/T05/T13 task deltas in [AGENT_FLOOR_ru.md](AGENT_FLOOR_ru.md) | Not reasoning / product design parity |
| **406** philosophy genes (platform) | [platform-stats.snapshot.json](platform-stats.snapshot.json) `philosophyGenes` | Monorepo count; kit payload **27** genes |
| **186** / **162** `AI_INDEX.md` | same snapshot `aiIndexFilesRepoTotal` / `aiIndexFilesPlatform` | Repo-wide vs platform packages |
| **421** Tier-1 map tags | same `navigationMapTier1Tags` | Central map only |
| **~$1k–$4k/mo modeled savings** by team size | [roi-model.snapshot.json](roi-model.snapshot.json) via `calculate-roi.mjs` | **Not** payroll actuals; adjust `--rate` |
| Map-first reduces unscoped grep | ANALYSIS.md unscoped totals bare **18** vs indexed **0** | Policy transcripts model affordances |
| **12.36×** philosophy compression | AgentStack `bench_gene_access.json`; [GENETIC_SYSTEM_ECONOMICS.md](GENETIC_SYSTEM_ECONOMICS.md) | Philosophy access path only |
| Break-even ~**17** touches, P(save>0)=**1.0** | `monte_carlo_release_cost.json`; economics canvases | Simulation / EST — not prod A/B |
| SDK leverage **1–6 w** per module | `agentstack-platform-sdk-leverage` canvas | Order of magnitude; team-dependent |

## Do not claim

- Cursor or model vendor certification
- Guaranteed token billing savings on API invoices
- Zero human review on production deploys
- Guaranteed dollar payroll savings without adjusting rate/incidents
- «AGENTS.md only = kit» without arm footnote

## Reproduce

```bash
node benchmarks/scripts/run-matrix.mjs
node benchmarks/scripts/analyze-results.mjs
node scripts/export-metrics-snapshot.mjs
node scripts/export-platform-stats.mjs
node scripts/calculate-roi.mjs --export
node scripts/check-roi-model.mjs
```
