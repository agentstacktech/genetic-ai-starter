# Польза в продакшене — Genetic AI Starter Kit

**EN:** [PRODUCTION_OUTCOMES.md](PRODUCTION_OUTCOMES.md)

**Genes:** `repo.tooling.genetic_starter.docs.gen1` · `repo.tooling.genetic_starter.gen1`

**Связано:** [AGENT_FLOOR_ru.md](AGENT_FLOOR_ru.md) · [AI_RELEASE_AUTONOMY_ru.md](AI_RELEASE_AUTONOMY_ru.md) · [DOC_CLAIMS_AUDIT.md](DOC_CLAIMS_AUDIT.md) · [ROI_PLAYBOOK_ru.md](ROI_PLAYBOOK_ru.md)

---

## 1. Кому в проде

- Команды **2+** разработчиков с общим репозиторием
- **Monorepo** или несколько пакетов с пересекающимися смыслами
- Проекты, где агенты Cursor/IDE — часть delivery, не эксперимент
- Потребители **AgentStack** (опционально extension + sync-from-canonical)

## 2. Release train

| Шаг | Артефакт |
|-----|----------|
| Код фичи | scoped patch |
| Навигация | Tier 1 + `AI_INDEX` в **том же PR** (T05) |
| Gate | `doctor` / `validate-installed` (T13) |
| CI | `.github/workflows/genetic-ai-validate.yml.sample` |

```yaml
# consumer CI (после npm install kit)
- run: node node_modules/@agentstack/genetic-ai-starter/scripts/doctor.mjs --target .
- run: node node_modules/@agentstack/genetic-ai-starter/scripts/validate-installed.mjs --target .
```

## 3. Качество PR

- **controlled_changes** — отказ от `sed` по всему `src/` (T04)
- Genetic tag в описании PR → reviewer видит контур
- Map-first в diff → меньше wrong-module файлов

## 4. Слабые модели в команде

Политика: **standard** profile для shared repos; **minimal** — solo spikes.

Harness (synthetic): weak-style **0%** success → kit + indexes **100%** — см. [AGENT_FLOOR_ru.md](AGENT_FLOOR_ru.md) и [DOC_CLAIMS_AUDIT.md](DOC_CLAIMS_AUDIT.md).

## 5. Incident / drift

| Симптом | Действие |
|---------|----------|
| Карта не совпадает с `src/` | `repair.mjs` + обновить Tier 1 |
| Частичная установка | `upgrade.mjs` из `kit.lock.json` |
| Stub leak | `doctor` — удалить `AI_NAVIGATION_MAP.minimal.stub.md` |

## 6. AgentStack consumers

- Extension `extensions/agentstack/` — MCP/8DNA excerpt
- Mitigation G10: `sync-from-canonical.mjs` после bump platform
- Tier 0 row в monorepo [AI_NAVIGATION_MAP.md](../../../docs/AI_NAVIGATION_MAP.md)

## 7. Ограничения

Kit **не заменяет** QA sign-off, security review, продуктовые trade-offs. См. [DOC_CLAIMS_AUDIT.md](DOC_CLAIMS_AUDIT.md).
