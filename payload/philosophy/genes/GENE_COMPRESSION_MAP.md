# Gene compression map — starter clusters

**Genetic meta-tag:** `repo.evolution.compression.gen1`

---

## How to use

1. Pick the **cluster** matching your task.
2. Open the **primary** gene once for intent.
3. Open only `.gen1` files that touch your diff.

---

## Cluster Kit integration — submodule / KIP v2

| Order | Genes |
|-------|-------|
| 1 | `repo.tooling.genetic_starter.integration.gen1` |
| 2 | `repo.tooling.genetic_starter.gen1` |
| 3 | `repo.tooling.kit_vendor.gen1` (Tier 0 row → `tools/genetic-ai-starter/`) |

**Synergy:** `bootstrap-standard.mjs` → `install.mjs --record-kit-source` → `doctor` / `upgrade --sync-submodule`.

---

## Cluster Kit docs — genetic-ai-starter meta (maintainers)

| Order | Genes |
|-------|-------|
| 1 | `repo.tooling.genetic_starter.gen1` |
| 2 | `repo.tooling.genetic_starter.docs.gen1` |
| 3 | `repo.tooling.genetic_starter.benchmark.gen1` |
| 4 | `repo.tooling.genetic_starter.agent_floor.gen1` |

**Synergy:** metrics from `metrics.snapshot.json` only; platform scale from `platform-stats.snapshot.json`.

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

### T06 walkthrough (auth + OpenAPI)

1. Open this compression map — pick **Cluster DocsApi** (not 10+ separate genes).
2. `docs/ai/AI_NAVIGATION_MAP.md` — auth + `docs/api/` rows.
3. Hot files: `sessionMiddleware.ts`, `docs/api/public.md`.
4. Scoped search only if a file is still unknown.

---

## Cluster Extension-AgentStack

Only when `--with-agentstack` was used on install:

- Read `docs/ai/CONTEXT_FOR_AI.md` (or overlay path)
- Platform vs tenant canary: `.cursor/rules/platform-vs-tenant-canary.mdc`

Canonical AgentStack docs remain upstream in the monorepo.
