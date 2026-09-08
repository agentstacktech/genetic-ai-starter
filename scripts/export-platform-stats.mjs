#!/usr/bin/env node
/**
 * Build meta/docs/platform-stats.snapshot.json from AgentStack monorepo tree.
 * Merges navigation inventory + MCP publication + gene bench + harness KPIs.
 * Gene: repo.tooling.genetic_starter.gen1 · docs.freshness.living.gen1
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { walkMatchingBasename, DEFAULT_MONOREPO_SKIP_DIRS } from './lib/walk-files.mjs';
import { collectMonorepoAiIndexes } from './lib/platform-stats-scan.mjs';
import {
  collectNavigationInventory,
  collectObservabilityInventory,
  readGeneAccessBench,
  readHarnessHighlights,
  readMcpPublicationStats,
  readPluginTriangleStats,
} from './lib/platform-stats-sources.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_ROOT = path.resolve(KIT_ROOT, '..');

function countKitCursorPayload() {
  const rules = path.join(KIT_ROOT, 'payload', '.cursor', 'rules');
  const skills = path.join(KIT_ROOT, 'payload', '.cursor', 'skills');
  return {
    rules: fs.existsSync(rules) ? fs.readdirSync(rules).filter((f) => f.endsWith('.mdc')).length : 0,
    skills: fs.existsSync(skills)
      ? fs.readdirSync(skills, { withFileTypes: true }).filter((d) => d.isDirectory()).length
      : 0,
  };
}

function readPlatformVersion(kitRoot, mcpStats) {
  if (mcpStats.platformVersion) return mcpStats.platformVersion;
  const pvKit = path.join(kitRoot, 'PLATFORM_VERSION');
  if (fs.existsSync(pvKit)) return fs.readFileSync(pvKit, 'utf8').trim();
  return '0.0.0';
}

async function main() {
  const started = Date.now();
  const root = path.resolve(process.env.AGENTSTACK_ROOT || DEFAULT_ROOT);
  const includeCardGame = process.argv.includes('--include-cardgame');
  const fullScan = process.argv.includes('--full-scan');
  const timing = process.argv.includes('--timing');

  const statsSkipDirs = DEFAULT_MONOREPO_SKIP_DIRS;

  const philosophyGenes = walkMatchingBasename(
    path.join(root, 'philosophy', 'genes'),
    (_, name) => name.endsWith('.gen1.md'),
    statsSkipDirs,
  ).length;

  const allIndexes = collectMonorepoAiIndexes(root, {
    fullScan,
    skipDirs: statsSkipDirs,
    includeCardGame: true,
  });
  const platformIndexes = includeCardGame
    ? allIndexes
    : allIndexes.filter((p) => !p.replace(/\\/g, '/').includes('/CardGame/'));

  const payloadGenes = walkMatchingBasename(
    path.join(KIT_ROOT, 'payload', 'philosophy', 'genes'),
    (_, name) => name.endsWith('.gen1.md') && !name.startsWith('templates'),
    statsSkipDirs,
  );

  const cursorCounts = countKitCursorPayload();
  const kitPayloadGeneCount = payloadGenes.filter(
    (p) => !p.replace(/\\/g, '/').includes('/templates/'),
  ).length;

  const nav = collectNavigationInventory(root, KIT_ROOT);
  const mcp = readMcpPublicationStats(root);
  const geneAccess = readGeneAccessBench(root);
  const harness = readHarnessHighlights(KIT_ROOT);
  const observability = collectObservabilityInventory(root);
  const plugin = await readPluginTriangleStats(root);

  const snap = {
    generatedAt: new Date().toISOString(),
    platformVersion: readPlatformVersion(KIT_ROOT, mcp),
    monorepoRoot: root,
    includeCardGame,
    scanMode: fullScan ? 'full' : 'scoped',
    counts: {
      philosophyGenes,
      aiIndexFilesRepoTotal: allIndexes.length,
      aiIndexFilesPlatform: platformIndexes.length,
      navigationMapTier1Tags: nav.navigationMapTier1Tags,
      navigationMapScanRoots: nav.navigationMapScanRoots,
      geneCompressionClusters: nav.geneCompressionClusters,
      kitPayloadGenes: kitPayloadGeneCount,
      kitCursorRulesStandard: cursorCounts.rules,
      kitCursorSkillsStandard: cursorCounts.skills,
      mcpCatalogActionsPublic: mcp.mcpCatalogActionsPublic,
      mcpCatalogActionsTotal: mcp.mcpCatalogActionsTotal,
      mcpDomainsPublic: mcp.mcpDomainsPublic,
      mcpRegistryTools: mcp.mcpRegistryTools,
      devTestAtlasSlices: observability.counts.devTestAtlasSlices,
      devTestAtlasSlicesActive: observability.counts.devTestAtlasSlicesActive,
      devTestAtlasPlanes: observability.counts.devTestAtlasPlanes,
      monorepoAuditScripts: observability.counts.monorepoAuditScripts,
      openApiOperations: observability.counts.openApiOperations,
      openApiTags: observability.counts.openApiTags,
      mirroredPluginSkills: plugin.mirroredPluginSkills ?? null,
      benchmarkTasks: 14,
      benchmarkArms: 9,
      agentstackTaskPack: fs.existsSync(path.join(KIT_ROOT, 'benchmarks/tasks/agentstack-tasks.json'))
        ? JSON.parse(fs.readFileSync(path.join(KIT_ROOT, 'benchmarks/tasks/agentstack-tasks.json'), 'utf8'))
            .tasks?.length || 0
        : 0,
    },
    geneAccess: geneAccess.available
      ? {
          philosophyTokensNaive: geneAccess.philosophyTokensNaive,
          philosophyTokensResolved: geneAccess.philosophyTokensResolved,
          compressionRatio: geneAccess.compressionRatio,
          compressionLabel: geneAccess.compressionLabel,
          source: geneAccess.source,
        }
      : { available: false, source: geneAccess.source },
    harness: harness.available
      ? {
          ref: harness.ref,
          scorerVersion: harness.scorerVersion,
          weakMedian: harness.weakMedian,
          weakSuccessRate: harness.weakSuccessRate,
          kitIndexedMedian: harness.kitIndexedMedian,
          kitIndexedSuccessRate: harness.kitIndexedSuccessRate,
          medianTokenDeltaKitVsBare: harness.medianTokenDeltaKitVsBare,
          unscopedGrepBare: harness.unscopedGrepBare,
          unscopedGrepKitIndexed: harness.unscopedGrepKitIndexed,
        }
      : { ref: harness.ref, available: false },
    observability: {
      devTestAtlas: observability.atlas.available
        ? {
            source: observability.atlas.source,
            geneticTag: observability.atlas.geneticTag,
            slices: observability.atlas.devTestAtlasSlices,
            slicesActive: observability.atlas.devTestAtlasSlicesActive,
            planes: observability.atlas.devTestAtlasPlanes,
          }
        : { available: false, source: observability.atlas.source },
      openApi: observability.openApi.available
        ? {
            source: observability.openApi.source,
            operations: observability.openApi.openApiOperations,
            tags: observability.openApi.openApiTags,
            bundleVersion: observability.openApi.openApiBundleVersion,
          }
        : { available: false, source: observability.openApi.source },
      audits: observability.audits.available
        ? { source: observability.audits.source, scripts: observability.audits.monorepoAuditScripts }
        : { available: false, source: observability.audits.source },
    },
    pluginTriangle: plugin.available
      ? {
          source: plugin.source,
          mirroredSkills: plugin.mirroredPluginSkills,
          cursorSkillsTotal: plugin.cursorSkillsTotal,
          claudeSkills: plugin.claudePluginSkills,
          vscodeSkills: plugin.vscodePluginSkills,
          surfaces: plugin.pluginSurfaces,
          parityOk: plugin.parityOk,
        }
      : { available: false, source: plugin.source },
    sources: {
      mcpPublication: mcp.source,
      geneBench: geneAccess.source,
      harness: harness.ref,
      navigationMap: 'docs/AI_NAVIGATION_MAP.md',
      devTestAtlas: observability.atlas.source,
      openApiSummary: observability.openApi.source,
      pluginParity: plugin.source,
    },
    readmeFootnote:
      'Platform scale ≠ harness shop-api scores. Regenerate: node scripts/export-platform-stats.mjs',
  };

  const out = path.join(KIT_ROOT, 'meta/docs/platform-stats.snapshot.json');
  fs.writeFileSync(out, `${JSON.stringify(snap, null, 2)}\n`);
  console.log(`wrote ${out}`);
  console.log(JSON.stringify(snap.counts, null, 2));
  if (timing) {
    console.log(`export-platform-stats: ${Date.now() - started}ms (${snap.scanMode})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
