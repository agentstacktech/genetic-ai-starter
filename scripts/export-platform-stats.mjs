#!/usr/bin/env node
/**
 * Build meta/docs/platform-stats.snapshot.json from AgentStack monorepo tree.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_ROOT = path.resolve(KIT_ROOT, '..');

function walkFiles(root, test, out = [], skipDirs = new Set(['node_modules', '.git', 'dist', 'build'])) {
  if (!fs.existsSync(root)) return out;
  for (const ent of fs.readdirSync(root, { withFileTypes: true })) {
    const p = path.join(root, ent.name);
    if (ent.isDirectory()) {
      if (skipDirs.has(ent.name)) continue;
      walkFiles(p, test, out, skipDirs);
    } else if (ent.isFile() && test(p, ent.name)) {
      out.push(p);
    }
  }
  return out;
}

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
  const root = path.resolve(process.env.AGENTSTACK_ROOT || DEFAULT_ROOT);
  const includeCardGame = process.argv.includes('--include-cardgame');

  const genes = walkFiles(path.join(root, 'philosophy', 'genes'), (_, name) => name.endsWith('.gen1.md'));
  const allIndexes = walkFiles(root, (_, name) => name === 'AI_INDEX.md');
  const platformIndexes = includeCardGame
    ? allIndexes
    : allIndexes.filter((p) => !p.replace(/\\/g, '/').includes('/CardGame/'));

  const payloadGenes = walkFiles(
    path.join(KIT_ROOT, 'payload', 'philosophy', 'genes'),
    (_, name) => name.endsWith('.gen1.md') && !name.startsWith('templates'),
  );

  const cursorCounts = countKitCursorPayload();

  const kitPayloadGeneCount = payloadGenes.filter(
    (p) => !p.includes(`${path.sep}templates${path.sep}`),
  ).length;

  let platformVersion = '0.4.11';
  const pvKit = path.join(KIT_ROOT, 'PLATFORM_VERSION');
  if (fs.existsSync(pvKit)) {
    platformVersion = fs.readFileSync(pvKit, 'utf8').trim();
  }

  const snap = {
    generatedAt: new Date().toISOString(),
    platformVersion,
    monorepoRoot: root,
    includeCardGame,
    counts: {
      philosophyGenes: genes.length,
      aiIndexFilesRepoTotal: allIndexes.length,
      aiIndexFilesPlatform: platformIndexes.length,
      navigationMapTier1Tags: countTier1Tags(path.join(root, 'docs', 'AI_NAVIGATION_MAP.md')),
      kitPayloadGenes: kitPayloadGeneCount,
      kitCursorRulesStandard: cursorCounts.rules,
      kitCursorSkillsStandard: cursorCounts.skills,
      benchmarkTasks: 14,
      benchmarkArms: 8,
    },
    kitHarness: { ref: 'meta/docs/metrics.snapshot.json' },
    readmeFootnote:
      'Platform scale ≠ harness shop-api scores. Regenerate: node scripts/export-platform-stats.mjs',
  };

  const out = path.join(KIT_ROOT, 'meta/docs/platform-stats.snapshot.json');
  fs.writeFileSync(out, `${JSON.stringify(snap, null, 2)}\n`);
  console.log(`wrote ${out}`);
  console.log(JSON.stringify(snap.counts, null, 2));
}

main();
