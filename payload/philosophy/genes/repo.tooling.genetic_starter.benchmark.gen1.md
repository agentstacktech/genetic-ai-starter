# Gene: `repo.tooling.genetic_starter.benchmark.gen1`

**Domain:** repo · tooling · genetic-ai-starter benchmark harness.

**Note:** Benchmark files live in the **genetic-ai-starter** kit tree (monorepo), not in consumer installs after `install.mjs`.

## Purpose

Define how to compare **genetic-ai-starter** against traditional and community AI navigation baselines without contaminating kit payload with experiment-only rules.

## Canonical artifacts (kit monorepo)

- `genetic-ai-starter/benchmarks/METHODOLOGY.md` — hypotheses, arms, metrics.
- `genetic-ai-starter/benchmarks/RUNBOOK.md` — manual Cursor protocol.
- `genetic-ai-starter/benchmarks/tasks/tasks.json` — prompts and gold paths.
- Synthetic fixture: `genetic-ai-starter/benchmarks/fixture-shop-api/`.

## Arms (v1)

`bare`, `readme_tree`, `agents_md`, `generic_cursorrules`, `kit_minimal`, `kit_standard`, `kit_standard_indexed`.

Community baselines: `genetic-ai-starter/benchmarks/baselines/` (HGT: search → validate → port).

## Scoring

Deterministic transcript scorer v1 — no LLM judge. Optional `--manual` overrides for explain/docs tasks.

## Phase 2

Automated runs via `@cursor/sdk`; public leaderboard optional.

## See also

- `repo.tooling.genetic_starter.gen1` (monorepo Tier 0)
- `repo.benchmarks.hgt.gen2` — external pattern adoption discipline
