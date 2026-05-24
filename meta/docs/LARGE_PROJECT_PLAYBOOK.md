# Large project playbook — rolling out Navigation OS

**Why (problem + metrics):** [KILLER_FEATURE_LARGE_PROJECTS_ru.md](KILLER_FEATURE_LARGE_PROJECTS_ru.md) · [KILLER_FEATURE_LARGE_PROJECTS.md](KILLER_FEATURE_LARGE_PROJECTS.md)

**Genes:** `repo.tooling.genetic_starter.gen1` · `repo.navigation.map.gen1` · `repo.navigation.index.gen1` · `foundation.time_decomposition.gen1`

## Phase 0 — Bootstrap (day 0)

```bash
node <kit>/scripts/install.mjs --target . --profile standard --project-name "My App" --domain app --strict
```

- Lock: `.genetic-ai/kit.lock.json`
- Read [docs/ai/OPERATIONS.md](../../payload/docs/ai/OPERATIONS.md) in target repo

## Phase 1 — Tier 0 (days 1–2)

Fill `docs/ai/AI_NAVIGATION_MAP.md` package roots (`app`, `pkg`, `docs`, …).

Example row:

| Tag | Path | When |
|-----|------|------|
| `app.api.root.gen1` | `src/server.ts` | HTTP entry, not dev tools |

## Phase 2 — Tier 1 (days 3–10)

For each subsystem with **~10+ integration points**, add Tier 1 row + genetic tag.

## Phase 3 — Indexes (days 10–20)

Per subsystem owner: `AI_INDEX.md` from [template](../../payload/docs/ai/templates/AI_INDEX.template.md).

PR rule: **code + map + index** in one PR ([T05 pattern](BENEFITS_AND_METRICS.md)).

## Phase 4 — Compression (day 20)

Customize [GENE_COMPRESSION_MAP](../../payload/philosophy/genes/GENE_COMPRESSION_MAP.md) Cluster Product.

## Phase 5 — CI (ongoing)

```bash
node <kit>/scripts/doctor.mjs --target .
node <kit>/scripts/validate-installed.mjs --target .
```

Optional: `.github/workflows/genetic-ai-validate.yml.sample`

## Phase 6 — AgentStack (optional)

`--profile full` or `--with-agentstack` — [AGENTSTACK_EXTENSION.md](AGENTSTACK_EXTENSION.md)

## Monorepo

See [STACK_PROFILES.md](STACK_PROFILES.md) — domain `pkg.*` tags.

## Team rituals

- PR template: map/index updated?
- Weekly: `doctor` before release
- Reference genetic tags in PR titles
