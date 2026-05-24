# Реальная польза Genetic AI Starter Kit

**Замеры:** [BENEFITS_AND_METRICS_ru.md](BENEFITS_AND_METRICS_ru.md) · [METRICS_GLOSSARY.md](METRICS_GLOSSARY.md) · **Архитектура:** [NAVIGATION_OS.md](NAVIGATION_OS.md)

---

## 1. Крупные и сложные проекты (killer feature)

### Проблема без kit

В monorepo на десятки пакетов агент (и человек) сталкиваются с:

- **Дубликатами смысла** — `auth/` в трёх местах, legacy рядом с canonical.
- **Нет единого адреса** — задача «где checkout?» → grep находит `oldCheckout.ts`.
- **Контекст не масштабируется** — один `AGENTS.md` на 500k строк не помещается в окно и устаревает.

### Что даёт Navigation OS

| Механизм | Эффект в работе |
|----------|-----------------|
| **Tier 0** — корни пакетов | «С какого дерева начать» за 30 секунд |
| **Tier 1** — подсистемы + genetic tag | PR и чат ссылаются на `app.billing.invoices.gen1`, а не на путь из головы |
| **AI_INDEX.md** — hot files | Агент открывает 1–2 файла, не 40 кандидатов |
| **GENE_COMPRESSION_MAP** | Не читать 17 gene-файлов подряд на одну задачу |
| **doctor / validate** | Карта не отрывается от репозитория перед merge |

### На практике (AgentStack и потребители)

- Smoke **S04:** новый route → обязательны `PAGES_MAP.md` + `App.tsx` — без карты агент обновит только код.
- **S01:** инвалидация MCP cache → путь через `core.mcp` в карте, не grep по всему `agentstack-core/`.
- Любой продукт на **standard + индексы:** онбординг = «открой карту Tier 1», а не тур по `src/`.

Подробно (проблема лавины дублирования, модель риска, harness): [KILLER_FEATURE_LARGE_PROJECTS_ru.md](KILLER_FEATURE_LARGE_PROJECTS_ru.md) · внедрение: [LARGE_PROJECT_PLAYBOOK.md](LARGE_PROJECT_PLAYBOOK.md).

---

## 2. Экономия токенов

### Почему grep дорого

Каждый repo-wide `rg` тянет большие срезы контекста. На задаче T03 bare делает **4 нецелевых grep**; kit — **0–1** scoped hop.

### Стабильный маршрут kit

```
AGENTS.md (короткий) → строка в AI_NAVIGATION_MAP → AI_INDEX (опционально) → 1–2 файла
```

Оценка порядка величины (shop-api, см. [TOKEN_ECONOMICS_ru.md](TOKEN_ECONOMICS_ru.md)):

| Сценарий | Путь | Токены (оценка) |
|----------|------|-----------------|
| JWT где? | bare: 4× grep | ~32k |
| JWT где? | kit: map + auth | ~6k |
| Multi-gene | все philosophy | высоко |
| Multi-gene | compression map → 3 genes | **~−70% prose** |

### Индексы и токены

**Токены (модель 1.2.1):** [TOKEN_ECONOMICS_ru.md](TOKEN_ECONOMICS_ru.md) · [TOKEN_REPORT.md](../../benchmarks/results/TOKEN_REPORT.md). На discovery **~2.5–3×** меньше контекста vs bare на shop-api; карта и +индексы — близкие медианы.

**Важно:** смотрите unscoped grep и task-level TOKEN_REPORT, не одну медиану.

---

## 3. Поднятие пола: слабый агент ≈ стабильный процесс сильной модели

На **repo-bound** задачах kit снимает зависимость от «удачного чата» и дорогой модели:

| Паттерн | Без Navigation OS | С kit + индексами |
|---------|-------------------|-------------------|
| Медиана / успех (harness) | weak arm: **2.5** / **0%** | **9** / **100%** |
| T05 новый модуль | **4** | **10** |
| T13 release gate | **4** (weak) | **10** |

Это не «mini = Opus на всём», а **рельсы в git**: карта → index → genes → doctor. Разбор границ и сравнение с топ-моделью без карты: [AGENT_FLOOR_ru.md](AGENT_FLOOR_ru.md).

---

## 4. Качество результата

| Измерение | bare / AGENTS weak | kit standard | kit + индексы |
|-----------|-------------------|--------------|---------------|
| Правильный файл с первого захода | часто нет (T01, T07) | чаще (карта) | **чаще всего** (index → file) |
| Оба файла в связке (T03) | с grep-шумом | да | да, без лишних hop |
| Отказ от опасной команды (T04) | нет | **да** | **да** |
| Обновление docs при новом модуле (T05) | слабо | **10/10** | **10/10** (после fix harness) |
| Scoped search (T08) | repo-wide | catalog/ из map | **index → file** |

**Итог:** качество = меньше wrong-file diff + меньше «забыли обновить карту» + предсказуемый процесс в PR.

---

## 5. Меньше ошибок и промахов

| Тип промаха | Gene / артефакт | Задача harness |
|-------------|-----------------|----------------|
| Массовый sed / скрипт по дереву | `repo.engineering.controlled_changes` + rule | T04 |
| Legacy decoy | map + index warning | T07 |
| Забыли AI-навигацию | `repo.navigation.index` + skill | T05 |
| Открыли 10+ genes | `GENE_COMPRESSION_MAP` | T06 |
| Слепой grep в indexed зоне | `genetic-navigation` rule | T02, T08 |

**Память в git:** правила и genes ревьюятся в PR; chat memory — нет.

См. [GENE_ADAPTATION_ru.md](GENE_ADAPTATION_ru.md).

---

## 6. Слой «+ индексы» (дополнение к standard)

Индексы — **не замена** карте, а hot-file таблица на подсистему (T02, T08, T12, T14 в harness).

| Метрика (14 задач, synthetic) | kit + индексы (типично) |
|------------------------------|-------------------------|
| Медиана балла | **9** (см. snapshot) |
| Success rate | **100%** |
| Map-first (genetic) | **~86%** |
| Unscoped grep | **0** |

Токены: см. [TOKEN_REPORT.md](../../benchmarks/results/TOKEN_REPORT.md) — сравнивайте **vs bare**, не «индексы vs карта» как соревнование.

### Когда добавлять AI_INDEX

- Подсистема с **~10+** точками интеграции.
- Повторяющийся discovery cost (агенты часто ищут одни и те же файлы).

### Релиз с ИИ

→ [AI_RELEASE_AUTONOMY_ru.md](AI_RELEASE_AUTONOMY_ru.md) (T13: map + index + doctor + validate).

---

## 7. Что делать после install

1. `standard` → заполнить Tier 0–1 за 1–2 дня.
2. На каждую крупную подсистему → `AI_INDEX.md` в том же PR, что код.
3. `doctor` перед merge.
4. В чате с агентом: «сначала карта, потом index» — [AGENTS.md](../payload/AGENTS.md) в проекте.

## Genes

- `repo.tooling.genetic_starter.gen1` · `repo.navigation.index.gen1` · `foundation.ai_gene_interface.gen1`
