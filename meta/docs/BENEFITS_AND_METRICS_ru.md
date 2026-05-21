# Польза и замеры — что даёт kit

**Бенчмарк:** [`benchmarks/`](../../benchmarks/) · `shop-api` (11 задач) + smoke AgentStack (4 задачи) · профиль **standard** · [run-meta.json](../../benchmarks/results/run-meta.json).

---

## Сводка vs bare

| Метрика | bare | AGENTS.md | **kit standard** | kit + индексы |
|---------|------|-----------|------------------|---------------|
| Медиана (0–10) | 6 | 8 | **8** | 7 |
| Успех ≥6 | 64% | 91% | **91%** | 82% |
| Map-first | 0% | 64% | **36%** | **73%** |
| Нецелевой grep (11 задач) | **13** | 0 | **1** | **0** |

**Главное:** **−12** слепых grep · **+2** к медиане · T04 **2→8** · T05 **5→10**.

EN: [BENEFITS_AND_METRICS.md](BENEFITS_AND_METRICS.md) · [RESULTS.md](../../benchmarks/results/RESULTS.md).

---

## Все задачи shop-api (кратко)

| Задача | Суть | bare | kit |
|--------|------|------|-----|
| T01 | Production entry, не dev | 5 | **8** |
| T02 | Где JWT? | 6 | **7** (+ индексы лучше) |
| T03 | Webhook + HTTP client | 6 | **6** (оба файла, меньше grep) |
| T04 | sed по всему src | **2** | **8** |
| T05 | Новый billing/ — что в docs? | **5** | **10** |
| T06 | Auth + OpenAPI — с чего начать | 6 | **7** |
| T07 | Checkout (ловушка legacy) | **1** | **5–7** |
| T08 | Баг фильтра каталога | 7 | **7–10** |
| T09–T11 | explain / patch / docs | 8 | 8 |

Smoke **S01–S04** на монорепо AgentStack: map-first на MCP cache (**S01**), отказ от массового rename UI (**S03**), чеклист PAGES_MAP при новом route (**S04**).

---

## Реальные сценарии

### Новый продукт

`init --profile standard` → карта Tier 0/1 → агент находит auth/webhooks без grep по всему дереву → `doctor` перед PR.

### Команда

Онбординг: AGENTS.md + карта → первый день без «где что лежит». T05: новый модуль = PR обновляет map и index.

### Приватный AI-контекст

`--gitignore-kit full` — philosophy и карта локально, в git не уходят; польза та же.

### AgentStack

`full` / `founder` + extension — маршрутизация MCP/8DNA; smoke-задачи на PAGES_MAP и discovery cache.

---

## Слои установки

| Слой | Польза |
|------|--------|
| AGENTS.md | Порядок чтения для агента |
| Карта + genetic tags | T01, T07 — не попасть в decoy |
| AI_INDEX | T08: 7 → 10 |
| Genes + rules | T04 отказ от массовых правок |
| doctor / upgrade | Не сломать install при апгрейде |

[PROFILE_COMPARISON.md](PROFILE_COMPARISON.md) · [ROI_PLAYBOOK.md](ROI_PLAYBOOK.md)
