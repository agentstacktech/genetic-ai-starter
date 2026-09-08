import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { resolveIndexScanRoots } from './navigation-map-roots.mjs';

/**
 * Read optional JSON; return null if missing.
 * @param {string} filePath
 */
export function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * @param {string} mapPath
 * @returns {number|null}
 */
export function countTier1Tags(mapPath) {
  if (!fs.existsSync(mapPath)) return null;
  const text = fs.readFileSync(mapPath, 'utf8');
  const matches = text.match(/`[a-z][a-z0-9_.]+\.gen1`/g);
  return matches ? new Set(matches).size : 0;
}

/**
 * @param {string} compressionMapPath
 * @returns {number|null}
 */
export function countGeneCompressionClusters(compressionMapPath) {
  if (!fs.existsSync(compressionMapPath)) return null;
  const text = fs.readFileSync(compressionMapPath, 'utf8');
  return (text.match(/^## Cluster /gm) || []).length;
}

/**
 * Monorepo MCP publication snapshot (`codegen-platform-stats.mjs` output).
 * @param {string} monorepoRoot
 */
export function readMcpPublicationStats(monorepoRoot) {
  const rel = 'docs/publication/platform-stats.snapshot.json';
  const data = readJsonIfExists(path.join(monorepoRoot, rel));
  if (!data) return { source: rel, available: false };
  return {
    source: rel,
    available: true,
    mcpCatalogActionsPublic: data.mcp_catalog_actions_public ?? data.mcp_catalog_actions ?? null,
    mcpCatalogActionsTotal: data.mcp_catalog_actions_total ?? null,
    mcpDomainsPublic: data.mcp_domains_public ?? data.mcp_domains ?? null,
    mcpDomainsTotal: data.mcp_domains_total ?? null,
    mcpRegistryTools: data.mcp_registry_tools ?? null,
    platformVersion: data.platform_version ?? null,
  };
}

/**
 * Philosophy gene access bench (`pillar_resolved` vs `naive_all`).
 * @param {string} monorepoRoot
 */
export function readGeneAccessBench(monorepoRoot) {
  const rel = 'philosophy/bench_gene_access.json';
  const data = readJsonIfExists(path.join(monorepoRoot, rel));
  if (!data?.scenarios?.length) return { source: rel, available: false };

  const naive = data.scenarios.find((s) => s.name === 'naive_all');
  const resolved = data.scenarios.find((s) => s.name === 'pillar_resolved');
  if (!naive?.tokens || !resolved?.tokens) return { source: rel, available: false };

  const ratio = Math.round((naive.tokens / resolved.tokens) * 100) / 100;
  return {
    source: rel,
    available: true,
    philosophyTokensNaive: naive.tokens,
    philosophyTokensResolved: resolved.tokens,
    philosophyFilesNaive: naive.files ?? null,
    philosophyFilesResolved: resolved.files ?? null,
    compressionRatio: ratio,
    compressionLabel: `${ratio}×`,
    aiGeneInterfaceBootMsMedian: data.ai_gene_interface_boot_ms_median ?? null,
    aiGeneInterfaceLoadedPillars: data.ai_gene_interface_loaded_pillars ?? null,
  };
}

/**
 * Harness headline KPIs from kit metrics snapshot.
 * @param {string} kitRoot
 */
export function readHarnessHighlights(kitRoot) {
  const rel = 'meta/docs/metrics.snapshot.json';
  const data = readJsonIfExists(path.join(kitRoot, rel));
  if (!data?.arms) return { ref: rel, available: false };

  const weak = data.arms.agents_md_weak ?? {};
  const kitIdx = data.arms.kit_standard_indexed ?? {};
  const bare = data.arms.bare ?? {};
  const kpi = data.primaryKpi ?? {};

  return {
    ref: rel,
    available: true,
    scorerVersion: data.scorerVersion ?? null,
    weakMedian: weak.medianScore ?? null,
    weakSuccessRate: weak.successRate ?? null,
    bareMedian: bare.medianScore ?? null,
    bareSuccessRate: bare.successRate ?? null,
    kitIndexedMedian: kitIdx.medianScore ?? null,
    kitIndexedSuccessRate: kitIdx.successRate ?? null,
    kitIndexedMedianContextTokens: kitIdx.medianContextTokens ?? null,
    bareMedianContextTokens: bare.medianContextTokens ?? null,
    medianTokenDeltaKitVsBare: kpi.kit_standard_indexed_vs_bare_tokenMedianDelta ?? null,
    unscopedGrepBare: kpi.unscopedGrep_bare ?? null,
    unscopedGrepKitIndexed: kpi.unscopedGrep_kit_standard_indexed ?? null,
    kitStandardVsBareMedianDelta: kpi.kit_standard_vs_bare_medianDelta ?? null,
  };
}

/**
 * @param {string} monorepoRoot
 * @param {string} kitRoot
 */
export function collectNavigationInventory(monorepoRoot, kitRoot) {
  const mapPath = path.join(monorepoRoot, 'docs', 'AI_NAVIGATION_MAP.md');
  const compressionPath = path.join(
    monorepoRoot,
    'philosophy',
    'genes',
    'GENE_COMPRESSION_MAP.md',
  );
  const kitCompressionPath = path.join(
    kitRoot,
    'payload',
    'philosophy',
    'genes',
    'GENE_COMPRESSION_MAP.md',
  );

  const scanRoots = fs.existsSync(mapPath) ? resolveIndexScanRoots(monorepoRoot).length : null;
  const clusters =
    countGeneCompressionClusters(compressionPath) ??
    countGeneCompressionClusters(kitCompressionPath);

  return {
    navigationMapTier1Tags: countTier1Tags(mapPath),
    navigationMapScanRoots: scanRoots,
    geneCompressionClusters: clusters,
  };
}

/**
 * Dev Test Atlas catalog (`repo.engineering.dev_test_atlas.gen1`).
 * @param {string} monorepoRoot
 */
export function readDevTestAtlasStats(monorepoRoot) {
  const rel = 'docs/testing/catalog/dev_test_atlas_catalog.json';
  const data = readJsonIfExists(path.join(monorepoRoot, rel));
  if (!data?.slices?.length) return { source: rel, available: false };

  const slices = data.slices;
  const active = slices.filter((s) => s.status === 'active');
  return {
    source: rel,
    available: true,
    devTestAtlasSlices: slices.length,
    devTestAtlasSlicesActive: active.length,
    devTestAtlasPlanes: new Set(slices.map((s) => s.plane).filter(Boolean)).size,
    geneticTag: data.genetic_tag ?? null,
  };
}

/**
 * Root `package.json` `audit:*` npm scripts (CI observability scale).
 * @param {string} monorepoRoot
 */
export function countMonorepoAuditScripts(monorepoRoot) {
  const rel = 'package.json';
  const data = readJsonIfExists(path.join(monorepoRoot, rel));
  if (!data?.scripts) return { source: rel, available: false };
  const audits = Object.keys(data.scripts).filter((k) => k.startsWith('audit:'));
  return {
    source: rel,
    available: true,
    monorepoAuditScripts: audits.length,
  };
}

/**
 * Committed OpenAPI catalog summary (`docs.api.specs.gen1`).
 * @param {string} monorepoRoot
 */
export function readOpenApiSummaryStats(monorepoRoot) {
  const rel = 'docs/api/openapi-catalog.summary.json';
  const data = readJsonIfExists(path.join(monorepoRoot, rel));
  if (!data?.ops?.length) return { source: rel, available: false };
  const tags = new Set(data.ops.map((o) => o.tag).filter(Boolean));
  return {
    source: rel,
    available: true,
    openApiOperations: data.ops.length,
    openApiTags: tags.size,
    openApiBundleVersion: data.openapi_version ?? null,
  };
}

/**
 * Plugin skill triangle via shared parity lib (Cursor gen3 SoT).
 * @param {string} monorepoRoot
 */
export async function readPluginTriangleStats(monorepoRoot) {
  const rel = 'provided_plugins/scripts/lib/plugin-skill-parity.mjs';
  const abs = path.join(monorepoRoot, rel);
  if (!fs.existsSync(abs)) return { source: rel, available: false };

  try {
    const mod = await import(pathToFileURL(abs).href);
    const mirrored = mod.expectedMirroredSkillCount();
    const cursorTotal = mod.listSkillDirs(mod.CURSOR_SKILLS_ROOT).length;
    const claude = mod.listSkillDirs(mod.CLAUDE_SKILLS_ROOT).length;
    const vscode = mod.listSkillDirs(mod.VSCODE_SKILLS_ROOT).length;
    const claudeMissing = mod.listMissingMirroredSkills(mod.CLAUDE_SKILLS_ROOT).length;
    const vscodeMissing = mod.listMissingMirroredSkills(mod.VSCODE_SKILLS_ROOT).length;

    return {
      source: rel,
      available: true,
      mirroredPluginSkills: mirrored,
      cursorSkillsTotal: cursorTotal,
      claudePluginSkills: claude,
      vscodePluginSkills: vscode,
      pluginSurfaces: 4,
      claudeSkillsMissing: claudeMissing,
      vscodeSkillsMissing: vscodeMissing,
      parityOk: claudeMissing === 0 && vscodeMissing === 0,
    };
  } catch {
    return { source: rel, available: false };
  }
}

/**
 * Bundle CI / API observability counters for export.
 * @param {string} monorepoRoot
 */
export function collectObservabilityInventory(monorepoRoot) {
  const atlas = readDevTestAtlasStats(monorepoRoot);
  const audits = countMonorepoAuditScripts(monorepoRoot);
  const openApi = readOpenApiSummaryStats(monorepoRoot);
  const neural = collectNeuralPlaneInventory(monorepoRoot);

  return {
    atlas,
    audits,
    openApi,
    neural,
    counts: {
      devTestAtlasSlices: atlas.devTestAtlasSlices ?? null,
      devTestAtlasSlicesActive: atlas.devTestAtlasSlicesActive ?? null,
      devTestAtlasPlanes: atlas.devTestAtlasPlanes ?? null,
      monorepoAuditScripts: audits.monorepoAuditScripts ?? null,
      openApiOperations: openApi.openApiOperations ?? null,
      openApiTags: openApi.openApiTags ?? null,
      aiNavCatalogEntries: neural.aiNavCatalogEntries ?? null,
      gtpiPostingEdges: neural.gtpiPostingEdges ?? null,
      geneHeatOverrides: neural.geneHeatOverrides ?? null,
      mcpRestParityActions: neural.mcpRestParityActions ?? null,
    },
  };
}

/**
 * AI nav catalog + GTPI + GHTP overrides + MCP↔REST parity (read generated artifacts only).
 * @param {string} monorepoRoot
 */
export function collectNeuralPlaneInventory(monorepoRoot) {
  const aiNav = readAiNavCatalogStats(monorepoRoot);
  const gtpi = readGtpiStats(monorepoRoot);
  const heat = readGeneHeatOverrideStats(monorepoRoot);
  const parity = readMcpRestParityStats(monorepoRoot);

  return {
    aiNavCatalogEntries: aiNav.aiNavCatalogEntries ?? null,
    gtpiPostingEdges: gtpi.gtpiPostingEdges ?? null,
    geneHeatOverrides: heat.geneHeatOverrides ?? null,
    mcpRestParityActions: parity.mcpRestParityActions ?? null,
    sources: {
      aiNav: aiNav.source,
      gtpi: gtpi.source,
      geneHeat: heat.source,
      mcpRestParity: parity.source,
    },
  };
}

/** @param {string} monorepoRoot */
export function readAiNavCatalogStats(monorepoRoot) {
  const rel = 'docs/_generated/ai-nav/TAG_CATALOG.json';
  const data = readJsonIfExists(path.join(monorepoRoot, rel));
  if (data?.entry_count == null) return { source: rel, available: false };
  return {
    source: rel,
    available: true,
    aiNavCatalogEntries: data.entry_count,
    aiNavCatalogIndexesScanned: data.platform_ai_index_files_scanned ?? null,
  };
}

/** @param {string} monorepoRoot */
export function readGtpiStats(monorepoRoot) {
  const rel = 'docs/_generated/ai-nav/TOKEN_POSTING_EDGES.json';
  const data = readJsonIfExists(path.join(monorepoRoot, rel));
  if (!data?.edges?.length) return { source: rel, available: false };
  return {
    source: rel,
    available: true,
    gtpiPostingEdges: data.edges.length,
  };
}

/** @param {string} monorepoRoot */
export function readGeneHeatOverrideStats(monorepoRoot) {
  const rel = 'shared/diagnostics/gene_path_overrides.yaml';
  const abs = path.join(monorepoRoot, rel);
  if (!fs.existsSync(abs)) return { source: rel, available: false };
  const text = fs.readFileSync(abs, 'utf8');
  const entries = (text.match(/^[\w.]+\.gen1:/gm) || []).length;
  return { source: rel, available: true, geneHeatOverrides: entries };
}

/** @param {string} monorepoRoot */
export function readMcpRestParityStats(monorepoRoot) {
  const rel = 'docs/api/MCP_REST_PARITY_MAP.json';
  const data = readJsonIfExists(path.join(monorepoRoot, rel));
  if (!data?.actions) return { source: rel, available: false };
  return {
    source: rel,
    available: true,
    mcpRestParityActions: Object.keys(data.actions).length,
  };
}

/**
 * Compare live MCP health tools_count to snapshot (observability only — never writes snapshot).
 * @param {{ counts?: { mcpRegistryTools?: number|null } }} snap
 * @param {{ url?: string, tolerance?: number }} [opts]
 */
export async function verifyLiveMcpHealth(snap, opts = {}) {
  const url = opts.url ?? process.env.AGENTSTACK_MCP_HEALTH_URL ?? 'https://agentstack.tech/mcp/health';
  const tolerance = opts.tolerance ?? 30;
  const expected = snap.counts?.mcpRegistryTools;
  if (expected == null) {
    console.warn('WARN live-mcp: no mcpRegistryTools in snapshot');
    return { ok: false, skipped: true };
  }

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(12_000) });
    if (!res.ok) {
      console.warn(`WARN live-mcp: HTTP ${res.status} from ${url}`);
      return { ok: false, httpStatus: res.status };
    }
    const data = await res.json();
    const live = data.tools_count ?? data.toolsCount ?? data.tools?.length;
    if (live == null) {
      console.warn('WARN live-mcp: no tools_count in health payload');
      return { ok: false };
    }
    const delta = Math.abs(Number(live) - expected);
    if (delta > tolerance) {
      console.warn(
        `WARN live-mcp: tools_count=${live} vs snapshot mcpRegistryTools=${expected} (Δ${delta})`,
      );
      return { ok: false, live, expected, delta };
    }
    console.log(`live-mcp OK: tools_count=${live} (snapshot registry ${expected})`);
    return { ok: true, live, expected };
  } catch (err) {
    console.warn(`WARN live-mcp: ${err.message}`);
    return { ok: false, error: err.message };
  }
}

/** Public subset for genetic-system-site / external consumers. */
export function buildSiteStatsSubset(snap) {
  return {
    generatedAt: snap.generatedAt,
    platformVersion: snap.platformVersion,
    counts: snap.counts,
    geneAccess: snap.geneAccess,
    harness: snap.harness,
    observability: snap.observability,
    pluginTriangle: snap.pluginTriangle,
    neuralPlane: snap.neuralPlane,
  };
}
