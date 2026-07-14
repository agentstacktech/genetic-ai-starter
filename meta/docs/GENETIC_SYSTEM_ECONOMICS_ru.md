# Генетическая система — экономика (синтез канвасов)

**Genetic tag:** `repo.tooling.genetic_starter.economics.gen1`

Документ объединяет экономику из внутренних канвасов AgentStack и публичного [genetic-system-site](https://github.com/agentstacktech/AgentStack/tree/master/docs/genetic-system-site) (RU / EN / PT, тёмная тема). Дополняет [VALUE_AND_ROI_BY_PROJECT_SIZE_ru.md](VALUE_AND_ROI_BY_PROJECT_SIZE_ru.md), [TOKEN_ECONOMICS_ru.md](TOKEN_ECONOMICS_ru.md) и [DOC_CLAIMS_AUDIT.md](DOC_CLAIMS_AUDIT.md).

**Главный ROI — календарь инженеров**, а не KPI по токенам. Экономия токенов появляется, когда префикс map → index стабилен и срабатывает prompt caching.

---

## Две линии затрат

| Линия | За что платите | Рычаг Navigation OS |
|-------|----------------|---------------------|
| **Труд** | Время, переделки, онбординг | Меньше правок не в том дереве; общие genetic tags |
| **Токены** | API за ход агента | Короче контекст; меньше слепого grep |

---

## Измеренные и модельные цифры

| Метрика | Значение | Источник | Область |
|---------|----------|----------|---------|
| Сжатие philosophy | **12,36×** (103222 → 8350 tok) | `bench_gene_access.json` | Доступ к генам — не весь репо |
| Harness weak → kit+idx | **2,5 / 0%** → **9 / 100%** | [metrics.snapshot.json](metrics.snapshot.json) | Синтетика shop-api |
| Точка окупаемости | ~**17** касаний | Канвас release economics | Порядок величины |
| FTE-неделя (модель) | ~**$3500** | Канвас release economics | Ввод для планирования |
| Monte Carlo P(save>0) | **1,0** | `monte_carlo_release_cost.json` | Симуляция с джиттером |
| EST nav failure | **22% → 5%** | Gene harness EST | Внутренняя оценка платформы |
| EST token factor | **0,62** | Gene harness EST | Путь discovery |
| EST retry factor | **0,85** | Gene harness EST | После indexed nav |

Инвентарь платформы (июль 2026) — **SoT:** [platform-stats.snapshot.json](platform-stats.snapshot.json) после `node scripts/export-platform-stats.mjs`:

| Счётчик | Поле | Значение |
|---------|------|----------|
| Гены | `philosophyGenes` | **406** |
| Indexes (репо) | `aiIndexFilesRepoTotal` | **186** |
| Indexes (платформа) | `aiIndexFilesPlatform` | **162** |
| Tier-1 tags | `navigationMapTier1Tags` | **421** |
| Payload genes кита | `kitPayloadGenes` | **27** |

Cross-cluster SYN **~16** и сжатие philosophy **12,36×** — из genetic-system-site / `bench_gene_access.json`, не из этого snapshot. Не смешивайте harness (`metrics.snapshot.json`) с инвентарём.

---

## Архетипы релиза (недели — ориентир)

Из канваса `agentstack-genes-release-economics`. Точные недели — [ROI_PLAYBOOK_ru.md](ROI_PLAYBOOK_ru.md).

| Архетип | Форма | Зачем Navigation OS |
|---------|-------|---------------------|
| **A** | Greenfield на AgentStack + kit | Map + SDK; максимальный календарный эффект |
| **B** | Фича в brownfield (500–2k файлов) | Срезает discovery tax на каждой задаче |
| **C** | Крупный монорепо (5k+ файлов) | Слепой grep ломается — [KILLER_FEATURE_LARGE_PROJECTS_ru.md](KILLER_FEATURE_LARGE_PROJECTS_ru.md) |
| **D** | Только SDK | SDK экономит недели сборки; map — недели поиска |
| **E** | Доки / ops / KB | Тот же инвариант вне кода |

---

## Рычаг SDK платформы (недели не пересобираем)

Из канваса `agentstack-platform-sdk-leverage` — типичная экономия при хостинге на AgentStack:

| Поверхность | Ориентир | Заметки |
|-------------|----------|---------|
| Auth + сессии | 2–4 нед | Scope проекта, JWT |
| Платежи / кошелёк | 2–5 нед | agUSD, MCP commerce |
| 8DNA | 1–3 нед | Генетические записи vs ad-hoc |
| MCP `agentstack.execute` | 1–2 нед | Каталог vs свои интеграции |
| Dual-shell SPA | 3–6 нед | Аудитории, nav, pages map |
| RAG / neural cache | 1–3 нед | Субстрат платформы |

Navigation OS сверху: SDK убирает **недели сборки**; map — **недели wrong-tree** в вашем коде.

---

## Агенты в 2026 — почему адреса лучше «забить контекст»

| Сигнал | Вывод для кита |
|--------|----------------|
| **Context rot** (Chroma 2026) | Точность падает с ростом контекста — 2 hot file через index |
| **Prompt caching** (2026) | Стабильный map→index кэшируется; grep — нет |
| **METR TH1.1** (июль 2026) | Горизонт автономии ~×2 каждые 89 дней — ошибки накапливаются |
| **Мульти-агент** | Общие tags — одно каноническое дерево |

Интерактив: [genetic-system-site](https://github.com/agentstacktech/AgentStack/tree/master/docs/genetic-system-site).

---

## Gene navigation vs neural runtime

| Контур | Роль |
|--------|------|
| **Gene navigation** | Map, tags, indexes — куда править |
| **Neural runtime** | Латентность продукта, кэш, organism |

Экономика здесь — **discovery tax и переделки**, не «нейромагия».

---

## Чего мы не обещаем

- Теги не заменяют тесты, ревью и security.
- **12,36×** — сжатие доступа к philosophy, не «в 12 раз быстрее релиз».
- Harness **100%** — регрессионная фикстура; после init запустите `npm run harness`.
- Недели — модели; сверяйте с [DOC_CLAIMS_AUDIT.md](DOC_CLAIMS_AUDIT.md).

---

## См. также

| Документ | Тема |
|----------|------|
| [NAVIGATION_OS.md](NAVIGATION_OS.md) | Инвариант workflow |
| [VALUE_AND_ROI_BY_PROJECT_SIZE_ru.md](VALUE_AND_ROI_BY_PROJECT_SIZE_ru.md) | $ по размеру команды |
| [TOKEN_ECONOMICS_ru.md](TOKEN_ECONOMICS_ru.md) | Линия токенов |
| [GENETIC_SYSTEM_ECONOMICS.md](GENETIC_SYSTEM_ECONOMICS.md) | English version |
| Публичное зеркало | [agentstack_repo genetic-system](https://github.com/agentstacktech/agentstack_repo/tree/main/docs/genetic-system) |
