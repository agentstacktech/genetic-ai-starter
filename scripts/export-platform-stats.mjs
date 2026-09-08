#!/usr/bin/env node
/**
 * Build meta/docs/platform-stats.snapshot.json from AgentStack monorepo tree.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { walkMatchingBasename, DEFAULT_MONOREPO_SKIP_DIRS } from './lib/walk-files.mjs';
import {
  collectMonorepoAiIndexes,
} from './lib/platform-stats-scan.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_ROOT = path.resolve(KIT_ROOT, '..');

function countTier1Tags(mapPath) {
  if (!fs.existsSync(mapPath)) return null;
  const text = fs.readFileSync(mapPath, 'utf8');
  const matches = text.match(/`[a-z][a-z0-9_.]+\.gen1`/g);
  return matches ? new Set(matches).size : 0;
}

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

function main() {
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

  let platformVersion = '0.0.0';
  const pvKit = path.join(KIT_ROOT, 'PLATFORM_VERSION');
  if (fs.existsSync(pvKit)) {
    platformVersion = fs.readFileSync(pvKit, 'utf8').trim();
  }

  const snap = {
    generatedAt: new Date().toISOString(),
    platformVersion,
    monorepoRoot: root,
    includeCardGame,
    scanMode: fullScan ? 'full' : 'scoped',
    counts: {
      philosophyGenes,
      aiIndexFilesRepoTotal: allIndexes.length,
      aiIndexFilesPlatform: platformIndexes.length,
      navigationMapTier1Tags: countTier1Tags(path.join(root, 'docs', 'AI_NAVIGATION_MAP.md')),
      kitPayloadGenes: kitPayloadGeneCount,
      kitCursorRulesStandard: cursorCounts.rules,
      kitCursorSkillsStandard: cursorCounts.skills,
      benchmarkTasks: 14,
      benchmarkArms: 9,
      agentstackTaskPack: fs.existsSync(path.join(KIT_ROOT, 'benchmarks/tasks/agentstack-tasks.json'))
        ? JSON.parse(fs.readFileSync(path.join(KIT_ROOT, 'benchmarks/tasks/agentstack-tasks.json'), 'utf8')).tasks
            ?.length || 0
        : 0,
    },
    kitHarness: { ref: 'meta/docs/metrics.snapshot.json' },
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

main();
