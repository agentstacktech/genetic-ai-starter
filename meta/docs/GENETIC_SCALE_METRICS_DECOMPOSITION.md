# Genetic scale metrics — decomposition (M0–M8)

**Genetic tag:** `repo.tooling.genetic_starter.metrics_decomposition.gen1`  
**Status:** M0–M5 shipped in kit `0.4.18` · M6+ backlog  
**Philosophy:** Creation over Conflict · Elegant Minimalism · Observability first · DRY/KISS

Цель: **больше фактов о масштабе AgentStack** и **измеримых выигрышах Navigation OS**, без дублирования SoT и без раздувания кода.

---

## Wave M0 — Unified snapshot (DONE)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| M0-01 | `platform-stats-sources.mjs` — read MCP publication JSON | ✅ | Reuses `docs/publication/platform-stats.snapshot.json` |
| M0-02 | Merge `bench_gene_access.json` compression ratio | ✅ | `pillar_resolved` / `naive_all` → `geneAccess` block |
| M0-03 | Embed harness headline KPIs from `metrics.snapshot.json` | ✅ | weak/kit indexed, token delta, unscoped grep |
| M0-04 | Count `geneCompressionClusters` from `GENE_COMPRESSION_MAP.md` | ✅ | `^## Cluster ` regex |
| M0-05 | Export `navigationMapScanRoots` from `resolveIndexScanRoots` | ✅ | Reuses `navigation-map-roots.mjs` |
| M0-06 | `tests/platform-stats-sources.test.mjs` + sync-smoke wire | ✅ | Regression on ratio math |

**Example snapshot shape:**

```json
{
  "counts": {
    "mcpCatalogActionsPublic": 568,
    "geneCompressionClusters": 38,
    "navigationMapScanRoots": 21
  },
  "geneAccess": { "compressionRatio": 12.36, "compressionLabel": "12.36×" },
  "harness": { "weakMedian": 2.5, "kitIndexedSuccessRate": 1 }
}
```

---

## Wave M1 — Public docs (DONE)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| M1-01 | `PLATFORM_SCALE_DIGEST_ru.md` — три плоскости метрик | ✅ | Navigation / MCP / harness |
| M1-02 | `PLATFORM_SCALE_DIGEST.md` EN parity | ✅ | i18n pair |
| M1-03 | README RU/EN — таблицы Navigation + MCP | ✅ | Linked from ecosystem section |
| M1-04 | `check-readme-inventory` — MCP + clusters fields | ✅ | Fails on drift |
| M1-05 | Fix kit rules count **6** (was cited as 5) | ✅ | `kitCursorRulesStandard` |

---

## Wave M2 — Economics alignment (DONE)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| M2-01 | `GENETIC_SYSTEM_ECONOMICS*.md` inventory + MCP + clusters | ✅ | Snapshot field names |
| M2-02 | `METRICS_GLOSSARY*.md` § platform inventory | ✅ | Links digest |
| M2-03 | `DOC_DATA_FLOW.md` — `platform-stats-sources` + observability | ✅ | Mermaid updated |
| M2-04 | `DOC_HUB.md` / `DOC_MAINTENANCE_TASKS.md` — digest links | ✅ | Tier-2 meta |
| M2-05 | `check-site-inventory.mjs` — digest optional | ⏳ | Site HTML only genes/indexes today |

---

## Wave M3 — Dev Test Atlas cross-stats (DONE)

| ID | Task | Status | Code reuse |
|----|------|--------|------------|
| M3-01 | `readDevTestAtlasStats` — `docs/testing/catalog/dev_test_atlas_catalog.json` | ✅ | `slices` count + active + planes |
| M3-02 | Export `devTestAtlasSlices*` in `counts` | ✅ | `collectObservabilityInventory` |
| M3-03 | `countMonorepoAuditScripts` — `audit:*` in root `package.json` | ✅ | **119** scripts |
| M3-04 | Digest § CI observability + README tables | ✅ | `check-readme-inventory` gates |

**SoT path correction:** catalog lives at `docs/testing/catalog/` (not `_generated/test-nav/`).

---

## Wave M4 — OpenAPI / API plane (DONE partial)

| ID | Task | Status | Notes |
|----|------|--------|-------|
| M4-01 | `readOpenApiSummaryStats` — `openapi-catalog.summary.json` | ✅ | **834** ops · **50** tags |
| M4-02 | Digest + README cite `docs.api.specs.gen1` | ✅ | |
| M4-03 | MCP↔REST parity map entry count | ⏳ | `export_mcp_rest_parity.py` output — M6 wave |

---

## Wave M5 — Plugin triangle stats (DONE)

| ID | Task | Status | Reuse |
|----|------|--------|-------|
| M5-01 | `readPluginTriangleStats` dynamic import | ✅ | `plugin-skill-parity.mjs` |
| M5-02 | Snapshot `pluginTriangle` block + `mirroredPluginSkills` | ✅ | **25** mirrored |
| M5-03 | Feature-detect when monorepo absent | ✅ | `available: false` standalone |
| M5-04 | `platform-stats-sources.test.mjs` parity assert | ✅ | `parityOk === true` |

---

## Wave M6 — Gene heat / GTPI (backlog)

| ID | Task | Detail |
|----|------|--------|
| M6-01 | Read `platform_tooling.py gene-heat doctor --json` output if cached | Hot region count |
| M6-02 | GTPI catalog token count from `docs/_generated/` if stable | Neural lexicon scale |
| M6-03 | Digest § “Neural ops vs gene navigation” | Reinforce economics split |

**Gene:** `shared.diagnostics.gene_heat.gen1` · `shared.neural.gene_token_index.gen1`

---

## Wave M7 — Live verification hooks (backlog)

| ID | Task | Detail |
|----|------|--------|
| M7-01 | Optional `--live-mcp` flag on export | `GET /mcp/health` tools_count vs snapshot |
| M7-02 | Never write live count into committed snapshot | Observability-only stderr WARN |
| M7-03 | Document in MAINTAINERS.md | Prod verify checklist |

**Pattern:** Committed snapshot = codegen; live = human/ops verify (PLATFORM_SCALE.md).

---

## Wave M8 — Public mirror sync (backlog)

| ID | Task | Detail |
|----|------|--------|
| M8-01 | Copy kit snapshot subset to `docs/genetic-system-site/data/` | genetic-system-site canvases |
| M8-02 | `patch-public-doc-stats.mjs` — optional kit fields | `<!-- stats:gene_compression -->` |
| M8-03 | `audit-stats-plane-parity` — kit vs monorepo publication | Single chain in dx-plane |

---

## Anti-patterns (genes)

| Wrong | Right |
|-------|-------|
| Hand-edit **568** in README | `export-platform-stats` → `check-readme-inventory` |
| Mix harness median with gene count in one KPI | Three planes (digest §1) |
| Full-repo walk every audit | Scoped roots from map (`navigation-map-roots.mjs`) |
| Duplicate `countTier1Tags` in 3 scripts | `platform-stats-sources.mjs` |
| New version bump for metrics-only | Record under existing CHANGELOG `0.4.18` |

---

## Verification checklist (after each wave)

```bash
cd genetic-ai-starter
node scripts/export-platform-stats.mjs
npm run audit:docs
node scripts/sync-smoke.mjs
```

Monorepo (when touching MCP):

```bash
node scripts/codegen-platform-stats.mjs
npm run audit:stats-plane-parity
```

---

## Priority order

1. **M2** — economics/glossary alignment (low risk, high doc value)  
2. **M3** — Dev Test Atlas counts (proves CI scale)  
3. **M5** — plugin triangle (closes DX plane narrative)  
4. **M4/M6/M7/M8** — as platform stats chain matures

**Maintainer:** update this file when closing tasks — checkbox + date in commit message.
