---
name: gene-first-debug
description: Route bugfixes through engineering gene cluster, navigation map, and hot files before repo-wide search.
---

# Gene-first debug

## When to use

Bugfix or incident in a **non-trivial** area (multi-file subsystem).

## Steps

1. [GENE_COMPRESSION_MAP.md](../../../philosophy/genes/GENE_COMPRESSION_MAP.md) — **Cluster Engineering**.
2. [repo.engineering.controlled_changes.gen1](../../../philosophy/genes/repo.engineering.controlled_changes.gen1.md) — no throwaway bulk patches.
3. [AI_NAVIGATION_MAP.md](../../../docs/ai/AI_NAVIGATION_MAP.md) → nearest [AI_INDEX.md](../../../docs/ai/templates/AI_INDEX.template.md).
4. Open 1–2 hot files; then scoped grep.

## Do not

- Start with repo-wide `grep` when map/index exists.
- Open more than 3 gene files before reading the map.
