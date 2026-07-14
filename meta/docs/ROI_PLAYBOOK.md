# ROI playbook — measuring AI navigation effectiveness

**RU:** [ROI_PLAYBOOK_ru.md](ROI_PLAYBOOK_ru.md)  
**Dollar model by team size:** [VALUE_AND_ROI_BY_PROJECT_SIZE.md](VALUE_AND_ROI_BY_PROJECT_SIZE.md)

---

## Executive summary

| Project size | Modeled net savings | Payback of 3h install |
|--------------|---------------------|------------------------|
| Solo | ~$340/mo | &lt;1 week |
| Small (2–5 devs) | ~$1,050/mo | &lt;3 days |
| Medium (6–15) | ~$2,170/mo | immediate |
| Large monorepo | ~$4,080/mo | immediate |
| AgentStack (incremental) | ~$1,400/mo | first integration sprint |
| AgentStack total (small) | ~$2,450/mo | — |

Reproduce: `node scripts/calculate-roi.mjs` · snapshot [roi-model.snapshot.json](roi-model.snapshot.json).

---

## Leading indicators

- **Map-first rate:** In PR descriptions or agent summaries, count references to `docs/ai/AI_NAVIGATION_MAP.md` or genetic tags before file paths.
- **Index coverage:** % of subsystems with >10 integration points that have `AI_INDEX.md`.
- **Broken-link CI:** `validate-installed.mjs` failures per month (target: zero on main).
- **Weak-agent floor:** % of sessions refusing bulk `sed` (harness T04).

## Lagging indicators

- **Time to first correct hot file (TTFHF):** Median tool calls before first gold file — see [`benchmarks/METHODOLOGY.md`](../../benchmarks/METHODOLOGY.md).
- **Wrong-module PR rate:** PRs reverted or heavily rewritten because agent touched legacy/decoy files.
- **Release gate failures:** Hotfixes for forgotten map/route/index (harness T13).
- **Unscoped grep reduction:** Count from benchmark transcripts — fewer `rg` across entire `src/` without directory scope.

---

## Benchmark arms (comparison baseline)

Harness: [`benchmarks/`](../../benchmarks/). Control arms for A/B:

| Arm | What it represents |
|-----|-------------------|
| `bare` | Code only |
| `readme_tree` | Traditional OSS README tree |
| `agents_md` | Community AGENTS.md without genetic map |
| `agents_md_weak` | Same file, grep/sed behavior |
| `generic_cursorrules` | cursor.directory-style rules |
| `kit_minimal` / `kit_standard` / `kit_standard_indexed` | Kit profiles |
| `kit_agentstack` | `agentstack-app` install |

Run: [`benchmarks/RUNBOOK.md`](../../benchmarks/RUNBOOK.md). Aggregate: `node benchmarks/scripts/aggregate-results.mjs`.

**Reference snapshot:** [`metrics.snapshot.json`](metrics.snapshot.json) · scorer **1.2.1**, **14** tasks — T04 **2→8**, T05 **4→10**, T13 release gate, unscoped grep **18→0** (indexed), map-first **(genetic) 86%** (indexed). `agents_md` optimistic arm median **8** but map-first **7%** — cite task deltas, not median alone: [METRICS_GLOSSARY.md](METRICS_GLOSSARY.md).

**Token proxy:** `estimatedContextTokens` in scored JSON · [TOKEN_ECONOMICS.md](TOKEN_ECONOMICS.md) — **secondary** to merge-ready outcomes.

---

## Cost of *not* having a map (quick calculator)

```
monthly_loss ≈ (wrong_file_incidents × hours_per_incident × hourly_rate)
             + (release_forgotten_docs × hours × rate)
             + onboarding_hours_per_quarter / 3
```

Example (small team, default rate):  
`4 × 2.75h + 1.5h release + 4h/3 onboarding − 1.5h maint ≈ 12.33h × $85 ≈ $1,048/mo` — see `node scripts/calculate-roi.mjs --tier small`.

---

## Maintenance cost (honest)

| Item | Hours/month |
|------|-------------|
| Tier 0/1 map updates | 0.5–1 |
| New `AI_INDEX.md` per subsystem | 0.5–1 (amortized) |
| `doctor` / validate in CI | 0.1 (automated) |
| Kit upgrade (`upgrade.mjs`) | 0.25 per platform bump |
| AgentStack capability snapshot refresh | 0.5 per platform bump (maintainers) |

Net ROI remains positive for any team with **≥2** wrong-file or release-doc incidents per month.

---

## Profile-specific ROI

| Profile | Best for | ROI driver |
|---------|----------|------------|
| `minimal` | Scripts, &lt;5 modules | T04 refusal, stub map |
| `standard` | Most products | Map + genes + skills |
| `agentstack-app` | Platform consumers | Recipes + contract + MCP |
| `founder` | Monorepo contributors | Direct-ship gene emphasis |

See [PROFILE_COMPARISON.md](PROFILE_COMPARISON.md) · [AGENTSTACK_APP_GUIDE.md](AGENTSTACK_APP_GUIDE.md).

---

## When kit is not worth it

Single-file scripts, throwaway prototypes, or repos with <5 modules and obvious layout — use **minimal** profile only (`AGENTS.md` + navigation rule).

---

## Related

- [REAL_BENEFITS.md](REAL_BENEFITS.md) — narrative
- [PRODUCTION_OUTCOMES.md](PRODUCTION_OUTCOMES.md) — risk table
- [DOC_CLAIMS_AUDIT.md](DOC_CLAIMS_AUDIT.md) — evidence boundaries
