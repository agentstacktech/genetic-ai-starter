# Killer feature — large complex codebases

**EN:** this file (summary) · **RU:** [KILLER_FEATURE_LARGE_PROJECTS_ru.md](KILLER_FEATURE_LARGE_PROJECTS_ru.md) — full narrative: problem anatomy, avalanche model, harness evidence.

**Rollout:** [LARGE_PROJECT_PLAYBOOK.md](LARGE_PROJECT_PLAYBOOK.md) · **Architecture:** [NAVIGATION_OS.md](NAVIGATION_OS.md) · **Claims:** [DOC_CLAIMS_AUDIT.md](DOC_CLAIMS_AUDIT.md)

**Genes:** `foundation.genetic_coding.gen1` · `repo.navigation.map.gen1` · `repo.navigation.index.gen1` · `repo.engineering.controlled_changes.gen1`

---

## Thesis

On large repos the failure mode is not weak codegen — it is **lost addressability**: each agent session reinvents subsystems, duplicates contours (auth, HTTP, billing), reinforces legacy decoys, and compounds unmaintainable parallel paths.

**Navigation OS** (Tier 0 → Tier 1 → `AI_INDEX.md` → 1–2 hot files), versioned in git with genes and `doctor`, is the portable fix — the same lattice AgentStack uses at scale.

## Problem (summary)

| Failure | Without map/index |
|---------|-------------------|
| Too many files | Repo-wide grep, context blow-up |
| Cross-package deps | Wrong package edited |
| Build from scratch | Second HTTP client, second auth path |
| Duplicate contours | Parallel “systems” for one meaning |
| Legacy avalanche | Decoy files get patched and entrenched |

See RU doc §1–2 for mermaid vicious-cycle vs kit loop and order-of-magnitude duplication model.

## Solution (summary)

| Layer | Artifact |
|-------|----------|
| L0 | Genetic tags in PRs |
| L1 | `AI_NAVIGATION_MAP.md` |
| L2 | `AI_INDEX.md` hot files |
| L3 | Genes + `GENE_COMPRESSION_MAP` |
| L4 | Rules (map-first, controlled changes) |
| L5 | `doctor`, `validate-kit` |

## Platform scale (reference)

Monorepo lattice size: [platform-stats.snapshot.json](platform-stats.snapshot.json) (~222 genes, ~98 platform `AI_INDEX`, ~267 Tier-1 tags). Separate from shop-api harness below.

## Harness evidence (scorer 1.2.1, synthetic — not a production SLA)

14 tasks on `shop-api`, `executionMode: synthetic_policy`. See [metrics.snapshot.json](metrics.snapshot.json).

| Metric | bare | kit + indexes |
|--------|------|---------------|
| Median score | 5.5 | **9** |
| Success rate | 50% | **100%** |
| Map-first (genetic) | 0% | **86%** |
| Unscoped grep (14 tasks) | 18 | **0** |
| Median context tokens (step 1.2.1, all tasks) | ~2,265 | ~1,125 |
| Median discovery-only | ~2,985 | ~1,125 |

**Large-repo task highlights vs bare:**

| Task | Scenario | bare | kit + idx |
|------|----------|------|-----------|
| T05 | New module → navigation | 4 | **10** |
| T07 | Legacy checkout decoy | 1 | **7** |
| T08 | Catalog bug | 7 | **10** |
| T12 | Webhook + signing | 4 | **10** |
| T13 | Release gate (map/index/doctor) | low | **10** |
| T14 | Prod vs dev entry | low | **10** |

Tokens: [TOKEN_REPORT.md](../../benchmarks/results/TOKEN_REPORT.md). Compare kit vs **bare**, not as a horse race between map-only and indexes.

## Install

```bash
node genetic-ai-starter/scripts/install.mjs --target . --profile standard --project-name "My App" --domain app --strict
```

Then [LARGE_PROJECT_PLAYBOOK.md](LARGE_PROJECT_PLAYBOOK.md).
