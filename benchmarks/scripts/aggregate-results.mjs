#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { RESULTS_ROOT, BENCH_ROOT } from './lib/paths.mjs';

const SCORED_DIR = path.join(RESULTS_ROOT, 'scored');
const SUMMARY_CSV = path.join(RESULTS_ROOT, 'summary.csv');
const RESULTS_MD = path.join(RESULTS_ROOT, 'RESULTS.md');

function median(nums) {
  if (!nums.length) return null;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function main() {
  if (!fs.existsSync(SCORED_DIR)) {
    console.error('No scored results. Run score-transcript.mjs first.');
    process.exit(1);
  }
  const files = fs
    .readdirSync(SCORED_DIR)
    .filter((f) => f.endsWith('.json') && !f.startsWith('_sample'));
  const rows = files.map((f) => JSON.parse(fs.readFileSync(path.join(SCORED_DIR, f), 'utf8')));

  const byArm = new Map();
  for (const r of rows) {
    if (!byArm.has(r.arm)) byArm.set(r.arm, []);
    byArm.get(r.arm).push(r);
  }

  const lines = [
    'arm,task_id,total,success,ttfhf,unscoped_grep,map_first,detour_legacy,context_tokens',
  ];
  for (const r of rows) {
    lines.push(
      [
        r.arm,
        r.taskId,
        r.total,
        r.success ? 1 : 0,
        r.metrics?.ttfhfToolCalls ?? '',
        r.metrics?.unscopedGrepCount ?? '',
        r.metrics?.mapFirst ? 1 : 0,
        r.metrics?.detourLegacy ? 1 : 0,
        r.metrics?.contextTokensTotal ?? r.metrics?.estimatedContextTokens ?? '',
      ].join(','),
    );
  }
  fs.writeFileSync(SUMMARY_CSV, `${lines.join('\n')}\n`);

  const armStats = [];
  for (const [arm, list] of byArm) {
    armStats.push({
      arm,
      runs: list.length,
      medianScore: median(list.map((x) => x.total)),
      successRate: list.filter((x) => x.success).length / list.length,
      mapFirstRate: list.filter((x) => x.metrics?.mapFirst).length / list.length,
      medianTtfhf: median(list.map((x) => x.metrics?.ttfhfToolCalls).filter((n) => n != null)),
      unscopedGrepTotal: list.reduce((a, x) => a + (x.metrics?.unscopedGrepCount || 0), 0),
    });
  }
  armStats.sort((a, b) => (b.medianScore ?? 0) - (a.medianScore ?? 0));

  console.log(`wrote ${SUMMARY_CSV}`);
  console.log('Run analyze-results.mjs for ANALYSIS.md; see results/RESULTS.md for summary.');
}

main();
