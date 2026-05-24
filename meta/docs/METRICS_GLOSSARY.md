# Metrics glossary — benchmark harness

**SoT (machine):** [metrics.snapshot.json](metrics.snapshot.json) · **Detail:** [benchmarks/results/ANALYSIS.md](../../benchmarks/results/ANALYSIS.md) · **Scorer:** `1.1.1`

## Genes

- `repo.tooling.genetic_starter.benchmark.gen1`
- `repo.tooling.genetic_starter.docs.gen1`

## Philosophy

PHILOSOPHY_INDEX → Observability first

---

## Score scale (0–10)

Per task, sum of rubric dimensions (max 10). **Success** = total ≥ 6.

| Dimension | Typical weight | Meaning |
|-----------|----------------|---------|
| correct_file | 0–2 | Gold files mentioned |
| navigation_path | 0–2 | Map/index/gene discipline |
| scope_discipline | 0–2 | No repo-wide blind grep |
| outcome | 2–4 | Task goal met / refusal |
| efficiency | 0–2 | TTFHF proxy |

## Benchmark arms (do not confuse with install profiles)

| Arm ID | What it is | Not the same as |
|--------|------------|-----------------|
| `bare` | Fixture + one-paragraph README | Empty repo |
| `readme_tree` | OSS-style README tree | — |
| `agents_md` | [agents.md.only](../../benchmarks/baselines/agents.md.only) + **optimistic** policy transcripts | Your single `AGENTS.md` file alone |
| `agents_md_weak` | Same file + **pessimistic** transcripts (grep, sed, no map maintenance) | Failed agent session |
| `generic_cursorrules` | cursor.directory-style rules | — |
| `kit_minimal` | `install --profile minimal` on fixture | `agents_md` arm |
| `kit_standard` | standard + shop map overlay | — |
| `kit_standard_indexed` | standard + pre-filled `AI_INDEX.md` | Always better median (see paradox) |

**Install profiles vs arms:** [PROFILE_COMPARISON.md](PROFILE_COMPARISON.md) § Benchmark arms vs install profiles.

## Metrics

| Metric | Definition |
|--------|------------|
| **Median score** | Median of 11 synthetic tasks (T01–T11) per arm |
| **Success rate** | % tasks with score ≥ 6 |
| **Map-first (any)** | `AGENTS.md` or `README` or genetic map before first grep |
| **Map-first (genetic)** | `AI_NAVIGATION_MAP`, `GENE_COMPRESSION_MAP`, or `AI_INDEX.md` before grep |
| **Unscoped grep** | Heuristic count of repo-wide search in transcript |
| **Median tokens (est.)** | Scorer proxy: unscoped×8k + map×2k + tools×4k |
| **TTFHF** | Tool-call proxy before first gold file |

## Primary KPIs (use in README)

Prefer **task-level deltas** over median alone:

| Task | bare | agents_md | agents_md_weak | kit_standard | kit + indexes |
|------|------|-----------|----------------|--------------|---------------|
| T04 bulk sed | 2 | 9 | 2 | 8 | 8 |
| T05 maintenance | 4 | 6 | 4 | **10** | 4* |
| T07 legacy trap | 1 | 9 | 1 | 5 | 7 |
| T08 catalog bug | 7 | 5 | 4 | 7 | **10** |

\*Indexed arm T05 transcript in harness does not repeat full maintenance anchors — see paradox below.

**Headline vs bare (synthetic, scorer 1.1.1):** median +2 · unscoped grep −12 · T05 +6 · T04 +6.

## Paradox: indexed median 7 < standard 8

Pre-filled indexes **raise** genetic map-first (73% vs 36%) and **lower** estimated tokens, but **median** can drop when:

- T05 transcript assumes index already exists (fewer maintenance keywords → lower outcome).
- T01/T11 add index reads without score gains on simple hits.

**Recommendation:** cite **T08 = 10** and **map-first (genetic) 73%** for indexed arm, not median alone.

## Paradox: median ≠ success rate

`generic_cursorrules` can show median **8** with success **64%** — many tasks at threshold 6–7, few failures pull success down.

## Execution modes

| Mode | Source | Use |
|------|--------|-----|
| **Harness v1 (committed)** | `run-matrix.mjs` synthetic policy | CI regression, README numbers |
| **Manual v2** | Human Cursor export → scorer | Marketing proof — [MANUAL_TRACK.md](MANUAL_TRACK.md) |

## Limitations

- Synthetic transcripts model **affordances**, not live model variance.
- Scorer heuristics; T09–T11 may need `--manual` overrides.
- Smoke tasks (S01–S04) on AgentStack are optional and confounded by repo familiarity.

## Reproduce

```bash
node genetic-ai-starter/benchmarks/scripts/run-matrix.mjs
node genetic-ai-starter/scripts/export-metrics-snapshot.mjs
node genetic-ai-starter/scripts/check-docs-metrics.mjs
```
