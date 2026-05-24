#!/usr/bin/env node
/**
 * Build TOKEN_REPORT.md from scored JSON (step model v1.2.1).
 */
import fs from 'node:fs';
import path from 'node:path';
import { RESULTS_ROOT } from './lib/paths.mjs';
import {
  getFixtureStats,
  unscopedGrepPool,
  scopedGrepPool,
  TOKEN_MODEL_VERSION,
} from './lib/token-model.mjs';

const SCORED = path.join(RESULTS_ROOT, 'scored');
const OUT = path.join(RESULTS_ROOT, 'TOKEN_REPORT.md');

const DISCOVERY_TASKS = new Set([
  'T01',
  'T02',
  'T03',
  'T06',
  'T07',
  'T08',
  'T12',
  'T14',
]);

function median(nums) {
  if (!nums.length) return null;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function sum(nums) {
  return nums.reduce((a, b) => a + b, 0);
}

function main() {
  const files = fs
    .readdirSync(SCORED)
    .filter((f) => f.endsWith('.json') && !f.startsWith('_sample'));
  const rows = files.map((f) => JSON.parse(fs.readFileSync(path.join(SCORED, f), 'utf8')));
  const synthetic = rows.filter((r) => /^T\d+/.test(r.taskId));

  const arms = ['bare', 'kit_standard', 'kit_standard_indexed'];

  const fixture = getFixtureStats();
  const unscoped = unscopedGrepPool();
  const scoped = scopedGrepPool();

  const armStats = Object.fromEntries(
    arms.map((arm) => {
      const list = synthetic.filter((r) => r.arm === arm);
      const allTok = list.map((r) => r.metrics?.contextTokensTotal ?? 0);
      const disc = list
        .filter((r) => DISCOVERY_TASKS.has(r.taskId))
        .map((r) => r.metrics?.contextTokensTotal ?? 0);
      return [
        arm,
        {
          medianAll: median(allTok),
          medianDiscovery: median(disc),
          sum: sum(allTok),
          n: list.length,
        },
      ];
    }),
  );

  const byArmTask = new Map();
  for (const r of synthetic) {
    byArmTask.set(`${r.arm}::${r.taskId}`, r);
  }

  const bareD = armStats.bare.medianDiscovery ?? 0;
  const idxD = armStats.kit_standard_indexed.medianDiscovery ?? 0;
  const ratio = idxD > 0 ? (bareD / idxD).toFixed(1) : '—';

  const lines = [
    '# Token report (step model)',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    `**Model:** ${TOKEN_MODEL_VERSION} — grep pools scale with fixture size.`,
    '',
    '## Fixture (shop-api)',
    '',
    `| | Value |`,
    `|---|-------|`,
    `| Files | **${fixture.fileCount}** |`,
    `| Source bytes | **${fixture.totalBytes}** (~${fixture.fullRepoTokens} tokens if read end-to-end) |`,
    `| Unscoped \`rg\` per transcript line | **${unscoped}** |`,
    `| Scoped grep per line | **${scoped}** |`,
    '',
    'Not API billing tokens. See [TOKEN_ECONOMICS_ru.md](../../meta/docs/TOKEN_ECONOMICS_ru.md).',
    '',
    '## Per-arm medians (T01–T14)',
    '',
    '| Arm | Median all tasks | Median discovery-only |',
    '|-----|------------------|------------------------|',
  ];

  for (const arm of arms) {
    const s = armStats[arm];
    lines.push(
      `| ${arm} | ${Math.round(s.medianAll ?? 0)} | ${Math.round(s.medianDiscovery ?? 0)} |`,
    );
  }

  lines.push(
    '',
    `**Discovery median ratio (bare / kit+indexes):** ~**${ratio}×**.`,
    '',
    '## Per-task tokens',
    '',
    '| Task | bare | kit_standard | kit + indexes |',
    '|------|------|--------------|---------------|',
  );

  const taskIds = [...new Set(synthetic.map((r) => r.taskId))].sort();
  for (const tid of taskIds) {
    const b = byArmTask.get(`bare::${tid}`)?.metrics?.contextTokensTotal ?? '—';
    const k = byArmTask.get(`kit_standard::${tid}`)?.metrics?.contextTokensTotal ?? '—';
    const i = byArmTask.get(`kit_standard_indexed::${tid}`)?.metrics?.contextTokensTotal ?? '—';
    lines.push(`| ${tid} | ${b} | ${k} | ${i} |`);
  }

  const bareWeek = Math.round((armStats.bare.medianAll ?? 0) * 8);
  const kitWeek = Math.round((armStats.kit_standard_indexed.medianAll ?? 0) * 8);
  lines.push(
    '',
    '## Small project (8 agent tasks/week)',
    '',
    `- bare: **~${bareWeek}** context tokens/week (median all tasks)`,
    `- kit + indexes: **~${kitWeek}** context tokens/week`,
    `- delta: **~${bareWeek - kitWeek}**/week`,
  );

  fs.writeFileSync(OUT, `${lines.join('\n')}\n`);
  console.log(`wrote ${OUT}`);
}

main();
