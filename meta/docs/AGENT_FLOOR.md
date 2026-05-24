# Raising the floor — weak agents, stable engineering outcomes

**RU:** [AGENT_FLOOR_ru.md](AGENT_FLOOR_ru.md)

**Genetic tag:** `repo.tooling.genetic_starter.agent_floor.gen1`

**Related:** [METRICS_GLOSSARY.md](METRICS_GLOSSARY.md) · arm `agents_md_weak` · [AI_RELEASE_AUTONOMY.md](AI_RELEASE_AUTONOMY.md)

---

## One-paragraph thesis

Genetic AI Starter Kit does **not** turn a cheap model into “magic Opus.” It **raises the floor** on typical **repo-bound** work: find the canonical file, refuse `sed` across all of `src/`, update the map when a module grows, run doctor before merge. On those tasks, a **weak agent + kit** in the harness scores **consistently high** (**kit + indexes:** **100%** task success, median **9**), while the **same weak behavior without kit** (`agents_md_weak`) hits **0%** success and median **2.5**. A strong expensive model without a map may still brute-force a single task — with **high variance** and context cost.

---

## What we mean by “weak agent”

| In production | In the harness |
|---------------|----------------|
| Fast / cheap Cursor model | Arm **`agents_md_weak`** |
| grep-first, `sed`, no maintenance | Pessimistic synthetic transcript |
| No memory of yesterday’s PR | No Tier 1 / `AI_INDEX` / genes in repo |
| “Similar file” → wrong patch | T07 legacy decoy, T08 repo-wide search |

“Weak” here is **navigation and process discipline**, not abstract reasoning IQ.

---

## What we do **not** claim

| Not this | Why |
|----------|-----|
| “Mini model = Opus everywhere” | Product architecture, security, novel domains stay human-led |
| “100% without review” | Kit targets **merge-ready PR**; you approve |
| “Any chat without reading AGENTS” | `AGENTS.md` + rules must enter agent context |
| One-chat guarantee | Harness is **synthetic** — validate on your repo via [benchmarks/METHODOLOGY.md](../../benchmarks/METHODOLOGY.md) § Manual validation |

---

## What we **do** claim (scope)

**Repo-bound engineering** where success is scorable:

- correct file and path (T01, T07, T08);
- refuse dangerous bulk edits (T04);
- navigation maintenance when code grows (T05);
- release gate: map + index + doctor (T13).

Kit provides **rails**: narrower search, refusals, checklists in git.

---

## Harness evidence (scorer 1.2.1, 14 tasks)

Same **weak behavior style** vs **weak style + Navigation OS**:

| Metric | `agents_md_weak` | **kit + indexes** |
|--------|------------------|-------------------|
| Median task score | **2.5** | **9** |
| Success (≥6) | **0%** | **100%** |
| Map-first (genetic) | **0%** | **86%** |
| Unscoped grep | **16** | **0** |

**kit standard − agents_md_weak:** median **+5.5**, success **+50 pp** — [ANALYSIS.md](../../benchmarks/results/ANALYSIS.md).

### Tasks where weak fails and kit stays high

| Task | Meaning | agents_md_weak | kit + indexes |
|------|---------|----------------|---------------|
| **T01** | Prod entry, not dev trap | 2 | **10** |
| **T04** | No `sed` on all `src/` | 2 | **8** |
| **T05** | New module → map + index | 4 | **10** |
| **T07** | Checkout, not legacy | 1 | **7** |
| **T08** | Catalog bug, scoped | 4 | **10** |
| **T13** | Pre-release doctor | 4 | **10** |

Optimistic **`agents_md`** (median **8**, genetic map-first **7%**) shows the trap: **high average score without a map** ≠ **stable process** — T08/T13 still fail.

---

## Why this feels like “top-model level” (and the boundary)

### Stability beats peaks

| Pattern | bare / weak style | Strong model, no kit | **Weak model + kit** |
|---------|-------------------|----------------------|----------------------|
| T04 bulk sed | often fail | inconsistent refuse | **stable refuse via gene** |
| T05 map on new module | 4/10 | may forget | **10/10** in harness |
| Variance across tasks | high | medium | **low** on checklist work |
| Session cost | many grep | grep + huge context | **map-first, fewer hops** |

Top models without Navigation OS often **muscle through** with tokens and luck. **Weak + kit** takes the **short map route** — process KPIs align with strong models without paying for peak reasoning on every file lookup.

### Four rail layers

1. **Narrow search** — map/index → 1–2 hot files (T08 **4 → 10**).
2. **Hard stops** — `controlled_changes` (T04 **2 → 8**).
3. **Memory in git** — genes and map survive new chats.
4. **Gates** — T13 map + index + doctor (**4 → 10**).

### Team analogy

Like **types + linter + CODEOWNERS** — they do not make a junior a principal, but they **cut a class of bugs**. Kit cuts **navigation and process** failures for agents.

---

## Practice

| Step | Action |
|------|--------|
| 1 | `init --profile standard` — map, rules, genes |
| 2 | Fill Tier 0/1 for your packages |
| 3 | `AI_INDEX.md` on hot subsystems |
| 4 | PR checklist: map/index updated? `doctor` in CI |
| 5 | Proof on your model: [benchmarks/METHODOLOGY.md](../../benchmarks/METHODOLOGY.md) § Manual validation |

**Minimal** profile already lifts T04/T05 vs community AGENTS; **full floor** is standard + indexes.

---

## Limitations

- Harness models repo **affordances**, not all live-model outputs.
- Ignored `AGENTS.md` = no rails.
- API design, hard trade-offs, prod incidents — human + strong model; kit prevents repo chaos.

---

## See also

[DOC_CLAIMS_AUDIT.md](DOC_CLAIMS_AUDIT.md) · [REAL_BENEFITS.md](REAL_BENEFITS.md) · [COMPARISON_METHODS.md](COMPARISON_METHODS.md) · [TOKEN_ECONOMICS.md](TOKEN_ECONOMICS.md)
