# Manual benchmark track (Harness v2)

Harness **v1** ([METHODOLOGY.md](../../benchmarks/METHODOLOGY.md)) uses `run-matrix.mjs` **synthetic policy** transcripts — committed, reproducible.

## Manual v2 (optional)

1. Prepare arm: `node benchmarks/scripts/prepare-arm.mjs --arm kit_standard --force`
2. Open `benchmarks/work/kit_standard/` in Cursor (Agent mode)
3. Run prompts from [benchmarks/tasks/tasks.json](../../benchmarks/tasks/tasks.json)
4. Export chat transcript to `benchmarks/results/raw/<arm>__<task>__manual1.txt`
5. Score:

```bash
node benchmarks/scripts/score-transcript.mjs \
  --transcript benchmarks/results/raw/kit_standard__T01__manual1.txt \
  --task T01 --arm kit_standard
```

Record model slug in [run-meta.json](../../benchmarks/results/run-meta.json) notes.

## Phase 2 automation

G40 — `@cursor/sdk` batch (POSTLAUNCH_ROADMAP).

## Genes

`repo.tooling.genetic_starter.benchmark.gen1`
