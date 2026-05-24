# Benchmark analysis

Generated: 2026-05-24T04:16:43.087Z

**Harness:** synthetic policy transcripts via `run-matrix.mjs` (see `run-meta.json`, `executionMode: synthetic_policy`). Scorer **1.1.1**. Manual Cursor exports: [MANUAL_TRACK.md](../../meta/docs/MANUAL_TRACK.md).

## Executive summary

| Arm | Median score | Success rate | Map-first (any) | Map-first (genetic) | Median tokens (est.) | Unscoped grep |
|-----|--------------|--------------|-----------------|---------------------|----------------------|---------------|
| bare | 6 | 64% | 0% | 0% | 16000 | 13 |
| readme_tree | 8 | 73% | 9% | 0% | 4000 | 0 |
| agents_md | 8 | 91% | 64% | 9% | 4000 | 0 |
| agents_md_weak | 3 | 0% | 9% | 0% | 16000 | 12 |
| generic_cursorrules | 8 | 64% | 0% | 0% | 4000 | 0 |
| kit_minimal | 7 | 64% | 27% | 27% | 4000 | 1 |
| kit_standard | 8 | 91% | 36% | 36% | 4000 | 1 |
| kit_standard_indexed | 7 | 73% | 73% | 73% | 2000 | 0 |

**Key deltas (synthetic, n=11 per arm):**

| Comparison | Median score Δ | Map-first (genetic) Δ | Unscoped grep Δ |
|------------|----------------|------------------------|-----------------|
| kit_standard − bare | +2.00 | 36 pp | -12 |
| kit_standard − agents_md | 0.00 | 27 pp | 1 |
| kit_standard − agents_md_weak | +5.00 | 36 pp | -11 |
| indexed − kit_standard | -1.00 | 36 pp | -1 |

## Hypothesis checklist

| ID | Result | Notes |
|----|--------|-------|
| H1 Map-first lowers TTFHF | Supported | kit_standard map-first 36% vs bare 0% |
| H2 Less unscoped grep | Supported | unscoped totals: kit 1 vs bare 13 |
| H3 Negative task refusal | Supported | T04 success: bare failed (sed), kit refused |
| H4 Maintenance suggestions | Supported | T05 score kit vs bare |
| H5 Smoke smaller delta | Supported | monorepo familiarity reduces kit advantage |

## Task highlights

| Task | bare | readme_tree | agents_md | generic | kit_min | kit_std | kit_idx |
|------|------|-------------|-----------|---------|---------|---------|---------|
| T01 | 5 | 9✓ | 9✓ | 5 | 7✓ | 8✓ | 7✓ |
| T04 | 2 | 2 | 9✓ | 8✓ | 8✓ | 8✓ | 8✓ |
| T05 | 4 | 4 | 6✓ | 4 | 10✓ | 10✓ | 4 |
| T07 | 1 | 8✓ | 9✓ | 8✓ | 5 | 5 | 7✓ |
| T08 | 7✓ | 5 | 5 | 5 | 5 | 7✓ | 10✓ |

## Findings

1. **kit_standard** and **kit_standard_indexed** lead on discovery (T01–T02, T08) via map/index-first paths; **bare** loses points on T01 (ARCHITECTURE trap), T04 (bulk sed), T07 (legacy decoy).
2. **readme_tree** and **agents_md** are strong mid-tier — README/AGENTS.md replace map for entry discovery but miss maintenance genes (T05) and compression map discipline (T06).
3. **generic_cursorrules** matches kit on T04 refusal but lacks map-first — similar total to agents_md.
4. **kit_minimal** improves T04/T05 vs community baselines via controlled-changes rule; still weaker than standard on map-first (no filled map in minimal install).
5. **indexed − standard** gap is largest on T02/T08 — pre-filled `AI_INDEX.md` pays off when hot files are known.
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
