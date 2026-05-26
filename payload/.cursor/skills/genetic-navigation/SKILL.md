---
name: genetic-navigation
description: Use the AI navigation map and indexes before repo-wide search. Apply when exploring code, finding entry points, or working in large subsystems.
---

# Genetic navigation

## When to use

- Task touches a subsystem with multiple files or integration surfaces.
- User asks "where is X implemented?" without a file path.
- You are about to run unscoped ripgrep on `src/` or the whole repo.

## Steps

1. Read `AGENTS.md` (30s).
2. Open `philosophy/genes/foundation.core_pillars.gen1.md` when choosing architecture (creation vs second path).
3. Open `docs/ai/AI_NAVIGATION_MAP.md` — pick Tier 0 or Tier 1 row (**genetic map-first**, not README alone).
4. Open linked `AI_INDEX.md` if present (summary of subtree — hot files only).
5. Open **1–2 hot files** only.
6. Search in **that directory** or for a known symbol.

## Do not

- Skip the map for "quick" fixes in large areas.
- Open 10+ files before reading the index.

## References

- `docs/ai/AI_INDEXING_SYSTEM.md`
- `philosophy/genes/foundation.core_pillars.gen1.md`
- `philosophy/genes/foundation.genetic_coding.gen1.md`
- `philosophy/archive/FOUNDATION_HERITAGE_READING.md`
