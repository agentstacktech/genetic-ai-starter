# Benchmark runbook (manual)

## Prerequisites

- Node 20+
- AgentStack repo with `genetic-ai-starter/` at platform version in `KIT_MANIFEST.json`
- Cursor Agent mode; **new chat** per run

## 1. Prepare arms

From repo root:

```bash
node genetic-ai-starter/benchmarks/scripts/prepare-all-arms.mjs --force
```

Verify: `genetic-ai-starter/benchmarks/work/bare`, `.../kit_standard`, etc.

## 2. Record run metadata

Copy and fill:

```bash
cp genetic-ai-starter/benchmarks/results/run-meta.template.json genetic-ai-starter/benchmarks/results/run-meta.json
```

Fields: `model`, `cursorVersion`, `date`, `operator`.

## 3. Run one task

1. **File → Open Folder** → only `genetic-ai-starter/benchmarks/work/<arm>/`
2. New Agent chat (no AgentStack monorepo open for synthetic tasks)
3. Paste `prompt_ru` from [`tasks/tasks.json`](tasks/tasks.json) for task `T01`…`T11`
4. Let agent finish; export or copy transcript
5. Save as `genetic-ai-starter/benchmarks/results/raw/<arm>__<task>__run1.txt`

**Do not** rephrase prompts. **Do not** mix arms in one workspace.

## 4. Score

```bash
node genetic-ai-starter/benchmarks/scripts/score-transcript.mjs \
  --transcript genetic-ai-starter/benchmarks/results/raw/kit_standard__T01__run1.txt \
  --task T01 \
  --arm kit_standard
```

Optional override for open-ended tasks:

```bash
node genetic-ai-starter/benchmarks/scripts/score-transcript.mjs \
  --transcript ... --task T09 --arm kit_standard \
  --manual genetic-ai-starter/benchmarks/results/manual/T09.json
```

## 5. Reproducible matrix (reference harness)

Full 7×11 arms + smoke — same commands as CI:

```bash
node genetic-ai-starter/benchmarks/scripts/run-matrix.mjs
node genetic-ai-starter/benchmarks/scripts/analyze-results.mjs
```

See `results/ANALYSIS.md` and `results/run-meta.json`.

## 6. Aggregate

After all scored JSON files exist under `results/scored/`:

```bash
node genetic-ai-starter/benchmarks/scripts/aggregate-results.mjs
```

Opens `results/RESULTS.md` and `results/summary.csv`.

## 6. Smoke (optional)

Open **AgentStack monorepo root** (not work copy). Run `S01`–`S04` only for `bare` (no kit) vs `kit_standard` installed in a throwaway branch or document “monorepo already has navigation” as confound.

Prefer: install kit to a **sparse** consumer clone; for smoke, use arms documented in METHODOLOGY with workspace = monorepo.

## 7. Suggested order

1. Pilot: `bare` + `kit_standard` × (`T01`, `T04`, `T08`) — validate scorer
2. Full synthetic matrix
3. Smoke 8 runs

## Matrix checklist

See [`results/RUN_MATRIX.md`](results/RUN_MATRIX.md).
