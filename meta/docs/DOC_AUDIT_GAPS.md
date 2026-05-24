# Doc audit gaps — Genetic AI Starter Kit

Living register of documentation and metrics inconsistencies. **Status:** `open` | `fixed` | `accepted`.

**Genetic tag:** `repo.tooling.genetic_starter.docs.gen1`  
**Philosophy:** PHILOSOPHY_INDEX → Observability first · Controlled change

| ID | Problem | Where | Status | Fix |
|----|---------|-------|--------|-----|
| G1 | Column «AGENTS.md only» median 8 = kit | README, FAQ, COMMS | fixed | Task deltas + arm footnotes; [METRICS_GLOSSARY.md](METRICS_GLOSSARY.md) |
| G2 | Scorer T05: `no AI_INDEX` matches keyword | score-transcript.mjs | fixed | `matchesPositive()` + ≥2 maintenance anchors |
| G3 | `map-first` counts AGENTS.md as map | scorer, README | fixed | `mapFirstGenetic` vs `entryDocFirst` |
| G4 | METHODOLOGY says manual; run-matrix is synthetic | METHODOLOGY.md | fixed | Harness v1 synthetic vs Manual v2 |
| G5 | `kit_standard_indexed` median 7 < standard 8 | ANALYSIS, README | fixed | Paradox section in METRICS_GLOSSARY |
| G6 | Install `minimal` ≠ benchmark arm `agents_md` | PROFILE, README | fixed | Disambiguation table in PROFILE_COMPARISON |
| G7 | `maxGeneFilesBeforeMap` not scored | tasks.json T06 | fixed | Scorer 1.1.1 gene-cap penalty |
| G8 | Median 8 but success 64% for generic_cursorrules | ANALYSIS | fixed | Glossary: median ≠ success rate |
| G9 | Metrics drift across 12+ surfaces | FAQ, npm, ROI | fixed | `metrics.snapshot.json` + check-docs-metrics |
| G10 | Killer feature not in README hero | README | fixed | Hero sections v2 |
| G11 | No token economics doc | meta/docs | fixed | TOKEN_ECONOMICS.md |
| G12 | RAG/hybrid not described | — | fixed | COMPARISON_METHODS § Hybrid |
| G13 | Payload PHILOSOPHY_INDEX missing large-repo | payload | fixed | § Large-scale navigation |
| G14 | Monorepo gene too short | philosophy/genes | fixed | Expanded + docs.gen1 |
| G15 | SHOWCASE KPI empty | SHOWCASE.md | fixed | KPI template rows |

**Maintainers:** close rows in same PR as fix; run `node scripts/check-docs-metrics.mjs` before release.
