# Польза и замеры — что даёт kit

**Бенчмарк:** `[benchmarks/](../../benchmarks/)` · `shop-api` (**14** задач T01–T14) · scorer **1.2.1** · [run-meta.json](../../benchmarks/results/run-meta.json)

**Токены:** [TOKEN_ECONOMICS_ru.md](TOKEN_ECONOMICS_ru.md) · [TOKEN_REPORT.md](../../benchmarks/results/TOKEN_REPORT.md)

**Реальная польза:** [REAL_BENEFITS_ru.md](REAL_BENEFITS_ru.md) · **релиз с ИИ:** [AI_RELEASE_AUTONOMY_ru.md](AI_RELEASE_AUTONOMY_ru.md) · **слабый агент / пол:** [AGENT_FLOOR_ru.md](AGENT_FLOOR_ru.md)

```bash
node benchmarks/scripts/run-matrix.mjs && node scripts/export-metrics-snapshot.mjs
```

---

## Что значит «медиана балла» (0–10)

За **каждую** из 14 задач scorer суммирует рубрику (макс. 10): правильные файлы, путь навигации, дисциплина scope, результат, эффективность. **Успех** = балл ≥ 6. **Медиана** — середина по 14 задачам; одна проваленная discovery может не сдвинуть медиану сильно — смотрите **% успеха**, **map-first (genetic)** и таблицу задач ниже. Расшифровка: [METRICS_GLOSSARY.md](METRICS_GLOSSARY.md).

**Про колонку `agents_md` (медиана 8):** это benchmark-arm с **оптимистичным** синтетическим транскриптом, не «один AGENTS.md в проде». Genetic map-first у arm всего **7%**; пессимистичный `agents_md_weak` — медиана **2.5**.

---

## Сводка vs bare (основное сравнение)


| Метрика                                   | bare       | agents_md * | agents_md_weak | **kit (карта)** | **kit + индексы** |
| ----------------------------------------- | ---------- | ----------- | -------------- | --------------- | ----------------- |
| Медиана балла задачи                      | 5.5        | 7           | 2.5            | **8**           | **9**             |
| Успех задач (≥6)                          | 50%        | 86%         | 0%             | 93%             | **100%**          |
| Map-first **(genetic)**                   | 0%         | 7%          | 0%             | 50%             | **86%**           |
| Нецелевой grep (14 задач)                 | **18**     | 0           | 16             | **1**           | **0**             |
| Медиана контекст-токенов (step **1.2.1**) | **~2 265** | ~2 242      | ~1 748         | **~1 051**      | **~1 125**        |
| Медиана токенов (discovery-only)          | **~2 985** | —           | —              | —               | **~1 125**        |


 `agents_md` — optimistic arm, см. выше.

Цифры синхронизируются с `meta/docs/metrics.snapshot.json` после `run-matrix`. **Не сравниваем** «карту» и «+ индексы» как соперников — индексы **дополняют** standard там, где есть крупные подсистемы.

**Главные дельты vs bare (задачи):**


| Задача | Суть                            | bare  | kit + индексы (типично) |
| ------ | ------------------------------- | ----- | ----------------------- |
| T04    | sed по всему src                | 2     | **8**                   |
| T05    | новый модуль → навигация        | 4     | **10**                  |
| T07    | legacy decoy                    | 1     | **7+**                  |
| T08    | баг каталога                    | 7     | **10**                  |
| T12    | delivery + signing              | низко | **8+**                  |
| T13    | release gate (map/index/doctor) | низко | **10**                  |


[METRICS_GLOSSARY.md](METRICS_GLOSSARY.md) · EN: [BENEFITS_AND_METRICS.md](BENEFITS_AND_METRICS.md)

---

## Модель контекст-токенов

Step-модель **1.2.1** (`benchmarks/scripts/lib/token-model.mjs`): чтения по размеру fixture, grep-пул от объёма репо (~**1.15k**/строку `rg` на shop-api). Подробно: [TOKEN_ECONOMICS_ru.md](TOKEN_ECONOMICS_ru.md).

**Экономия vs bare:** медиана всех задач **~2.3k → ~1.1k**; на discovery **~3.0k → ~1.1k** (~**2.5–3×**). Медианы карты и +индексов близки.

**Малый проект:** 8 задач/неделю → **~9k** model-tokens/неделю меньше vs bare — [TOKEN_REPORT.md](../../benchmarks/results/TOKEN_REPORT.md).

---

## Слои kit (standard → + индексы)


| Слой                  | Что даёт                                                     |
| --------------------- | ------------------------------------------------------------ |
| **standard**          | `AI_NAVIGATION_MAP`, genes, rules, AGENTS — маршрут Tier 0/1 |
| **+ AI_INDEX**        | hot files на подсистему — меньше hop на T02/T08/T12/T14      |
| **doctor / validate** | T13 release gate — карта не отрывается от репо               |


Профиль установки: [PROFILE_COMPARISON.md](PROFILE_COMPARISON.md).

---

## Killer feature — большие и сложные проекты

Navigation OS масштабируется, когда flat `AGENTS.md` не помещается в контекст и устаревает.

→ [KILLER_FEATURE_LARGE_PROJECTS_ru.md](KILLER_FEATURE_LARGE_PROJECTS_ru.md) · [LARGE_PROJECT_PLAYBOOK.md](LARGE_PROJECT_PLAYBOOK.md)

---

## Меньше ошибок


| Риск                        | Gene / артефакт                       |
| --------------------------- | ------------------------------------- |
| Массовый sed                | `repo.engineering.controlled_changes` |
| Legacy decoy                | map + index warning                   |
| Забыли навигацию при релизе | T13 + `doctor`                        |
| Gene sprawl                 | `GENE_COMPRESSION_MAP`                |


→ [GENE_ADAPTATION_ru.md](GENE_ADAPTATION_ru.md)

---

## Все задачи shop-api (T01–T14)

Полная таблица баллов — в [benchmarks/results/ANALYSIS.md](../../benchmarks/results/ANALYSIS.md) после `run-matrix`.

Smoke **S01–S04** (AgentStack): MCP cache, fleet endpoints, отказ bulk rename, PAGES_MAP.

---

## Реальные сценарии


| Сценарий      | Действие                                                                      |
| ------------- | ----------------------------------------------------------------------------- |
| Новый продукт | `standard` → Tier 0/1 → при росте **AI_INDEX** на подсистему                  |
| Релиз с ИИ    | genes + map + doctor — [AI_RELEASE_AUTONOMY_ru.md](AI_RELEASE_AUTONOMY_ru.md) |
| Monorepo      | индексы на зоны с ~10+ интеграциями                                           |


[PROFILE_COMPARISON.md](PROFILE_COMPARISON.md) · [ROI_PLAYBOOK.md](ROI_PLAYBOOK.md) · [DOC_HUB.md](DOC_HUB.md)