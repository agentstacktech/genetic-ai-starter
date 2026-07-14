# Genetic System — economics (canvas synthesis)

**Genetic tag:** `repo.tooling.genetic_starter.economics.gen1`

This document consolidates economics from internal AgentStack canvases and the public [genetic-system-site](https://github.com/agentstacktech/AgentStack/tree/master/docs/genetic-system-site) (RU / EN / PT, dark theme). It complements [VALUE_AND_ROI_BY_PROJECT_SIZE.md](VALUE_AND_ROI_BY_PROJECT_SIZE.md), [TOKEN_ECONOMICS.md](TOKEN_ECONOMICS.md), and [DOC_CLAIMS_AUDIT.md](DOC_CLAIMS_AUDIT.md).

**Primary ROI is labor calendar**, not token KPI alone. Token savings follow when map → index prefixes stabilize and prompt caching can hit.

---

## Two cost lines

| Line | What you pay | Navigation OS lever |
|------|--------------|---------------------|
| **Labor** | Engineer time, rework, onboarding | Fewer wrong-tree edits; shared genetic tags |
| **Tokens** | API spend per agent turn | Shorter stable context; less blind grep |

---

## Measured and modeled numbers

| Metric | Value | Source | Scope |
|--------|-------|--------|-------|
| Philosophy compression | **12.36×** (103222 → 8350 tok) | AgentStack `bench_gene_access.json` | Gene/philosophy access — not whole repo |
| Harness weak → kit+idx | **2.5 / 0%** → **9 / 100%** | [metrics.snapshot.json](metrics.snapshot.json) | shop-api synthetic transcripts |
| Break-even touches | ~**17** | Release economics canvas | Order of magnitude |
| FTE-week (model default) | ~**$3,500** | Release economics canvas | Planning input |
| Monte Carlo P(save>0) | **1.0** | `monte_carlo_release_cost.json` | Wide jitter simulation |
| EST nav failure | **22% → 5%** | Gene harness EST | Platform internal estimate |
| EST token factor | **0.62** | Gene harness EST | Discovery path |
| EST retry factor | **0.85** | Gene harness EST | After indexed nav |

Platform inventory (Jul 2026) — **SoT:** [platform-stats.snapshot.json](platform-stats.snapshot.json) after `node scripts/export-platform-stats.mjs`:

| Count | Field | Value |
|-------|-------|-------|
| Genes | `philosophyGenes` | **406** |
| Indexes (repo) | `aiIndexFilesRepoTotal` | **186** |
| Indexes (platform pkgs) | `aiIndexFilesPlatform` | **162** |
| Tier-1 tags | `navigationMapTier1Tags` | **421** |
| Kit payload genes | `kitPayloadGenes` | **27** |

Cross-cluster SYN **~16** and philosophy compression **12.36×** come from the genetic-system-site / `bench_gene_access.json` — not from this snapshot. Do not mix harness scores (`metrics.snapshot.json`) with inventory counts.

---

## Release archetypes (week savings — indicative)

From `agentstack-genes-release-economics` canvas. Exact weeks depend on team rate and scope — use [ROI_PLAYBOOK.md](ROI_PLAYBOOK.md) for your inputs.

| Archetype | Shape | Why navigation OS matters |
|-----------|-------|---------------------------|
| **A** | Greenfield on AgentStack + kit | Map + SDK compound; highest calendar leverage |
| **B** | Brownfield feature (500–2k files) | Cuts discovery tax on every task |
| **C** | Large monorepo (5k+ files) | Blind grep fails — see [KILLER_FEATURE_LARGE_PROJECTS.md](KILLER_FEATURE_LARGE_PROJECTS.md) |
| **D** | SDK-only consumer | SDK saves build weeks; map saves find-and-fix weeks |
| **E** | Docs / ops / KB | Same invariant on non-code artifacts |

---

## Platform SDK leverage (weeks not rebuilt)

From `agentstack-platform-sdk-leverage` canvas — typical calendar saved when hosting on AgentStack instead of DIY:

| Surface | Indicative save | Notes |
|---------|-----------------|-------|
| Auth + sessions | 2–4 w | Project scope, JWT, dashboard |
| Payments / wallet | 2–5 w | agUSD, MCP commerce |
| 8DNA project data | 1–3 w | Genetic records vs ad-hoc stores |
| MCP `agentstack.execute` | 1–2 w | Catalog vs bespoke tool wiring |
| Dual-shell SPA | 3–6 w | Audiences, nav, pages map |
| RAG / neural cache | 1–3 w | Platform substrate |

Navigation OS stacks on top: SDK removes **build** weeks; map removes **wrong-tree** weeks in code you still own.

---

## Agents in 2026 — why addresses beat stuffing context

| Signal | Takeaway for kit users |
|--------|------------------------|
| **Context rot** (Chroma 2026) | Accuracy drops as context grows — read 2 hot files via index |
| **Prompt caching** (major providers 2026) | Stable map→index prefix caches; grep roulette does not |
| **METR TH1.1** (Jul 2026) | Autonomous horizon doubling ~every 89 days — errors compound |
| **Multi-agent** | Shared genetic tags keep agents on one canonical tree |

Interactive charts: [genetic-system-site](https://github.com/agentstacktech/AgentStack/tree/master/docs/genetic-system-site).

---

## Gene navigation vs neural runtime

| Contour | Role |
|---------|------|
| **Gene navigation** | Map, tags, indexes — where to edit |
| **Neural runtime** | Live app latency, cache, managed organism |

Economics here are mostly **discovery tax and rework** — not “neural magic.”

---

## What we do not claim

- Tags do not replace tests, review, or security.
- **12.36×** is philosophy access compression, not “12× faster shipping.”
- Harness **100%** is a regression fixture — run `npm run harness` on your repo after init.
- Week savings are models — audit against [DOC_CLAIMS_AUDIT.md](DOC_CLAIMS_AUDIT.md).

---

## See also

| Doc | Topic |
|-----|-------|
| [NAVIGATION_OS.md](NAVIGATION_OS.md) | Workflow invariant |
| [VALUE_AND_ROI_BY_PROJECT_SIZE.md](VALUE_AND_ROI_BY_PROJECT_SIZE.md) | $ by team size |
| [TOKEN_ECONOMICS.md](TOKEN_ECONOMICS.md) | Token line detail |
| [METRICS_GLOSSARY.md](METRICS_GLOSSARY.md) | Term definitions |
| Public mirror | [agentstack_repo genetic-system](https://github.com/agentstacktech/agentstack_repo/tree/main/docs/genetic-system) |
