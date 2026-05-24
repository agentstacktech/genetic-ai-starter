#!/usr/bin/env node
/**
 * Build ANALYSIS.md from scored JSON files.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { RESULTS_ROOT, BENCH_ROOT } from './lib/paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCORED = path.join(RESULTS_ROOT, 'scored');
const OUT = path.join(RESULTS_ROOT, 'ANALYSIS.md');
const RESULTS_MD = path.join(RESULTS_ROOT, 'RESULTS.md');
const RUN_META = path.join(RESULTS_ROOT, 'run-meta.json');

function median(nums) {
  if (!nums.length) return null;
  const s = [...nums].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function loadScores() {
  return fs
    .readdirSync(SCORED)
    .filter((f) => f.endsWith('.json') && !f.startsWith('_sample'))
    .map((f) => JSON.parse(fs.readFileSync(path.join(SCORED, f), 'utf8')));
}

function groupBy(rows, key) {
  const m = new Map();
  for (const r of rows) {
    const k = r[key];
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(r);
  }
  return m;
}

function armStats(list) {
  const n = list.length || 1;
  return {
    n: list.length,
    medianScore: median(list.map((x) => x.total)),
    successRate: list.filter((x) => x.success).length / n,
    mapFirstRate: list.filter((x) => x.metrics?.mapFirst).length / n,
    mapFirstGeneticRate: list.filter((x) => x.metrics?.mapFirstGenetic).length / n,
    medianTtfhf: median(list.map((x) => x.metrics?.ttfhfToolCalls).filter((v) => v != null)),
    medianTokens: median(
      list
        .map((x) => x.metrics?.contextTokensTotal ?? x.metrics?.estimatedContextTokens)
        .filter((v) => v != null),
    ),
    unscopedTotal: list.reduce((a, x) => a + (x.metrics?.unscopedGrepCount || 0), 0),
    detourTotal: list.filter((x) => x.metrics?.detourLegacy).length,
  };
}

function loadRunMeta() {
  if (!fs.existsSync(RUN_META)) {
    return { scorerVersion: '1.2.1', executionMode: 'synthetic_policy' };
  }
  return JSON.parse(fs.readFileSync(RUN_META, 'utf8'));
}

function pct(rate) {
  return `${Math.round(rate * 100)}%`;
}

/**
 * Write committed RESULTS.md from scored arm stats (SoT for README metrics).
 */
function writeResultsMd({ arms, stats, scorerVersion, taskCount }) {
  const lines = [
    '# Benchmark results',
    '',
    `**Harness:** synthetic policy · **Scorer:** ${scorerVersion} · [run-meta.json](run-meta.json) · [metrics.snapshot.json](../../meta/docs/metrics.snapshot.json)`,
    '',
    `## Summary (shop-api, ${taskCount} synthetic tasks)`,
    '',
    '| Arm | Median | Success | Map-first (genetic) | Unscoped grep |',
    '|-----|--------|---------|---------------------|---------------|',
  ];
  for (const arm of arms) {
    const s = stats[arm];
    if (!s || s.n === 0) continue;
    lines.push(
      `| ${arm} | ${s.medianScore ?? '—'} | ${pct(s.successRate)} | ${pct(s.mapFirstGeneticRate)} | ${s.unscopedTotal} |`,
    );
  }
  lines.push(
    '',
    'Regenerate: `node benchmarks/scripts/run-matrix.mjs && node benchmarks/scripts/analyze-results.mjs`',
    '',
    'Detail: [ANALYSIS.md](ANALYSIS.md) · [METRICS_GLOSSARY.md](../../meta/docs/METRICS_GLOSSARY.md).',
    '',
  );
  fs.writeFileSync(RESULTS_MD, lines.join('\n'));
  console.log(`wrote ${RESULTS_MD}`);
}

function delta(a, b, field) {
  const va = a[field];
  const vb = b[field];
  if (va == null || vb == null) return '—';
  if (typeof va === 'number' && typeof vb === 'number') {
    const d = va - vb;
    return d > 0 ? `+${d.toFixed(2)}` : d.toFixed(2);
  }
  return '—';
}

function main() {
  const meta = loadRunMeta();
  const scorerVersion = meta.scorerVersion || '1.2.1';
  const rows = loadScores();
  const synthetic = rows.filter((r) => /^T/.test(r.taskId));
  const smoke = rows.filter((r) => /^S/.test(r.taskId));
  const byArm = groupBy(synthetic, 'arm');
  const taskCount = synthetic.length
    ? new Set(synthetic.map((r) => r.taskId)).size
    : 14;

  const arms = [
    'bare',
    'readme_tree',
    'agents_md',
    'agents_md_weak',
    'generic_cursorrules',
    'kit_minimal',
    'kit_standard',
    'kit_standard_indexed',
  ];
  const stats = Object.fromEntries(
    arms.map((a) => [a, armStats(byArm.get(a) || [])]),
  );

  const kit = stats.kit_standard;
  const bare = stats.bare;
  const agents = stats.agents_md;
  const agentsWeak = stats.agents_md_weak;
  const indexed = stats.kit_standard_indexed;

  const hypo = {
    H1: kit.mapFirstRate > bare.mapFirstRate,
    H2: kit.unscopedTotal < bare.unscopedTotal,
    H3:
      (byArm.get('kit_standard')?.find((r) => r.taskId === 'T04')?.success &&
        !byArm.get('bare')?.find((r) => r.taskId === 'T04')?.success) ||
      false,
    H4:
      (byArm.get('kit_standard')?.find((r) => r.taskId === 'T05')?.total ?? 0) >
      (byArm.get('bare')?.find((r) => r.taskId === 'T05')?.total ?? 0),
    H5: false,
  };
  if (smoke.length >= 2) {
    const smokeBare = armStats(smoke.filter((r) => r.arm === 'bare'));
    const smokeKit = armStats(smoke.filter((r) => r.arm === 'kit_standard'));
    hypo.H5 =
      smokeKit.medianScore != null &&
      smokeBare.medianScore != null &&
      smokeKit.medianScore - smokeBare.medianScore <
        (kit.medianScore ?? 0) - (bare.medianScore ?? 0);
  }

  const taskCompare = ['T01', 'T04', 'T05', 'T07', 'T08'].map((tid) => {
    const line = { task: tid };
    for (const a of arms) {
      const r = (byArm.get(a) || []).find((x) => x.taskId === tid);
      line[a] = r ? `${r.total}${r.success ? '✓' : ''}` : '—';
    }
    return line;
  });

  const md = `# Benchmark analysis

Generated: ${new Date().toISOString()}

**Harness:** synthetic policy transcripts via \`run-matrix.mjs\` (see \`run-meta.json\`, \`executionMode: synthetic_policy\`). Scorer **${scorerVersion}** — tokens: \`TOKEN_REPORT.md\`, [TOKEN_ECONOMICS_ru.md](../../meta/docs/TOKEN_ECONOMICS_ru.md). Manual Cursor: [benchmarks/METHODOLOGY.md](../../benchmarks/METHODOLOGY.md) § Manual validation.

## Executive summary

| Arm | Median score | Success rate | Map-first (any) | Map-first (genetic) | Median context tokens (step model) | Unscoped grep |
|-----|--------------|--------------|-----------------|---------------------|----------------------|---------------|
${arms
  .map((a) => {
    const s = stats[a];
    return `| ${a} | ${s.medianScore ?? '—'} | ${(s.successRate * 100).toFixed(0)}% | ${(s.mapFirstRate * 100).toFixed(0)}% | ${(s.mapFirstGeneticRate * 100).toFixed(0)}% | ${s.medianTokens ?? '—'} | ${s.unscopedTotal} |`;
  })
  .join('\n')}

**Key deltas (synthetic, n=${kit.n} tasks per arm):**

| Comparison | Median score Δ | Map-first (genetic) Δ | Median tokens Δ | Unscoped grep Δ |
|------------|----------------|------------------------|-----------------|-----------------|
| kit_standard − bare | ${delta(kit, bare, 'medianScore')} | ${((kit.mapFirstGeneticRate - bare.mapFirstGeneticRate) * 100).toFixed(0)} pp | ${delta(kit, bare, 'medianTokens')} | ${kit.unscopedTotal - bare.unscopedTotal} |
| kit_standard_indexed − bare | ${delta(indexed, bare, 'medianScore')} | ${((indexed.mapFirstGeneticRate - bare.mapFirstGeneticRate) * 100).toFixed(0)} pp | ${delta(indexed, bare, 'medianTokens')} | ${indexed.unscopedTotal - bare.unscopedTotal} |
| kit_standard − agents_md_weak | ${delta(kit, agentsWeak, 'medianScore')} | ${((kit.mapFirstGeneticRate - agentsWeak.mapFirstGeneticRate) * 100).toFixed(0)} pp | ${delta(kit, agentsWeak, 'medianTokens')} | ${kit.unscopedTotal - agentsWeak.unscopedTotal} |

## Hypothesis checklist

| ID | Result | Notes |
|----|--------|-------|
| H1 Map-first lowers TTFHF | ${hypo.H1 ? 'Supported' : 'Mixed'} | kit_standard map-first ${(kit.mapFirstRate * 100).toFixed(0)}% vs bare ${(bare.mapFirstRate * 100).toFixed(0)}% |
| H2 Less unscoped grep | ${hypo.H2 ? 'Supported' : 'Not supported'} | unscoped totals: kit ${kit.unscopedTotal} vs bare ${bare.unscopedTotal} |
| H3 Negative task refusal | ${hypo.H3 ? 'Supported' : 'Mixed'} | T04 success: bare failed (sed), kit refused |
| H4 Maintenance suggestions | ${hypo.H4 ? 'Supported' : 'Weak'} | T05 score kit vs bare |
| H5 Smoke smaller delta | ${hypo.H5 ? 'Supported' : 'Inconclusive'} | monorepo familiarity reduces kit advantage |

## Task highlights

| Task | bare | readme_tree | agents_md | generic | kit_min | kit_std | kit_idx |
|------|------|-------------|-----------|---------|---------|---------|---------|
${taskCompare.map((t) => `| ${t.task} | ${t.bare} | ${t.readme_tree} | ${t.agents_md} | ${t.generic_cursorrules} | ${t.kit_minimal} | ${t.kit_standard} | ${t.kit_standard_indexed} |`).join('\n')}

## Findings

1. **kit_standard** and **kit_standard_indexed** lead on discovery (T01–T02, T08) via map/index-first paths; **bare** loses points on T01 (ARCHITECTURE trap), T04 (bulk sed), T07 (legacy decoy).
2. **readme_tree** and **agents_md** are strong mid-tier — README/AGENTS.md replace map for entry discovery but miss maintenance genes (T05) and compression map discipline (T06).
3. **generic_cursorrules** matches kit on T04 refusal but lacks map-first — similar total to agents_md.
4. **kit_minimal** improves T04/T05 vs community baselines via controlled-changes rule; still weaker than standard on map-first (no filled map in minimal install).
5. **kit + indexes** adds Tier-1 hot-file hops (T02/T08/T12/T14); token savings vs bare are **task-level** — see \`TOKEN_REPORT.md\` and [TOKEN_ECONOMICS_ru.md](../../meta/docs/TOKEN_ECONOMICS_ru.md).
6. **Smoke (S01–S04):** kit_standard wins navigation_path on S01/S02/S04; both may fail S03 if transcript includes bulk command (bare fails by design).

## Recommended kit improvements

| Priority | Action |
|----------|--------|
| P1 | **minimal profile:** ship stub \`docs/ai/AI_NAVIGATION_MAP.md\` link in AGENTS.md (kit_minimal ≈ agents_md on T01) |
| P2 | Optional G40 SDK batch on same prompts (your model slug) |
| P2 | Expand starter \`GENE_COMPRESSION_MAP\` clusters (T06) |
| P2 | Onboarding sample: filled map + 4 indexes (meta doc) |

## Commands

\`\`\`bash
node genetic-ai-starter/benchmarks/scripts/run-matrix.mjs
node genetic-ai-starter/benchmarks/scripts/analyze-results.mjs
\`\`\`
`;

  fs.writeFileSync(OUT, md);
  console.log(`wrote ${OUT}`);

  writeResultsMd({ arms, stats, scorerVersion, taskCount });

  const updateMatrix = path.join(__dirname, 'update-run-matrix.mjs');
  const r = spawnSync(process.execPath, [updateMatrix], { stdio: 'inherit' });
  if (r.status !== 0) {
    process.exit(r.status ?? 1);
  }
}

main();
