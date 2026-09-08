import fs from 'node:fs';
import path from 'node:path';
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
