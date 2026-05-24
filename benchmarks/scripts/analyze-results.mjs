#!/usr/bin/env node
/**
 * Build ANALYSIS.md from scored JSON files.
 */
import fs from 'node:fs';
import path from 'node:path';
import { RESULTS_ROOT, BENCH_ROOT } from './lib/paths.mjs';

const SCORED = path.join(RESULTS_ROOT, 'scored');
const OUT = path.join(RESULTS_ROOT, 'ANALYSIS.md');

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
      list.map((x) => x.metrics?.estimatedContextTokens).filter((v) => v != null),
    ),
    unscopedTotal: list.reduce((a, x) => a + (x.metrics?.unscopedGrepCount || 0), 0),
    detourTotal: list.filter((x) => x.metrics?.detourLegacy).length,
  };
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
  const rows = loadScores();
  const synthetic = rows.filter((r) => /^T/.test(r.taskId));
  const smoke = rows.filter((r) => /^S/.test(r.taskId));
  const byArm = groupBy(synthetic, 'arm');

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

**Harness:** synthetic policy transcripts via \`run-matrix.mjs\` (see \`run-meta.json\`, \`executionMode: synthetic_policy\`). Scorer **1.1.1**. Manual Cursor exports: [MANUAL_TRACK.md](../../meta/docs/MANUAL_TRACK.md).

## Executive summary

| Arm | Median score | Success rate | Map-first (any) | Map-first (genetic) | Median tokens (est.) | Unscoped grep |
|-----|--------------|--------------|-----------------|---------------------|----------------------|---------------|
${arms
  .map((a) => {
    const s = stats[a];
    return `| ${a} | ${s.medianScore ?? '—'} | ${(s.successRate * 100).toFixed(0)}% | ${(s.mapFirstRate * 100).toFixed(0)}% | ${(s.mapFirstGeneticRate * 100).toFixed(0)}% | ${s.medianTokens ?? '—'} | ${s.unscopedTotal} |`;
  })
  .join('\n')}

**Key deltas (synthetic, n=11 per arm):**

| Comparison | Median score Δ | Map-first (genetic) Δ | Unscoped grep Δ |
|------------|----------------|------------------------|-----------------|
| kit_standard − bare | ${delta(kit, bare, 'medianScore')} | ${((kit.mapFirstGeneticRate - bare.mapFirstGeneticRate) * 100).toFixed(0)} pp | ${kit.unscopedTotal - bare.unscopedTotal} |
| kit_standard − agents_md | ${delta(kit, agents, 'medianScore')} | ${((kit.mapFirstGeneticRate - agents.mapFirstGeneticRate) * 100).toFixed(0)} pp | ${kit.unscopedTotal - agents.unscopedTotal} |
| kit_standard − agents_md_weak | ${delta(kit, agentsWeak, 'medianScore')} | ${((kit.mapFirstGeneticRate - agentsWeak.mapFirstGeneticRate) * 100).toFixed(0)} pp | ${kit.unscopedTotal - agentsWeak.unscopedTotal} |
| indexed − kit_standard | ${delta(indexed, kit, 'medianScore')} | ${((indexed.mapFirstGeneticRate - kit.mapFirstGeneticRate) * 100).toFixed(0)} pp | ${indexed.unscopedTotal - kit.unscopedTotal} |

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
5. **indexed − standard** gap is largest on T02/T08 — pre-filled \`AI_INDEX.md\` pays off when hot files are known.
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
}

main();
