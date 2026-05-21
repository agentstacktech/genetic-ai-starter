# ROI playbook — measuring AI navigation effectiveness

## Leading indicators

- **Map-first rate:** In PR descriptions or agent summaries, count references to `docs/ai/AI_NAVIGATION_MAP.md` or genetic tags before file paths.
- **Index coverage:** % of subsystems with >10 integration points that have `AI_INDEX.md`.
- **Broken-link CI:** `validate-installed.mjs` failures per month (target: zero on main).

## Lagging indicators

- **Time to first correct hot file (TTFHF):** Median tool calls before first gold file — see [`benchmarks/METHODOLOGY.md`](../../benchmarks/METHODOLOGY.md).
- **Unscoped grep reduction:** Count from benchmark transcripts or subjective review — fewer `rg` across entire `src/` without directory scope.

## Benchmark arms (comparison baseline)

Harness: [`benchmarks/`](../../benchmarks/). Control arms for A/B:

| Arm | What it represents |
|-----|-------------------|
| `bare` | Code only |
| `readme_tree` | Traditional OSS README tree |
| `agents_md` | Community AGENTS.md without genetic map |
| `generic_cursorrules` | cursor.directory-style rules |
| `kit_minimal` / `kit_standard` / `kit_standard_indexed` | Kit profiles |

Run: [`benchmarks/RUNBOOK.md`](../../benchmarks/RUNBOOK.md). Aggregate: `node benchmarks/scripts/aggregate-results.mjs`.

**Benchmark (reference, simulated):** [`benchmarks/results/RESULTS.md`](../../benchmarks/results/RESULTS.md) — `kit_standard` +2 median vs `bare`, −12 unscoped grep; manual Cursor pass tracked as [GAP_REGISTER.md](GAP_REGISTER.md) G38.

## Maintenance cost

- **Index drift:** PRs that change entry points without updating `AI_INDEX.md` (track via review checklist).
- **Kit sync:** Frequency of `sync-from-canonical.mjs` commits after monorepo navigation changes.

## When kit is not worth it

Single-file scripts, throwaway prototypes, or repos with <5 modules and obvious layout — use **minimal** profile only (`AGENTS.md` + navigation rule).
