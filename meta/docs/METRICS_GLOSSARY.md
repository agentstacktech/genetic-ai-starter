# Metrics glossary — benchmark harness

**SoT (machine):** [metrics.snapshot.json](metrics.snapshot.json) · **Detail:** [benchmarks/results/ANALYSIS.md](../../benchmarks/results/ANALYSIS.md) · **Scorer:** `1.2.1`

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
| `agents_md` | [agents.md.only](../../benchmarks/baselines/agents.md.only) + **optimistic** policy transcripts | High median score, **low** map-first (genetic); not production AGENTS alone |
| `agents_md_weak` | Same file + **pessimistic** transcripts (grep, sed, no map maintenance) | Lower bound for same AGENTS file |
| `generic_cursorrules` | cursor.directory-style rules | — |
| `kit_minimal` | `install --profile minimal` on fixture | `agents_md` arm |
| `kit_standard` | standard + shop map overlay | — |
| `kit_standard_indexed` | standard + pre-filled `AI_INDEX.md` | Higher map-first and success on discovery |

**Install profiles vs arms:** [PROFILE_COMPARISON.md](PROFILE_COMPARISON.md) § Benchmark arms vs install profiles.

## Metrics

| Metric | Definition |
|--------|------------|
| **Median score** | Median task score (0–10) over 14 synthetic tasks (T01–T14) per arm |
| **Success rate** | % tasks with score ≥ 6 |
| **Map-first (any)** | `AGENTS.md` or `README` or genetic map before first grep |
| **Map-first (genetic)** | `AI_NAVIGATION_MAP`, `GENE_COMPRESSION_MAP`, or `AI_INDEX.md` before grep |
| **Unscoped grep** | Heuristic count of repo-wide search in transcript |
| **Median context tokens** | Step model v1.2.1 — fixture-calibrated reads + grep pools |
| **TTFHF** | Tool-call proxy before first gold file |

## Agent floor (weak agent vs kit)

Harness models **weak navigation behavior** as arm `agents_md_weak` (grep, sed, no map maintenance). Same discipline **with** Navigation OS (`kit_standard_indexed`): median **2.5 → 9**, success **0% → 100%**, unscoped grep **16 → 0**. Use this when explaining “cheap model + kit” — not as proof on creative/architecture tasks. Narrative: [AGENT_FLOOR.md](AGENT_FLOOR.md) · [AGENT_FLOOR_ru.md](AGENT_FLOOR_ru.md).

## Primary KPIs (use in README)

Prefer **task-level deltas** over median alone:

| Task | bare | agents_md | agents_md_weak | kit_standard | kit + indexes |
|------|------|-----------|----------------|--------------|---------------|
| T04 bulk sed | 2 | 9 | 2 | 8 | 8 |
| T05 maintenance | 4 | 6 | 4 | **10** | **10** |
| T07 legacy trap | 1 | 9 | 1 | 5 | **7** |
| T08 catalog bug | 7 | 5 | 4 | 7 | **10** |

**Headline vs bare (synthetic, scorer 1.2.1):** median +2.5 (standard) / +3.5 (indexed) · unscoped grep −17/−18 · T05 +6 · T04 +6 · T08 +3 (indexed).

## Token model (scorer 1.2.1)

**Field:** `contextTokensTotal` — step sum (fixture reads + grep pools scaled to fixture size, v1.2.1). See [TOKEN_REPORT.md](../../benchmarks/results/TOKEN_REPORT.md) · [TOKEN_ECONOMICS_ru.md](TOKEN_ECONOMICS_ru.md).

**Do not** compare kit_standard vs kit_standard_indexed as winner/loser on tokens alone — medians can be within ~10%; compare **vs bare** on discovery tasks (T02/T08/T12).

**kit + indexes** (14 tasks, synthetic): higher median **score** and **map-first (genetic)** when indexes are pre-filled; token savings vs bare come mainly from **avoiding unscoped grep**, not from halving tokens between map and index arms.

## Paradox: median ≠ success rate

`generic_cursorrules` can show median **8** with success **64%** — many tasks at threshold 6–7, few failures pull success down.

## Execution modes

| Mode | Source | Use |
|------|--------|-----|
| **Harness v1 (committed)** | `run-matrix.mjs` synthetic policy | CI regression, README numbers |
| **Manual v2** | Human Cursor export → scorer | [benchmarks/METHODOLOGY.md](../../benchmarks/METHODOLOGY.md) § Manual validation |

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
