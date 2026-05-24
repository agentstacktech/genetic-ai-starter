# Глоссарий метрик — benchmark harness

**EN:** [METRICS_GLOSSARY.md](METRICS_GLOSSARY.md)

**SoT:** [metrics.snapshot.json](metrics.snapshot.json) · [ANALYSIS.md](../../benchmarks/results/ANALYSIS.md) · scorer **1.2.1**

---

## Шкала балла (0–10)

За задачу суммируются измерения рубрики (макс. 10). **Успех** = ≥ 6.

| Измерение | Смысл |
|-----------|--------|
| correct_file | Gold-файлы, не legacy |
| navigation_path | map/index/gene до grep |
| scope_discipline | Без repo-wide blind grep |
| outcome | Цель задачи / отказ |
| efficiency | Меньше tool-hop |

## Arms (не путать с install profiles)

| Arm | Что это |
|-----|---------|
| `agents_md` | AGENTS.only + **optimistic** transcript |
| `agents_md_weak` | Тот же файл + pessimistic transcript |
| `kit_standard` | standard install на fixture |
| `kit_standard_indexed` | + prefilled AI_INDEX |

## Поднятие пола (weak agent)

`agents_md_weak`: median **2.5**, success **0%** → `kit_standard_indexed`: **9**, **100%**. Narrative: [AGENT_FLOOR_ru.md](AGENT_FLOOR_ru.md).

## Парадокс: медиана ≠ success rate

`generic_cursorrules` может дать медиану **8** при success **64%** — много задач на пороге 6–7. Не используйте этот arm как headline «почти как kit».

## Ограничения

Synthetic harness — не live Cursor. См. [DOC_CLAIMS_AUDIT.md](DOC_CLAIMS_AUDIT.md).
