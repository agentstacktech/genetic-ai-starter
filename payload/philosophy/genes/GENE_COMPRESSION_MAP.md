# Gene compression map — starter clusters

**Genetic meta-tag:** `repo.evolution.compression.gen1`

---

## How to use

1. Pick the **cluster** matching your task.
2. Open the **primary** gene once for intent.
3. Open only `.gen1` files that touch your diff.

---

## Cluster Nav — Map, indexes, tags

| Order | Genes |
|-------|-------|
| 1 | `foundation.genetic_coding.gen1` |
| 2 | `repo.navigation.map.gen1` |
| 3 | `repo.navigation.index.gen1` |

**Synergy:** Map row ↔ `AI_INDEX.md` ↔ genetic tag must stay aligned.

---

## Cluster Engineering — How we change code

| Order | Genes |
|-------|-------|
| 1 | `repo.engineering.controlled_changes.gen1` |
| 2 | `repo.engineering.testing.gen1` |
| 3 | `repo.engineering.adr.gen1` |

**Synergy:** ADR before large refactors; tests at boundaries.

---

## Cluster Product — Domain-specific (fill in)

| Order | Genes |
|-------|-------|
| 1 | `{{DOMAIN}}.project.seed.gen1` *(from template)* |
| 2 | `{{DOMAIN}}.*.feature.gen1` per subsystem |

---

## Cluster Frontend — UI (generic)

| Order | Genes |
|-------|-------|
| 1 | `foundation.core_pillars.gen1` (Minimalism) |
| 2 | Local `AI_INDEX.md` under `src/` or `apps/` |

_Add React Query / state-management gene here when you create one._

---

## Cluster DocsApi — Auth + public HTTP docs

| Order | Genes |
|-------|-------|
| 1 | `repo.navigation.map.gen1` |
| 2 | `repo.engineering.adr.gen1` *(if contract change)* |
| 3 | Subsystem `AI_INDEX.md` for auth + `docs/api/` or OpenAPI path |

**Synergy:** Map Tier 1 rows for auth and API docs before opening many gene files.

---

## Cluster Extension-AgentStack

Only when `--with-agentstack` was used on install:

- Read `docs/ai/CONTEXT_FOR_AI.md` (or overlay path)
- Platform vs tenant canary: `.cursor/rules/platform-vs-tenant-canary.mdc`

Canonical AgentStack docs remain upstream in the monorepo.
