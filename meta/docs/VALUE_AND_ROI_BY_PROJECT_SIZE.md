# Value and ROI by project size — Genetic AI Starter Kit

**Genetic tag:** `repo.tooling.genetic_starter.gen1`  
**RU:** [VALUE_AND_ROI_BY_PROJECT_SIZE_ru.md](VALUE_AND_ROI_BY_PROJECT_SIZE_ru.md)  
**Evidence:** [DOC_CLAIMS_AUDIT.md](DOC_CLAIMS_AUDIT.md) · harness [metrics.snapshot.json](metrics.snapshot.json)

This document models **money and time saved on real projects** — not token KPI alone. Dollar figures are **transparent estimates** from observable failure modes; adjust rates for your region and team.

---

## What you are buying (one sentence)

**Navigation OS in git:** map → index → hot files → doctor — so agents and humans stop paying rework tax on wrong-module PRs, forgotten docs, and duplicate subsystems.

---

## Assumptions (change these in your spreadsheet)

| Input | Default | Notes |
|-------|---------|-------|
| Blended developer rate | **$85/h** | Mid-level US/EU remote; use $50–$120 for your band |
| AI-assisted dev share | **30%** of engineering time | Cursor/agent on features, bugs, refactors |
| Kit install (one-time) | **3 h** | `init` + Tier 0/1 + first `doctor` |
| Kit maintenance | **1.5 h/month** | Map/index updates (partially replaces ad-hoc README edits) |
| Harness reference | shop-api, scorer **1.2.1**, 14 tasks | Mechanism proof — [BENEFITS_AND_METRICS.md](BENEFITS_AND_METRICS.md) |

**Kit license cost:** $0 (Apache-2.0). Optional: Cursor subscription, AgentStack platform fees — outside this doc.

---

## Failure modes → hours → dollars

| Failure mode | Without kit (typical) | With kit | Harness task |
|--------------|----------------------|----------|----------------|
| Wrong file / legacy decoy | 1.5–4 h rework + review | Map → index → 1–2 files | T07, T08 |
| Repo-wide `sed` / bulk script | 2–8 h rollback | Gene + rule refuse | T04 |
| New module, no map/index | 1–3 h follow-up PR | Same PR includes Tier 1 + index | T05 |
| Release without navigation | 2–6 h hotfix | T13: doctor + validate | T13 |
| Onboarding (human or agent) | 2–5 days tribal knowledge | 0.5–1 day map-first | — |
| Duplicate subsystem (large repos) | **weeks** of debt | Genetic tag = one contour | [KILLER_FEATURE_LARGE_PROJECTS.md](KILLER_FEATURE_LARGE_PROJECTS.md) |
| AgentStack integration drift | 4–12 h per sprint | Recipes + capability contract | `agentstack-app` |

---

## Modeled monthly savings by project size

**Source of truth:** `node scripts/calculate-roi.mjs` → [roi-model.snapshot.json](roi-model.snapshot.json).  
**Formula (per month):**  
`(incidents × hours_saved) + release_gate + (onboarding_quarterly ÷ 3) − maintenance`  
*(incremental AgentStack tier does not subtract maintenance again — it stacks on a base profile.)*

| Profile | Team | Install profile | **Net $/month** | **Net $/year** |
|---------|------|-----------------|-----------------|----------------|
| **Solo / micro** | 1 dev | `standard` | **~$340** | **~$4.1k** |
| **Small product** | 2–5 devs | `standard` | **~$1,050** | **~$12.6k** |
| **Medium** | 6–15 devs | `standard` + indexes | **~$2,170** | **~$26k** |
| **Large / monorepo** | 15+ devs | + [LARGE_PROJECT_PLAYBOOK](LARGE_PROJECT_PLAYBOOK.md) | **~$4,080** | **~$49k** |
| **AgentStack (incremental)** | on top of small | **`agentstack-app`** | **~$1,400** | **~$17k** |
| **AgentStack total** | small + platform | **`agentstack-app`** | **~$2,450** | **~$29k** |

### Worksheet example (small team)

```
Incidents:  4/mo × 2.75h = 11.0h
Release:    1.5h/mo
Onboarding: 4h/quarter → 1.33h/mo
Gross:      13.83h − 1.5h maintenance = 12.33h net
→ 12.33h × $85/h ≈ $1,048/mo (rounded ~$1,050 in tables)
```

Reproduce all tiers: `node scripts/calculate-roi.mjs` · JSON: `node scripts/calculate-roi.mjs --json`

### How to read the table

- **Solo:** pays back install in **&lt;1 week** (~$340/mo net); main win = fewer wrong-file loops with cheap models ([AGENT_FLOOR.md](AGENT_FLOOR.md)).
- **Small:** one avoided “grep roulette” incident per sprint ≈ **$170–$340**; kit + indexes push harness success **93% → 100%**.
- **Medium:** each new hire saves **~16 h** discovery in quarter 1; index coverage is the multiplier.
- **Large:** duplicate subsystem prevention dominates — one avoided parallel auth/checkout contour saves **$15k–$40k** (not in monthly table; treat as risk reduction).
- **AgentStack:** incremental **~$1,400/mo** on top of a small team; **total ~$2,450/mo** with recipes + contract ([AGENTSTACK_APP_GUIDE.md](AGENTSTACK_APP_GUIDE.md)).

---

## Comparison: kit vs alternatives (money, not vibes)

| Approach | Setup cost | Ongoing cost | Wrong-file risk | Scales past 50k LOC |
|----------|------------|--------------|-----------------|---------------------|
| README only | 0 h | README rots | High | Poor |
| Single `AGENTS.md` (no map) | 2 h | Rewrite quarterly | Medium–high | Poor (harness `agents_md_weak` **0%** success) |
| cursor.directory rules only | 1 h | No map linkage | Medium | Poor |
| **genetic-ai-starter `standard`** | 3 h | 1.5 h/mo map | Low | Good with indexes |
| **`agentstack-app`** | 4 h | +capability refresh on platform bump | Low + **no MCP drift** | Best for platform consumers |

---

## AgentStack `agentstack-app` — incremental value

| Asset | What it saves |
|-------|----------------|
| `examples/agentstack/` recipes 00–11 | **4–8 h** wiring SDK/MCP/8DNA per developer |
| `check-capability-contract.mjs` | CI catches stale action ids — **1–3 h** per drift incident |
| `src/lib/agentstack.ts` bootstrap | No forked SDK init in every repo |
| 5 AgentStack Cursor skills | Intent → channel aligned with plugin evals |
| Flow A/B SDK acquisition | Clear npm vs submodule path — [AGENTSTACK_APP_GUIDE.md](AGENTSTACK_APP_GUIDE.md) |

**Install:**

```bash
node tools/genetic-ai-starter/scripts/install.mjs \
  --target . --profile agentstack-app --project-name "My App" --domain app --strict
cd examples/agentstack && npm install @agentstack/sdk@0.4.15 && npm run recipe:00-bootstrap
```

---

## Leading KPIs (track in your repo)

1. **Map-first PR rate** — % of agent/human PRs citing genetic tag or `AI_NAVIGATION_MAP` before file paths ([ROI_PLAYBOOK.md](ROI_PLAYBOOK.md)).
2. **validate-installed green on main** — zero broken links / missing philosophy.
3. **Index coverage** — % of subsystems with 10+ integration points that have `AI_INDEX.md`.
4. **AgentStack:** `check-capability-contract` green; `recipeSetVersion` matches platform.

---

## When kit is *not* worth the money

- Throwaway prototype (&lt;2 week life) — use nothing or `minimal` only.
- Single-file CLI with obvious layout — `minimal` at most.
- Team that never uses AI assistants — benefits are mostly onboarding/docs discipline; ROI lower.

---

## Related docs

| Doc | Topic |
|-----|-------|
| [REAL_BENEFITS.md](REAL_BENEFITS.md) | Narrative + harness |
| [TOKEN_ECONOMICS.md](TOKEN_ECONOMICS.md) | Context token proxy (secondary) |
| [PROFILE_COMPARISON.md](PROFILE_COMPARISON.md) | Which profile to install |
| [AGENTSTACK_APP_GUIDE.md](AGENTSTACK_APP_GUIDE.md) | Consumer flow A/B |
| [DOC_HUB.md](DOC_HUB.md) | Full doc index |
