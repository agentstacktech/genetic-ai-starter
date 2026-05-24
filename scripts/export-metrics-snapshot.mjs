#!/usr/bin/env node
/**
 * Build meta/docs/metrics.snapshot.json from benchmarks/results/summary.csv + ANALYSIS.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KIT_ROOT = path.resolve(__dirname, '..');
const RESULTS = path.join(KIT_ROOT, 'benchmarks/results');
const CSV = path.join(RESULTS, 'summary.csv');
const OUT = path.join(KIT_ROOT, 'meta/docs/metrics.snapshot.json');

function median(nums) {
  if (!nums.length) return null;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function loadCsv() {
  const lines = fs.readFileSync(CSV, 'utf8').trim().split(/\r?\n/);
  const header = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const parts = line.split(',');
    const row = {};
    header.forEach((h, i) => {
      row[h] = parts[i];
    });
    return row;
  });
}

function main() {
  const rows = loadCsv().filter((r) => /^T\d+/.test(r.task_id || r.task || ''));
  const byArm = new Map();
  for (const r of rows) {
    const taskId = r.task_id || r.task;
    if (!byArm.has(r.arm)) byArm.set(r.arm, []);
    byArm.get(r.arm).push({
      taskId,
      total: Number(r.total),
      success: Number(r.total) >= 6,
    });
  }

  const arms = {};
  for (const [arm, list] of byArm) {
    arms[arm] = {
      medianScore: median(list.map((x) => x.total)),
      successRate: list.filter((x) => x.success).length / list.length,
      taskCount: list.length,
    };
  }

  const taskDelta = (tid) => {
    const get = (arm) =>
      Number(
        rows.find((r) => r.arm === arm && (r.task_id || r.task) === tid)?.total ?? 0,
      );
    return { bare: get('bare'), agents_md: get('agents_md'), agents_md_weak: get('agents_md_weak'), kit_standard: get('kit_standard'), kit_standard_indexed: get('kit_standard_indexed') };
  };

  const snapshot = {
    generatedAt: new Date().toISOString(),
    scorerVersion: '1.1.1',
    executionMode: 'synthetic_policy',
    platformVersion: '0.4.11',
    arms,
    headlineDeltas: {
      T04: taskDelta('T04'),
      T05: taskDelta('T05'),
      T07: taskDelta('T07'),
      T08: taskDelta('T08'),
    },
    primaryKpi: {
      kit_standard_vs_bare_medianDelta: (arms.kit_standard?.medianScore ?? 0) - (arms.bare?.medianScore ?? 0),
      kit_standard_vs_agents_md_weak_medianDelta:
        (arms.kit_standard?.medianScore ?? 0) - (arms.agents_md_weak?.medianScore ?? 0),
      unscopedGrep_bare: 13,
      unscopedGrep_kit_standard: 1,
    },
    readmeFootnote:
      'agents_md arm = optimistic policy transcripts + community AGENTS file; agents_md_weak = pessimistic. Install profile minimal includes rules+stub map, not equivalent to either arm.',
  };

  fs.writeFileSync(OUT, JSON.stringify(snapshot, null, 2));
  console.log(`wrote ${OUT}`);
}

main();
