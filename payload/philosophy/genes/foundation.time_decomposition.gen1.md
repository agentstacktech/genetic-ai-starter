# Gene — `foundation.time_decomposition.gen1` (foundation tier)

**Genetic tag:** `foundation.time_decomposition.gen1`  
**Also:** Time Processes (v0.2.52) — time as a pillar of rollout, scheduling, journals  
**Scope:** **Time-Decomposition-Completion (TDC)** — how we finish work without leaving half-elephants in the repo.

---

## The three words

| Word | Meaning on AgentStack |
|------|------------------------|
| **Time** | Ordered slices; owner version gates; journal dates; cron lifecycles |
| **Decomposition** | Each slice is a valid “bite” ([foundation.decomposition_reassembly.gen1.md](foundation.decomposition_reassembly.gen1.md)) |
| **Completion** | Explicit **done**: tests, ADR/runbook, map/index update, CHANGELOG + [EVOLUTION_JOURNAL.md](../PHILOSOPHY_INDEX.md) when shipping |

> Complex tasks are solved **incrementally**; always **finish** what you start — or mark “planned” with a gene/ADR, not silent TODOs.

---

## TDC document shapes

| Artifact | TDC sections |
|----------|----------------|
| **Journal story** | Meta → Контекст → Принципы → Проблема → Сдвиг → Результат → Итог → Ссылки ([template](https://github.com/agentstacktech/AgentStack/tree/main/docs/journals/JOURNAL_STORY_TEMPLATE.md)) |
| **Evolution journal** | Same arc per platform jump ([EVOLUTION_JOURNAL.md](../PHILOSOPHY_INDEX.md)) |
| **ADR** | Context → Decision → Consequences (+ links to genes) |
| **Release** | CHANGELOG fact + evolution block + RELEASE_NOTES row |

**Three levels (gen2 era, still valid):** concept → first shippable format → semantic refactor — see [PHILOSOPHY_IN_ACTION_HISTORY.md](../PHILOSOPHY_INDEX.md) rule on gen2 format.

---

## Version gating (owner time)

Platform version string: `AGENTSTACK_CORE_VERSION` in `shared/constants.py`. **Bump only with owner approval** — [https://github.com/agentstacktech/AgentStack/tree/main/philosophy/genes/axiom.version.control.lance_will.gen2.md](https://github.com/agentstacktech/AgentStack/tree/main/philosophy/genes/https://github.com/agentstacktech/AgentStack/tree/main/philosophy/genes/axiom.version.control.lance_will.gen2.md), [docs/VERSIONING.md](https://github.com/agentstacktech/AgentStack/tree/main/docs/VERSIONING.md).

TDC for releases: code + docs + genes + indexes in **one** publish story (e.g. 0.4.12–13 combined journal).

---

## Examples (completion criteria were met)

| Slice | Completion proof |
|-------|------------------|
| Sandbox 0.4.2 | Seven atomic fork steps + `SANDBOX_PLAYGROUND_GUIDE.md` |
| Unified 8DNA 0.4.7 | Migration + ADR + neural visualizer + journal |
| MCP plugin index | Four plugins in one README + verify checklist |
| Ownership 0.4.13 | Scoped REST + support search + combined story #17–18 |

---

## AI instructions

- Do not mark a subsystem “done” without updating **`AI_INDEX.md`** / map row when boundaries moved.  
- Prefer **finished slices** in PRs over horizontal “half migrated” states.  
- Pair with [repo.engineering.controlled_changes.gen1.md](repo.engineering.controlled_changes.gen1.md) — TDC includes **reviewable** diffs.

---

## Cross-links

- [CHANGELOG.md](https://github.com/agentstacktech/AgentStack/tree/main/CHANGELOG.md), [RELEASE_NOTES_INDEX.md](https://github.com/agentstacktech/AgentStack/tree/main/philosophy/RELEASE_NOTES_INDEX.md)  
- [foundation.core_pillars.gen1.md](foundation.core_pillars.gen1.md)
