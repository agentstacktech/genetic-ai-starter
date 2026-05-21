---
name: index-authoring
description: Create or update AI_INDEX.md and Tier 1 map rows. Apply when adding subsystems, new entry points, or after structural refactors.
---

# Index authoring

## When to use

- New folder with ~10+ integration points or multiple entry modules.
- Moved canonical paths; legacy vs new trees coexist.
- PR adds HTTP + worker + UI for same feature.

## Checklist

1. Add genetic tag matching `docs/ai/AI_INDEXING_SYSTEM.md` §2.
2. Create `AI_INDEX.md` from `docs/ai/templates/AI_INDEX.template.md`.
3. Add Tier 1 row to `docs/ai/AI_NAVIGATION_MAP.md`.
4. Hot files: 3–8 entry points, not every file.
5. Sideways links to related indexes.

## Rule file

`.cursor/rules/genetic-index-authoring.mdc`
