# Ценность и ROI по размеру проекта — Genetic AI Starter Kit

**Genetic tag:** `repo.tooling.genetic_starter.gen1`  
**EN:** [VALUE_AND_ROI_BY_PROJECT_SIZE.md](VALUE_AND_ROI_BY_PROJECT_SIZE.md)  
**Доказательная база:** [DOC_CLAIMS_AUDIT.md](DOC_CLAIMS_AUDIT.md) · harness [metrics.snapshot.json](metrics.snapshot.json)

Здесь — **оценка денег и времени на реальных проектах**, не только «меньше токенов». Суммы в долларах — **прозрачная модель** из типовых сбоев; подставьте свою ставку и регион.

---

## Что вы получаете (одной фразой)

**Navigation OS в git:** карта → индекс → hot files → doctor — меньше налога на переделки из-за wrong-file PR, забытых docs и дублирующих подсистем.

---

## Допущения (меняйте в своей таблице)

| Параметр | По умолчанию | Комментарий |
|----------|--------------|-------------|
| Ставка разработчика (blended) | **$85/ч** | Mid US/EU remote; для РФ/СНГ умножьте на свой курс × локальную ставку |
| Доля работы с ИИ-агентом | **30%** времени инженерии | Cursor: фичи, баги, рефакторинг |
| Установка kit (разово) | **3 ч** | `init` + Tier 0/1 + первый `doctor` |
| Поддержка kit | **1.5 ч/мес** | Обновление карты/индексов (частично вместо хаотичных README) |
| Harness | shop-api, scorer **1.2.1**, 14 задач | Механизм — [BENEFITS_AND_METRICS_ru.md](BENEFITS_AND_METRICS_ru.md) |

**Лицензия kit:** $0 (Apache-2.0). Cursor / AgentStack platform — отдельно.

**Для РФ:** при ставке **3 500 ₽/ч** (~$38) умножьте столбец «$» на **0.45** — порядок выгоды сохраняется; абсолютные цифры ниже.

---

## Сбои → часы → деньги

| Сбой | Без kit | С kit | Задача harness |
|------|---------|-------|----------------|
| Не тот файл / legacy decoy | 1.5–4 ч переделка | Карта → index → 1–2 файла | T07, T08 |
| `sed` по всему `src/` | 2–8 ч откат | Gene + rule отказ | T04 |
| Новый модуль без карты | 1–3 ч второй PR | Tier 1 + index в том же PR | T05 |
| Релиз без навигации | 2–6 ч hotfix | T13: doctor + validate | T13 |
| Онбординг | 2–5 дней «как у нас принято» | 0.5–1 день map-first | — |
| Дубль подсистемы (крупный репо) | **недели** долга | Один genetic tag на смысл | [KILLER_FEATURE_LARGE_PROJECTS_ru.md](KILLER_FEATURE_LARGE_PROJECTS_ru.md) |
| Drift AgentStack (MCP/SDK) | 4–12 ч за спринт | Recipes + capability contract | `agentstack-app` |

---

## Модель экономии в месяц по размеру

**Источник правды:** `node scripts/calculate-roi.mjs` → [roi-model.snapshot.json](roi-model.snapshot.json).  
**Формула (в месяц):**  
`(инциденты × часы) + release_gate + (онбординг_квартал ÷ 3) − поддержка`  
*(доп. tier AgentStack не вычитает поддержку повторно — стекируется на базовый профиль.)*

| Профиль | Команда | Install | **$/мес** | **$/год** |
|---------|---------|---------|----------|----------|
| **Соло / микро** | 1 | `standard` | **~$340** | **~$4.1k** |
| **Малый продукт** | 2–5 | `standard` | **~$1 050** | **~$12.6k** |
| **Средний** | 6–15 | `standard` + индексы | **~$2 170** | **~$26k** |
| **Крупный** | 15+ | + playbook | **~$4 080** | **~$49k** |
| **AgentStack (доп.)** | к малому | **`agentstack-app`** | **~$1 400** | **~$17k** |
| **AgentStack итого** | малый + платформа | **`agentstack-app`** | **~$2 450** | **~$29k** |

### Пример расчёта (малая команда)

```
Инциденты:  4/мес × 2.75ч = 11.0ч
Релиз:      1.5ч/мес
Онбординг:  4ч/квартал → 1.33ч/мес
Итого:      13.83ч − 1.5ч поддержка = 12.33ч
→ 12.33ч × $85/ч ≈ $1 048/мес (в таблицах ~$1 050)
```

Все tier: `node scripts/calculate-roi.mjs`

### Как читать

- **Соло:** окупаемость install **&lt; недели**; главное — стабильный пол для дешёвых моделей ([AGENT_FLOOR_ru.md](AGENT_FLOOR_ru.md)).
- **Малый:** один сорванный PR из-за grep ≈ **$170–340**; kit + индексы: успех harness **93% → 100%**.
- **Средний:** новый разработчик −**~16 ч** discovery в первом квартале.
- **Крупный:** один не пойманный дубль auth/checkout — **$15k–40k** риска (вне месячной таблицы).
- **AgentStack:** первый успешный SDK-вызов за **один recipe** — см. [AGENTSTACK_APP_GUIDE_ru.md](AGENTSTACK_APP_GUIDE_ru.md).

---

## Kit vs альтернативы (деньги)

| Подход | Setup | Поддержка | Wrong-file | Масштаб &gt;50k LOC |
|--------|-------|-----------|------------|---------------------|
| Только README | 0 | гниёт | Высокий | Плохо |
| Один `AGENTS.md` без карты | 2 ч | переписывание | Средне-высокий | Плохо (**0%** success weak arm) |
| Правила с cursor.directory | 1 ч | нет связи с картой | Средний | Плохо |
| **`standard`** | 3 ч | ~1.5 ч/мес | Низкий | Хорошо с индексами |
| **`agentstack-app`** | 4 ч | +snapshot при bump платформы | Низкий + **нет MCP drift** | Лучший для платформы |

---

## Профиль `agentstack-app` — дополнительная ценность

| Артефакт | Экономия |
|----------|----------|
| Recipes 00–11 в `examples/agentstack/` | **4–8 ч** на разработчика (SDK/MCP/8DNA) |
| `check-capability-contract` | **1–3 ч** на инцидент drift |
| `src/lib/agentstack.ts` | Единый bootstrap, без копипасты |
| 5 skills AgentStack | Intent → channel как в plugin evals |
| Flow A (npm) / B (submodule) | [AGENTSTACK_APP_GUIDE_ru.md](AGENTSTACK_APP_GUIDE_ru.md) |

```bash
node tools/genetic-ai-starter/scripts/install.mjs \
  --target . --profile agentstack-app --project-name "My App" --domain app --strict
cd examples/agentstack && npm install @agentstack/sdk@0.4.15 && npm run recipe:00-bootstrap
```

---

## KPI (отслеживать в репозитории)

1. **Map-first в PR** — genetic tag / карта до путей ([ROI_PLAYBOOK_ru.md](ROI_PLAYBOOK_ru.md)).
2. **`validate-installed` зелёный на main**.
3. **Покрытие индексами** — подсистемы 10+ точек интеграции.
4. **AgentStack:** contract green, `recipeSetVersion` = платформа.

---

## Когда kit *не* окупается

- Прототип на &lt;2 недель — ничего или только `minimal`.
- Один файл CLI — максимум `minimal`.
- Команда без ИИ-ассистентов — ROI в основном в онбординге и дисциплине docs.

---

## Связанные документы

| Документ | Тема |
|----------|------|
| [REAL_BENEFITS_ru.md](REAL_BENEFITS_ru.md) | Нарратив + harness |
| [TOKEN_ECONOMICS_ru.md](TOKEN_ECONOMICS_ru.md) | Токены (вторично) |
| [PROFILE_COMPARISON.md](PROFILE_COMPARISON.md) | Выбор профиля |
| [AGENTSTACK_APP_GUIDE_ru.md](AGENTSTACK_APP_GUIDE_ru.md) | Consumer flow |
| [DOC_HUB.md](DOC_HUB.md) | Индекс документации |
