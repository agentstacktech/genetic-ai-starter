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
const RUN_META = path.join(RESULTS, 'run-meta.json');

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
      contextTokens: r.context_tokens ? Number(r.context_tokens) : null,
    });
  }

  const arms = {};
  for (const [arm, list] of byArm) {
    arms[arm] = {
      medianScore: median(list.map((x) => x.total)),
      successRate: list.filter((x) => x.success).length / list.length,
      taskCount: list.length,
      medianContextTokens: median(
        list.map((x) => x.contextTokens).filter((n) => n != null && !Number.isNaN(n)),
      ),
    };
  }

  const taskDelta = (tid) => {
    const get = (arm) =>
      Number(
        rows.find((r) => r.arm === arm && (r.task_id || r.task) === tid)?.total ?? 0,
      );
    const getTok = (arm) => {
      const v = rows.find((r) => r.arm === arm && (r.task_id || r.task) === tid)
        ?.context_tokens;
      return v ? Number(v) : null;
    };
    return {
      bare: get('bare'),
      agents_md: get('agents_md'),
      agents_md_weak: get('agents_md_weak'),
      kit_standard: get('kit_standard'),
      kit_standard_indexed: get('kit_standard_indexed'),
      tokens: {
        bare: getTok('bare'),
        kit_standard: getTok('kit_standard'),
        kit_standard_indexed: getTok('kit_standard_indexed'),
      },
    };
  };

  let scorerVersion = '1.2.0';
  if (fs.existsSync(RUN_META)) {
    scorerVersion = JSON.parse(fs.readFileSync(RUN_META, 'utf8')).scorerVersion || scorerVersion;
  }

  const snapshot = {
    generatedAt: new Date().toISOString(),
    scorerVersion,
    executionMode: 'synthetic_policy',
    platformVersion: '0.4.11',
    tokenModel: 'step-based v1.2.1 (fixture-calibrated grep pools) — see benchmarks/results/TOKEN_REPORT.md',
    arms,
    headlineDeltas: {
      T04: taskDelta('T04'),
      T05: taskDelta('T05'),
      T07: taskDelta('T07'),
      T08: taskDelta('T08'),
      T12: taskDelta('T12'),
    },
    primaryKpi: {
      kit_standard_vs_bare_medianDelta: (arms.kit_standard?.medianScore ?? 0) - (arms.bare?.medianScore ?? 0),
      kit_standard_indexed_vs_bare_medianDelta:
        (arms.kit_standard_indexed?.medianScore ?? 0) - (arms.bare?.medianScore ?? 0),
      kit_standard_indexed_vs_bare_tokenMedianDelta:
        (arms.bare?.medianContextTokens ?? 0) - (arms.kit_standard_indexed?.medianContextTokens ?? 0),
      tokenNote: 'Fixture-calibrated grep pools; shop-api ~6KB — see meta/docs/TOKEN_ECONOMICS_ru.md',
      unscopedGrep_bare: rows
        .filter((r) => r.arm === 'bare' && /^T/.test(r.task_id))
        .reduce((a, r) => a + Number(r.unscoped_grep || 0), 0),
      unscopedGrep_kit_standard_indexed: rows
        .filter((r) => r.arm === 'kit_standard_indexed' && /^T/.test(r.task_id))
        .reduce((a, r) => a + Number(r.unscoped_grep || 0), 0),
    },
    readmeFootnote:
      'agents_md arm = optimistic policy transcripts + community AGENTS file; agents_md_weak = pessimistic. Token column = step model, not API billing. Compare kit vs bare, not standard vs indexed as competitors.',
  };

  fs.writeFileSync(OUT, JSON.stringify(snapshot, null, 2));
  console.log(`wrote ${OUT}`);
}

main();
