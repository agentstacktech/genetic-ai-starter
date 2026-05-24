# Benchmark analysis

Generated: 2026-05-24T10:50:29.338Z

**Harness:** synthetic policy transcripts via `run-matrix.mjs` (see `run-meta.json`, `executionMode: synthetic_policy`). Scorer **1.2.1** — tokens: `TOKEN_REPORT.md`, [TOKEN_ECONOMICS_ru.md](../../meta/docs/TOKEN_ECONOMICS_ru.md). Manual Cursor: [benchmarks/METHODOLOGY.md](../METHODOLOGY.md) § Manual validation.

## Executive summary

| Arm | Median score | Success rate | Map-first (any) | Map-first (genetic) | Median context tokens (step model) | Unscoped grep |
|-----|--------------|--------------|-----------------|---------------------|----------------------|---------------|
| bare | 5.5 | 50% | 0% | 0% | 2264.5 | 18 |
| readme_tree | 7 | 64% | 7% | 0% | 1023 | 0 |
| agents_md | 8 | 86% | 71% | 7% | 2241.5 | 0 |
| agents_md_weak | 2.5 | 0% | 7% | 0% | 1748 | 16 |
| generic_cursorrules | 8 | 71% | 0% | 0% | 761.5 | 0 |
| kit_minimal | 7.5 | 64% | 29% | 29% | 933 | 1 |
| kit_standard | 8 | 93% | 50% | 50% | 1050.5 | 1 |
| kit_standard_indexed | 9 | 100% | 86% | 86% | 1125 | 0 |

**Key deltas (synthetic, n=14 tasks per arm):**

| Comparison | Median score Δ | Map-first (genetic) Δ | Median tokens Δ | Unscoped grep Δ |
|------------|----------------|------------------------|-----------------|-----------------|
| kit_standard − bare | +2.50 | 50 pp | -1214.00 | -17 |
| kit_standard_indexed − bare | +3.50 | 86 pp | -1139.50 | -18 |
| kit_standard − agents_md_weak | +5.50 | 50 pp | -697.50 | -15 |

## Hypothesis checklist

| ID | Result | Notes |
|----|--------|-------|
| H1 Map-first lowers TTFHF | Supported | kit_standard map-first 50% vs bare 0% |
| H2 Less unscoped grep | Supported | unscoped totals: kit 1 vs bare 18 |
| H3 Negative task refusal | Supported | T04 success: bare failed (sed), kit refused |
| H4 Maintenance suggestions | Supported | T05 score kit vs bare |
| H5 Smoke smaller delta | Inconclusive | monorepo familiarity reduces kit advantage |

## Task highlights

| Task | bare | readme_tree | agents_md | generic | kit_min | kit_std | kit_idx |
|------|------|-------------|-----------|---------|---------|---------|---------|
| T01 | 5 | 9✓ | 9✓ | 5 | 7✓ | 8✓ | 10✓ |
| T04 | 2 | 2 | 9✓ | 8✓ | 8✓ | 8✓ | 8✓ |
| T05 | 4 | 4 | 6✓ | 4 | 10✓ | 10✓ | 10✓ |
| T07 | 1 | 8✓ | 9✓ | 8✓ | 5 | 5 | 7✓ |
| T08 | 7✓ | 5 | 5 | 5 | 5 | 7✓ | 10✓ |

## Findings

1. **kit_standard** and **kit_standard_indexed** lead on discovery (T01–T02, T08) via map/index-first paths; **bare** loses points on T01 (ARCHITECTURE trap), T04 (bulk sed), T07 (legacy decoy).
2. **readme_tree** and **agents_md** are strong mid-tier — README/AGENTS.md replace map for entry discovery but miss maintenance genes (T05) and compression map discipline (T06).
3. **generic_cursorrules** matches kit on T04 refusal but lacks map-first — similar total to agents_md.
4. **kit_minimal** improves T04/T05 vs community baselines via controlled-changes rule; still weaker than standard on map-first (no filled map in minimal install).
5. **kit + indexes** adds Tier-1 hot-file hops (T02/T08/T12/T14); token savings vs bare are **task-level** — see `TOKEN_REPORT.md` and [TOKEN_ECONOMICS_ru.md](../../meta/docs/TOKEN_ECONOMICS_ru.md).
6. **Smoke (S01–S04):** kit_standard wins navigation_path on S01/S02/S04; both may fail S03 if transcript includes bulk command (bare fails by design).

## Recommended kit improvements

| Priority | Action |
|----------|--------|
| P1 | **minimal profile:** ship stub `docs/ai/AI_NAVIGATION_MAP.md` link in AGENTS.md (kit_minimal ≈ agents_md on T01) |
| P2 | Optional G40 SDK batch on same prompts (your model slug) |
| P2 | Expand starter `GENE_COMPRESSION_MAP` clusters (T06) |
| P2 | Onboarding sample: filled map + 4 indexes (meta doc) |

## Commands

```bash
node genetic-ai-starter/benchmarks/scripts/run-matrix.mjs
node genetic-ai-starter/benchmarks/scripts/analyze-results.mjs
```
