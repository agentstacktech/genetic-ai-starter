#!/usr/bin/env node
/**
 * Unit checks for platform-stats-sources (gene bench math, MCP merge).
 */
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  countTier1Tags,
  readGeneAccessBench,
  readHarnessHighlights,
  readMcpPublicationStats,
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

console.log('platform-stats-sources.test.mjs OK');
