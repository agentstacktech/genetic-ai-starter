# Benchmark methodology — genetic-ai-starter

## Research question

Does **genetic-ai-starter** improve Cursor agent navigation versus bare repos, README trees, community `AGENTS.md`, and generic `.cursorrules`?

## Design

- **Primary substrate:** synthetic [`fixture-shop-api/`](fixture-shop-api/) (~20 TS files, decoys, stale `ARCHITECTURE.md`).
- **Optional smoke:** 4 tasks on the AgentStack monorepo (`S01`–`S04`), only arms `bare` vs `kit_standard`.
- **Execution (Harness v1, committed):** `run-matrix.mjs` generates **synthetic policy** transcripts per arm — reproducible CI regression (`executionMode: synthetic_policy` in `run-meta.json`).
- **Execution (Manual v2, optional):** export a real Cursor chat → `score-transcript.mjs` (see § Manual validation below). Full operator playbook: AgentStack monorepo `docs/genetic-ai-starter-maintainers/MANUAL_TRACK.md` (not on the public mirror).
- **Phase 2:** `@cursor/sdk` batch runs (G40).

## Control arms

| Arm | Description |
|-----|-------------|
| `bare` | Code + one-paragraph README |
| `readme_tree` | OSS-style README with folder tree |
| `agents_md` | Community `AGENTS.md` + **optimistic** policy transcripts |
| `agents_md_weak` | Same file + **pessimistic** transcripts (grep, sed, no map maintenance) |
| `generic_cursorrules` | cursor.directory-style TS rules |
| `kit_minimal` | `install.mjs --profile minimal` |
| `kit_standard` | `install.mjs --profile standard` + shop map overlay |
| `kit_standard_indexed` | standard + filled `AI_INDEX.md` per subsystem |

Each arm is a **separate copy** under `benchmarks/work/<arm>/` (`prepare-arm.mjs`).

## Hypotheses

| ID | Claim |
|----|--------|
| H1 | Map-first lowers tool calls to first correct hot file (TTFHF) |
| H2 | Unscoped repo-wide grep decreases on kit arms |
| H3 | Negative tasks (T04, S03) refused more often with engineering rules |
| H4 | Maintenance tasks (T05, S04) suggest index/map updates on kit arms |
| H5 | Smoke delta smaller than synthetic (familiar monorepo) |

## Metrics

See [`meta/docs/ROI_PLAYBOOK.md`](../meta/docs/ROI_PLAYBOOK.md) and [`config.json`](config.json).

- **TTFHF** — tool-call proxy before first gold file in transcript
- **Map-first rate** — map/index/AGENTS before first grep
- **Unscoped grep count** — heuristic regex on transcript
- **Task score** — rubric sum / 10 (`success` if ≥ 6)
- **Detour count** — mentions of `legacy/oldCheckout`

## Community baselines (HGT)

Per `repo.benchmarks.hgt.gen2`: sources are pinned in [`baselines/`](baselines/) before comparison — no mixing with kit payload.

## Limitations

- Manual runs introduce operator variance; record model in `results/run-meta.json`.
- Scorer heuristics can false-positive/negative on T09–T11; use `--manual` overrides.
- AgentStack smoke uses repo knowledge; do not treat as sole proof.

## Statistical note

Report **medians** per arm; re-run disputed (arm, task) twice. Full matrix: **8 arms × 14** synthetic tasks (+ smoke S01–S04 optional).

## Manual validation (your repo)

1. `node benchmarks/scripts/prepare-arm.mjs --arm kit_standard --force`
2. Open `benchmarks/work/kit_standard/` in Cursor and run prompts from `benchmarks/tasks/tasks.json`
3. Score: `node benchmarks/scripts/score-transcript.mjs --transcript <export.txt> --task T01 --arm kit_standard`

This is the honest check for marketing claims — harness v1 alone is synthetic policy, not your live model billing.
