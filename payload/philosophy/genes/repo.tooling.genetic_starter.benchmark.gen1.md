# Gene: `repo.tooling.genetic_starter.benchmark.gen1`

**Domain:** repo · tooling · genetic-ai-starter benchmark harness.

**Note:** Benchmark files live in the **genetic-ai-starter** kit tree (monorepo), not in consumer installs after `install.mjs`.

## Purpose

Compare **genetic-ai-starter** against baselines with reproducible synthetic policy transcripts.

## Arms (v1.1.1)

`bare`, `readme_tree`, `agents_md`, `agents_md_weak`, `generic_cursorrules`, `kit_minimal`, `kit_standard`, `kit_standard_indexed`.

- `agents_md` — optimistic policy + [agents.md.only](../../../benchmarks/baselines/agents.md.only)
- `agents_md_weak` — pessimistic policy (grep, sed, no map maintenance)

## Scoring

- Scorer **1.1.1** — negation-safe maintenance keywords; `mapFirstGenetic` vs `entryDocFirst`; `estimatedContextTokens` proxy
- Harness v1: `run-matrix.mjs` (`executionMode: synthetic_policy`)
- Manual v2: [MANUAL_TRACK.md](../../../meta/docs/MANUAL_TRACK.md)

## Metrics SoT

[metrics.snapshot.json](../../../meta/docs/metrics.snapshot.json) · [METRICS_GLOSSARY.md](../../../meta/docs/METRICS_GLOSSARY.md)

## See also

- `repo.tooling.genetic_starter.gen1`
- `repo.tooling.genetic_starter.docs.gen1`
