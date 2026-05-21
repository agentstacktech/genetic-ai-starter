---
name: bootstrap-subsystem
description: Bootstrap genetic navigation for a new subsystem in 15 minutes — index, map row, optional domain gene.
---

# Bootstrap subsystem

## Inputs

- Subsystem path (e.g. `src/billing/`)
- Short name for genetic tag (`billing`)

## Steps

1. **Tag:** `{{DOMAIN}}.billing.<role>.gen1` — confirm domain in `docs/ai/CUSTOMIZE_DOMAIN.md`.
2. **Index:** copy `docs/ai/templates/AI_INDEX.template.md` → `src/billing/AI_INDEX.md`.
3. **Map:** add Tier 1 row in `docs/ai/AI_NAVIGATION_MAP.md`.
4. **Gene (optional):** copy `philosophy/genes/templates/subsystem.feature.gen1.md` if boundary needs axioms.
5. **Validate:** run project's `validate-installed` if kit scripts are available.

## Done when

An agent can find the subsystem via map → index without grep.
