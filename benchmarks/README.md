# genetic-ai-starter benchmarks

Compare kit arms vs traditional / community AI navigation on a synthetic TypeScript API.

| Doc | Purpose |
|-----|---------|
| [METHODOLOGY.md](METHODOLOGY.md) | Design, hypotheses, metrics |
| [RUNBOOK.md](RUNBOOK.md) | Manual Cursor execution steps |
| [tasks/tasks.json](tasks/tasks.json) | Prompts and gold paths |
| [config.json](config.json) | Arms and thresholds |

## Quick CI (no agent runs)

```bash
node genetic-ai-starter/benchmarks/tests/fixture-integrity.test.mjs
node genetic-ai-starter/benchmarks/tests/tasks-schema.test.mjs
node genetic-ai-starter/benchmarks/tests/score-sample.test.mjs
```

## Run full matrix + analysis

```bash
node genetic-ai-starter/benchmarks/scripts/prepare-all-arms.mjs --force
node genetic-ai-starter/benchmarks/scripts/run-matrix.mjs
```

Writes: [`results/RESULTS.md`](results/RESULTS.md), [`results/ANALYSIS.md`](results/ANALYSIS.md), [`results/summary.csv`](results/summary.csv), [`results/RUN_MATRIX.md`](results/RUN_MATRIX.md).

## Prepare arms

```bash
node genetic-ai-starter/benchmarks/scripts/prepare-all-arms.mjs --force
```
