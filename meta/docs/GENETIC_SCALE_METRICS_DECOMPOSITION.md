# Genetic scale metrics — decomposition (M0–M8)

**Genetic tag:** `repo.tooling.genetic_starter.metrics_decomposition.gen1`  
**Status:** M0–M2 shipped in kit `0.4.18` · M3+ backlog  
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

## Wave M2 — Economics alignment (TODO partial)

| ID | Task | Status | Owner hint |
|----|------|--------|------------|
| M2-01 | Update `GENETIC_SYSTEM_ECONOMICS_ru.md` inventory table with MCP + clusters | 🔄 | Use snapshot field names |
| M2-02 | Update `METRICS_GLOSSARY_ru.md` § platform inventory | 🔄 | Link digest |
| M2-03 | `DOC_DATA_FLOW.md` — add `platform-stats-sources` node | ⏳ | Mermaid one box |
| M2-04 | `DOC_HUB.md` / `DOC_MAINTENANCE_TASKS.md` — link digest | ⏳ | Tier-2 meta doc |
| M2-05 | `check-site-inventory.mjs` — optional digest paths | ⏳ | If site lists meta docs |

---

## Wave M3 — Dev Test Atlas cross-stats (backlog)

| ID | Task | Detail | Code reuse |
|----|------|--------|------------|
| M3-01 | Read `docs/_generated/test-nav/dev_test_atlas_catalog.json` | Count catalog entries by `gene` tag | `readJsonIfExists` |
| M3-02 | Export `devTestAtlasRecipes` count | Scoped pytest recipes | Same lib |
| M3-03 | Export `auditScriptsInPackageJson` | Count `audit:*` in root `package.json` | One regex pass |
| M3-04 | Document in digest § CI observability | “N audits gate the genetic plane” | Docs only |

**Example export extension:**

```javascript
// platform-stats-sources.mjs
export function readDevTestAtlasStats(monorepoRoot) {
  const catalog = readJsonIfExists(
    path.join(monorepoRoot, 'docs/_generated/test-nav/dev_test_atlas_catalog.json'),
  );
  if (!catalog?.entries) return { available: false };
  return { available: true, recipeCount: catalog.entries.length };
}
```

---

## Wave M4 — OpenAPI / API plane (backlog)

| ID | Task | Detail |
|----|------|--------|
| M4-01 | Parse OpenAPI bundle path count from `docs/api/openapi.bundle.json` if present | REST surface scale |
| M4-02 | Link `docs.api.specs.gen1` in digest | ADR cross-link |
| M4-03 | Optional: MCP↔REST parity map entry count | From generated parity JSON |

**Philosophy:** One OpenAPI SoT — read generated artifact, never hand-count paths in README.

---

## Wave M5 — Plugin triangle stats (backlog)

| ID | Task | Detail | Reuse |
|----|------|--------|-------|
| M5-01 | Import skill counts from `plugin-skill-parity.mjs` helpers | Cursor 27 − backend − solana = 25 partner | `provided_plugins/scripts/lib/` |
| M5-02 | Snapshot `pluginSurfaces: { cursor, claude, vscode, gpt }` | 4 surfaces | Constants |
| M5-03 | Wire into kit export when `AGENTSTACK_ROOT` set | Optional block `pluginTriangle` | Feature-detect paths |
| M5-04 | Test: kit `plugin-skill-parity.test.mjs` asserts parity with export | No duplicate counting logic | DRY |

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
