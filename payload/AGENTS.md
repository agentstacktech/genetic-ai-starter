# AGENTS.md — {{PROJECT_NAME}}

**Genetic AI Starter Kit** · platform **`{{AGENTSTACK_VERSION}}`** (`AGENTSTACK_CORE_VERSION`) · Entry point for Cursor and other coding agents.

---

## Read order (mandatory for non-trivial tasks)

1. **This file** — lookup order (30 seconds).
2. `.cursor/rules/genetic-navigation.mdc` — alwaysApply workflow.
3. `docs/ai/AI_NAVIGATION_MAP.md` — Tier 0 / Tier 1 registry.
4. `philosophy/genes/GENE_COMPRESSION_MAP.md` — if task spans multiple subsystems.
5. Nearest `**/AI_INDEX.md` — hot files only, then scoped search.

---

## Tier 0 (quick links)

| Tag | Where |
|-----|-------|
| Philosophy | [philosophy/PHILOSOPHY_INDEX.md](philosophy/PHILOSOPHY_INDEX.md) |
| Controlled edits | [philosophy/genes/repo.engineering.controlled_changes.gen1.md](philosophy/genes/repo.engineering.controlled_changes.gen1.md) |
| Navigation map | [docs/ai/AI_NAVIGATION_MAP.md](docs/ai/AI_NAVIGATION_MAP.md) |
| App source | `src/` (adjust in map) |

---

## Rules precedence

1. User instructions (chat)
2. Project `.cursor/rules/*.mdc`
3. `.cursorrules` (including `<!-- genetic-ai:begin/end -->` block)
4. This file and philosophy genes

---

## Error prevention (genes)

| Situation | Gene |
|-----------|------|
| Bulk sed / tree rewrite | [repo.engineering.controlled_changes.gen1](philosophy/genes/repo.engineering.controlled_changes.gen1.md) |
| New subsystem / docs drift | [repo.navigation.index.gen1](philosophy/genes/repo.navigation.index.gen1.md) |
| Multi-subsystem task | [GENE_COMPRESSION_MAP.md](philosophy/genes/GENE_COMPRESSION_MAP.md) first |
| Architecture trade-off | [repo.engineering.adr.gen1](philosophy/genes/repo.engineering.adr.gen1.md) |

## Large subsystems

If **~10+ integration points** or repeated discovery cost — mandatory map Tier 1 + `AI_INDEX.md` before repo-wide grep (`repo.navigation.index.gen1`).

## Do not

- Repo-wide blind grep before map/index when the area is indexed.
- Bulk tree rewrites via throwaway scripts (`repo.engineering.controlled_changes.gen1`).
- Cite obsolete `*.gen2` AgentStack-only gene examples.
- Put marketing benchmark scores in this file — see kit `meta/docs/METRICS_GLOSSARY.md`.

---

## Kit metadata

Installed via **genetic-ai-starter** (tracks AgentStack platform version). Lock file: `.genetic-ai/kit.lock.json`.

**Repair / upgrade / health:** [docs/ai/OPERATIONS.md](docs/ai/OPERATIONS.md)
