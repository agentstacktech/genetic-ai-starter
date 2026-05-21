# Сравнение профилей установки — Genetic AI Starter Kit

**Платформа:** `0.4.11` · источник правды для состава: `profiles/*.json` + `scripts/lib/profile-include.mjs`.

Профиль задаёт **какие файлы копируются** в целевой репозиторий. Расширение **AgentStack** — отдельный слой (overlay + merge), подключается флагом или встроено в `full` / `founder`.

**Замеры по профилям (harness):** `standard` −12 unscoped grep vs bare; `minimal` сильнее на T04/T05; с индексами — 73% map-first — [BENEFITS_AND_METRICS_ru.md](BENEFITS_AND_METRICS_ru.md).

---

## 1. Краткий выбор

| Ваша ситуация | Профиль | AgentStack |
|---------------|---------|------------|
| Скрипт, утилита, &lt;5 модулей, без философии | **minimal** | нет |
| Новый продукт, open source, обычный репозиторий | **standard** | опционально `--with-agentstack` |
| Приложение **на** AgentStack (MCP, 8DNA, SDK) | **full** | **включено** |
| Монорепо AgentStack / сессии основателя (direct ship) | **founder** | **включено** |
| Уже есть `standard`, нужен только MCP/canary слой | **standard** | `--with-agentstack` |

**По умолчанию:** `standard`.

---

## 2. Что получает агент (поведение)

| Возможность | minimal | standard | standard + AgentStack | full | founder |
|-------------|:-------:|:--------:|:---------------------:|:----:|:-------:|
| Точка входа `AGENTS.md` | краткая | полная | полная | полная | полная |
| Порядок «карта → индекс → hot files» | stub map | да | да + Tier 0 AgentStack | да | да |
| Запрет слепого repo-wide grep (rules) | базовый | полный набор | + canary/platform rule | полный + canary | полный + canary |
| Controlled changes (без bulk-скриптов) | да | да | да | да | да |
| Планирование / tool discipline (rules) | нет | да | да | да | да |
| Индексация подсистем (index-authoring) | нет | да | да | да | да |
| Cursor Skills (4 шт.) | нет | да | да | да | да |
| Philosophy / genes | нет | ядро (~17 gene-файлов) | то же | то же | то же + **акцент** на direct-ship |
| `docs/ai/OPERATIONS.md` (repair/upgrade) | нет | да | да | да | да |
| MCP / capability routing (`CONTEXT_FOR_AI`) | нет | нет | **да** | **да** | **да** |
| Tenant canary vs founder direct-ship | нет | нет | rule + gene-ссылки | **да** | **да** (приоритет direct-ship) |
| CI sample (validate kit в проекте) | нет | нет | нет* | **да** | **да** |

\*При `standard --with-agentstack` sample workflow **не** копируется — только overlay. Чтобы получить sample, используйте `full` или скопируйте файл вручную из kit.

---

## 3. Состав файлов (после install)

Подсчёт по `resolveProfileFiles` (платформа 0.4.11). Для **minimal** `AGENTS.md` и stub-карта создаются отдельным шагом install (не входят в glob профиля).

| Категория | minimal | standard | full / founder |
|-----------|--------:|---------:|---------------:|
| **Всего путей payload** | 4 → ~6 в проекте | 39 | 41 |
| `.genetic-ai/` (lock, manifest stub) | да | да | да |
| `.cursor/rules/*.mdc` | 2 | 5 | 5 (+1 от AgentStack) |
| `.cursor/skills/` | 0 | 4 skills | 4 skills |
| `philosophy/` | — | 19 файлов | 19 файлов |
| `docs/ai/` | stub только | 8 файлов | 8 + merge в карту |
| `AGENTS.md` | minimal-шаблон | полный | полный |
| `.github/workflows/*.sample` | — | — | 1 файл |
| `.cursorrules` (блок `genetic-ai`) | merge | merge | merge + AgentStack append |

### 3.1 minimal — что входит

| Путь в проекте | Назначение |
|----------------|------------|
| `AGENTS.md` | Из `AGENTS.minimal.md` — короткий read order |
| `docs/ai/AI_NAVIGATION_MAP.md` | Stub Tier 0 (если файла ещё не было) |
| `.cursor/rules/genetic-navigation.mdc` | Карта → индекс → scoped search |
| `.cursor/rules/engineering-controlled-changes.mdc` | Без массовых one-off патчей |
| `.genetic-ai/kit.lock.json` | Версия kit / профиль |

**Нет:** `philosophy/`, skills, `OPERATIONS.md`, полной карты из payload, остальных rules.

### 3.2 standard — что добавляется к minimal

**Rules (5):**

| Rule | Зачем |
|------|--------|
| `genetic-navigation.mdc` | Обязательный workflow навигации |
| `engineering-controlled-changes.mdc` | Контролируемые правки |
| `engineering-tool-discipline.mdc` | Дисциплина инструментов |
| `engineering-planning-todos.mdc` | Планирование сложных задач |
| `genetic-index-authoring.mdc` | Создание `AI_INDEX.md` |

**Skills (4):** `genetic-navigation`, `index-authoring`, `bootstrap-subsystem`, `gene-authoring`.

**docs/ai/:** `AI_NAVIGATION_MAP.md`, `AI_INDEXING_SYSTEM.md`, `OPERATIONS.md`, `CUSTOMIZE_DOMAIN.md`, ADR template, шаблоны map/index.

**philosophy/:** индексы + foundation genes + `repo.engineering.*` + `repo.navigation.*` + `repo.evolution.compression` + шаблоны genes + *файл* `repo.engineering.founder_direct_ship.gen1.md` (лежит на диске; в `GENE_INDEX` помечен как ориентир для профиля `founder`).

### 3.3 full / founder — отличие от standard

| Отличие | full | founder |
|---------|------|---------|
| Файлы payload | `payload/**` (+ CI sample) | **идентично** full |
| Расширение AgentStack | автоматически | автоматически |
| Смысл профиля в lock | «потребитель платформы» | «founder direct ship» в AGENTS/CONTEXT |
| Рекомендация | SDK/MCP/8DNA в consumer-repo | работа в [agentstacktech/AgentStack](https://github.com/agentstacktech/AgentStack) монорепо |

Между **full** и **founder** **нет разницы в списке копируемых файлов** — различается запись `profile` в `.genetic-ai/kit.lock.json` и документированный приоритет gene `repo.engineering.founder_direct_ship.gen1`.

---

## 4. Расширение AgentStack (`--with-agentstack`)

Подключается если:

- явно: `--with-agentstack` (любой профиль), или  
- профиль `full` / `founder` (`extensions: ["agentstack"]` в JSON).

### 4.1 Что добавляется в проект

| Артефакт | Путь | Назначение |
|----------|------|------------|
| Overlay | `docs/ai/CONTEXT_FOR_AI.md` | MCP, 8DNA, capability routing (сокращённо от монорепо) |
| Rule | `.cursor/rules/platform-vs-tenant-canary.mdc` | Canary/rollout — **для tenant-приложений**; не подменяет founder direct-ship |
| Merge | `docs/ai/AI_NAVIGATION_MAP.md` | Блок `<!-- genetic-ai-extension:agentstack-nav -->` — Tier 0 строки SDK/MCP |
| Merge | `.cursorrules` | Ссылки на CONTEXT + canary rule |
| Config (опционально) | через `genes_config.starter.json` | Мост к `gene_manager`, если vendored |

Канонический upstream: `docs/plugins/CONTEXT_FOR_AI.md` в монорепо AgentStack. Поддержка: `node <kit>/scripts/sync-from-canonical.mjs`.

### 4.2 Матрица: профиль × AgentStack

| Установка | Philosophy | Platform overlay | CI sample |
|-----------|:------------:|:------------------:|:---------:|
| `minimal` | — | только с `--with-agentstack` | нет |
| `standard` | да | только с `--with-agentstack` | нет |
| `standard --with-agentstack` | да | **да** | нет |
| `full` | да | **да** (auto) | **да** |
| `founder` | да | **да** (auto) | **да** |

### 4.3 Поведение агента с AgentStack

1. Сначала ядро kit: `AGENTS.md` → rules → `AI_NAVIGATION_MAP.md` (включая append-блок).
2. Задачи MCP/8DNA/SDK → `docs/ai/CONTEXT_FOR_AI.md`.
3. Rollout/canary/sandbox **только если явно в задаче** — `platform-vs-tenant-canary.mdc`.
4. Профиль **founder** + gene direct-ship → **один** код-путь, без выдуманных dual-path/canary для сессии основателя.

---

## 5. Флаги, влияющие на все профили

| Флаг | Эффект |
|------|--------|
| `--strict` | Ошибка, если остались `{{PLACEHOLDER}}` |
| `--merge-philosophy` | Добавить недостающие genes, не затирать свои |
| `--force-philosophy` | Перезаписать starter `philosophy/` |
| *(авто)* | Неполная `philosophy/` → как `--force-philosophy` |
| `--skills global` | Skills в `~/.cursor/skills/` вместо проекта |
| `--gitignore-kit full` | Блок в `.gitignore` — kit **не коммитится** (локально для Cursor) |
| `--gitignore-kit none` | По умолчанию |
| `--domain` | Префикс genetic tags в шаблонах (`app`, `api`, …) |

При **`full`**: в git не попадают `philosophy/`, `docs/ai/`, `AGENTS.md`, cursor rules/skills kit; черновики — `docs/ai/local/`. В мастере: «Не коммитить (полный .gitignore)».

После install всегда запускается `validate-installed.mjs`.

---

## 6. Примеры команд

**Мастер (рекомендуется):** двойной щелчок `<kit>/SETUP.cmd` или `node <kit>/scripts/init.mjs`.

```bash
# Рекомендуемый default (вручную)
node <kit>/scripts/install.mjs --target ./my-app --profile standard \
  --project-name "My App" --domain app --strict

# AgentStack consumer без лишнего CI sample вручную — extension на standard
node <kit>/scripts/install.mjs --target ./my-app --profile standard \
  --with-agentstack --project-name "My App" --domain app --strict

# Полный потребитель платформы
node <kit>/scripts/install.mjs --target ./my-app --profile full \
  --project-name "My App" --domain app --strict

# Монорепо / founder sessions
node <kit>/scripts/install.mjs --target . --profile founder \
  --project-name "AgentStack" --domain repo --strict
```

Windows CMD:

```cmd
set PROFILE=full
set PROJECT_NAME=My App
<kit>\scripts\install.cmd C:\Projects\MyApp
```

PowerShell (одна строка, с Bypass):

```text
powershell -NoProfile -ExecutionPolicy Bypass -File "<kit>\scripts\install.ps1" -Target "C:\Projects\MyApp" -Profile full -ProjectName "My App" -Domain app -Strict
```

---

## 7. Запись в lock-файле

`.genetic-ai/kit.lock.json` после install:

| Поле | Пример |
|------|--------|
| `profile` | `standard` |
| `kitVersion` | `0.4.11` |
| `extensions` | `[]` или `["agentstack"]` |

`upgrade.mjs` читает lock и повторяет тот же профиль и extensions.

---

## 8. См. также

- [INSTALL.md](INSTALL.md) — каноническая установка  
- [STACK_PROFILES.md](STACK_PROFILES.md) — подсказки Tier 0 по стеку (node-ts, python-api, …)  
- [extensions/agentstack/README.md](../../extensions/agentstack/README.md)  
- [KIT_ARCHITECTURE.md](KIT_ARCHITECTURE.md) — пайплайн install/validate  
