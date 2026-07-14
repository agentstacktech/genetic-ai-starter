# ROI playbook — эффективность AI-навигации

**EN:** [ROI_PLAYBOOK.md](ROI_PLAYBOOK.md)  
**Модель в деньгах по размеру команды:** [VALUE_AND_ROI_BY_PROJECT_SIZE_ru.md](VALUE_AND_ROI_BY_PROJECT_SIZE_ru.md)

---

## Кратко

| Размер | Экономия (модель) | Окупаемость install ~3 ч |
|--------|-------------------|---------------------------|
| Соло | ~$340/мес | &lt; недели |
| Малый (2–5) | ~$1 050/мес | &lt; 3 дней |
| Средний (6–15) | ~$2 170/мес | сразу |
| Крупный monorepo | ~$4 080/мес | сразу |
| AgentStack (доп.) | ~$1 400/мес | первый спринт |
| AgentStack итого | ~$2 450/мес | — |

`node scripts/calculate-roi.mjs` · [roi-model.snapshot.json](roi-model.snapshot.json)

---

## Leading indicators

- **Map-first rate** — ссылки на `AI_NAVIGATION_MAP` / genetic tags в PR
- **Index coverage** — % подсистем с `AI_INDEX.md`
- **validate-installed** — ноль broken links на main
- **Пол слабого агента** — отказ от bulk sed (T04)

## Lagging indicators

- **TTFHF** — время до первого правильного hot file
- **Wrong-module PR** — откаты из-за legacy/decoy
- **Release gate** — hotfix без карты (T13)
- **Unscoped grep** — см. harness

---

## Benchmark

Scorer **1.2.1**, 14 tasks — [metrics.snapshot.json](metrics.snapshot.json). Arms: `kit_agentstack` для `agentstack-app`. См. [METRICS_GLOSSARY_ru.md](METRICS_GLOSSARY_ru.md).

---

## Калькулятор потерь без карты

```
потери/мес ≈ (инциденты × часы × ставка) + (релизы без docs × часы × ставка) + онбординг/квартал
```

Пример малой команды: **~$1 050/мес** — `node scripts/calculate-roi.mjs --tier small`

---

## Стоимость поддержки (честно)

| Статья | ч/мес |
|--------|-------|
| Карта Tier 0/1 | 0.5–1 |
| Новые AI_INDEX | 0.5–1 |
| doctor в CI | ~0.1 |
| upgrade kit | ~0.25 на bump платформы |

---

## Профили и ROI

| Профиль | Кому | Драйвер |
|---------|------|---------|
| `minimal` | Скрипты | T04, stub map |
| `standard` | Продукты | Карта + genes |
| `agentstack-app` | На платформе | Recipes + contract |
| `founder` | Monorepo | direct-ship |

[PROFILE_COMPARISON.md](PROFILE_COMPARISON.md) · [AGENTSTACK_APP_GUIDE_ru.md](AGENTSTACK_APP_GUIDE_ru.md).

---

## Когда не окупается

Прототип &lt;2 недель, один файл, команда без ИИ — см. [VALUE_AND_ROI_BY_PROJECT_SIZE_ru.md](VALUE_AND_ROI_BY_PROJECT_SIZE_ru.md).
