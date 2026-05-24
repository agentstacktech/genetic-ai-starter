# Gene: `repo.tooling.genetic_starter.benchmark.gen1`



**Domain:** repo · tooling · genetic-ai-starter benchmark harness.



**Note:** Benchmark files live in the **genetic-ai-starter** kit tree (monorepo), not in consumer installs after `install.mjs`.



## Purpose



Compare **genetic-ai-starter** against baselines with reproducible synthetic policy transcripts.



## Arms (v1.2.1, 14 tasks T01–T14)



`bare`, `readme_tree`, `agents_md`, `agents_md_weak`, `generic_cursorrules`, `kit_minimal`, `kit_standard`, `kit_standard_indexed`.



- `agents_md` — optimistic policy + [agents.md.only](https://github.com/agentstacktech/genetic-ai-starter/blob/main/benchmarks/baselines/agents.md.only); high median, low map-first (genetic)

- `agents_md_weak` — pessimistic policy (grep, sed, no map maintenance)



## Scoring



- Scorer **1.2.1** — negation-safe maintenance; `mapFirstGenetic` vs `entryDocFirst`; `contextTokensTotal` step model (fixture-calibrated grep)

- Harness v1: `run-matrix.mjs` (`executionMode: synthetic_policy`)

- Manual v2: [benchmarks/METHODOLOGY](https://github.com/agentstacktech/genetic-ai-starter/blob/main/benchmarks/METHODOLOGY.md) (operator playbook: monorepo `docs/genetic-ai-starter-maintainers/MANUAL_TRACK.md`)



## Metrics SoT



[metrics.snapshot.json](https://github.com/agentstacktech/genetic-ai-starter/blob/main/meta/docs/metrics.snapshot.json) · [METRICS_GLOSSARY](https://github.com/agentstacktech/genetic-ai-starter/blob/main/meta/docs/METRICS_GLOSSARY.md)



## See also



- `repo.tooling.genetic_starter.gen1`

- `repo.tooling.genetic_starter.docs.gen1`

