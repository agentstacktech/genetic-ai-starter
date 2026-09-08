#!/usr/bin/env node
/**
 * Unit checks for platform-stats-sources (gene bench math, MCP merge).
 */
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  countMonorepoAuditScripts,
  countTier1Tags,
  readAiNavCatalogStats,
  readDevTestAtlasStats,
  readGeneAccessBench,
  readGtpiStats,
  readHarnessHighlights,
  readMcpPublicationStats,
  readMcpRestParityStats,
  readOpenApiSummaryStats,
  readPluginTriangleStats,
} from '../scripts/lib/platform-stats-sources.mjs';

const KIT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = path.resolve(KIT_ROOT, '..');

const gene = readGeneAccessBench(REPO_ROOT);
assert.equal(gene.available, true, 'bench_gene_access.json');
assert.ok(gene.compressionRatio >= 10, 'compression ratio should be ~12×');
assert.equal(
  gene.compressionLabel,
  `${gene.compressionRatio}×`,
  'compression label matches ratio',
);

const mcp = readMcpPublicationStats(REPO_ROOT);
if (mcp.available) {
  assert.ok(mcp.mcpCatalogActionsPublic > 500, 'public MCP actions');
  assert.ok(mcp.mcpDomainsPublic > 40, 'public MCP domains');
}

const harness = readHarnessHighlights(KIT_ROOT);
assert.equal(harness.available, true, 'metrics.snapshot.json');
assert.equal(harness.kitIndexedSuccessRate, 1, 'kit+idx success rate');
assert.equal(harness.weakSuccessRate, 0, 'weak success rate');

const tags = countTier1Tags(path.join(REPO_ROOT, 'docs', 'AI_NAVIGATION_MAP.md'));
assert.ok(tags > 500, 'tier-1 tags');

const atlas = readDevTestAtlasStats(REPO_ROOT);
assert.equal(atlas.available, true, 'dev test atlas catalog');
assert.ok(atlas.devTestAtlasSlices > 100, 'atlas slices');

const audits = countMonorepoAuditScripts(REPO_ROOT);
assert.ok(audits.monorepoAuditScripts > 50, 'audit scripts');

const openApi = readOpenApiSummaryStats(REPO_ROOT);
assert.ok(openApi.openApiOperations > 500, 'openapi ops');

const aiNav = readAiNavCatalogStats(REPO_ROOT);
assert.ok(aiNav.aiNavCatalogEntries > 500, 'ai-nav catalog entries');

const gtpi = readGtpiStats(REPO_ROOT);
assert.ok(gtpi.gtpiPostingEdges > 1000, 'gtpi posting edges');

const parity = readMcpRestParityStats(REPO_ROOT);
assert.ok(parity.mcpRestParityActions > 400, 'mcp-rest parity actions');

const plugin = await readPluginTriangleStats(REPO_ROOT);
assert.equal(plugin.available, true, 'plugin triangle');
assert.equal(plugin.parityOk, true, 'plugin skill parity');
assert.ok(plugin.mirroredPluginSkills >= 20, 'mirrored skills');

console.log('platform-stats-sources.test.mjs OK');
