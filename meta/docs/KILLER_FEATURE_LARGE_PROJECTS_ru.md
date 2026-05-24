# Killer feature — крупные сложные проекты

**EN:** [KILLER_FEATURE_LARGE_PROJECTS.md](KILLER_FEATURE_LARGE_PROJECTS.md)

## Суть

Один `AGENTS.md`, только rules или только RAG **не масштабируются** на monorepo: дубликаты путей, legacy, границы пакетов.

Kit даёт **семантическую решётку**: Tier 0 → Tier 1 → `AI_INDEX.md` → hot files.

## Доказательства (harness 1.1.1)

| Задача | bare | agents_md | kit_standard | kit + indexes |
|--------|------|-----------|--------------|---------------|
| T05 docs | 4 | 6 | **10** | 4 |
| T08 catalog | 7 | 5 | 7 | **10** |
| T07 legacy | 1 | 9 | 5 | 7 |

## Дальше

[LARGE_PROJECT_PLAYBOOK.md](LARGE_PROJECT_PLAYBOOK.md) · [NAVIGATION_OS.md](NAVIGATION_OS.md)
