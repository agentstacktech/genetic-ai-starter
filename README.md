# Genetic AI Starter Kit

**Platform version:** `0.4.11` — aligned with **`AGENTSTACK_CORE_VERSION`** (monorepo) or [`PLATFORM_VERSION`](PLATFORM_VERSION) (standalone copy).

**Слой AI-операций для любого репозитория:** за минуты даёт карту навигации, genetic tags, правила Cursor и (опционально) мост к платформе AgentStack — чтобы агенты и люди **сначала читали карту**, а не грепали весь проект.

**English (главная для GitHub):** [README.en.md](README.en.md) · **Kit:** [agentstacktech/genetic-ai-starter](https://github.com/agentstacktech/genetic-ai-starter) · **Платформа:** [agentstacktech/AgentStack](https://github.com/agentstacktech/AgentStack) · **npm:** `npx @agentstack/genetic-ai-starter init` · [Ссылки](meta/docs/REPOSITORY_LINKS.md)

**Genetic tag:** `repo.tooling.genetic_starter.gen1`

---

## Что даёт kit

| Без kit | С kit |
|---------|--------|
| Каждый проект изобретает свои правила и `AGENTS.md` | Готовый **стандарт**: philosophy, карта, skills, merge `.cursorrules` |
| Агент ищет по всему `src/` | **Map-first:** `docs/ai/AI_NAVIGATION_MAP.md` → нужная подсистема |
| Нет общего языка для задач | **Genetic tags** (`app.api.handlers.gen1`) в карте и genes |
| Сломалась частичная установка | `doctor`, `repair`, `upgrade`, `validate-installed` |
| Непонятно, помогли ли правила | **Бенчмарки** — сравнение с `bare`, `agents_md`, `kit_standard` |

## Что появится в вашем проекте

- **AGENTS.md** — контракт для агента: что читать и в каком порядке.
- **Карта и индексы** — `AI_NAVIGATION_MAP.md`, шаблоны, при необходимости `AI_INDEX.md` по подсистемам.
- **Philosophy / genes** — как мы меняем код, ADR, тесты, direct-ship (профиль `founder`).
- **Cursor** — 5 rules + 4 skills (standard), идемпотентный блок в `.cursorrules`.
- **Скрипты** — `new-gene.mjs`, doctor/repair; lock `.genetic-ai/kit.lock.json`.
- **Приватность** — `--gitignore-kit full`: файлы kit локально, не в git.
- **AgentStack (опционально)** — overlay MCP/8DNA для потребителей платформы.

## Замеры (бенчмарк harness)

Стенд `shop-api`, 11 задач, профиль **standard**. Подробно: [BENEFITS_AND_METRICS_ru.md](meta/docs/BENEFITS_AND_METRICS_ru.md) · [BENEFITS_AND_METRICS.md](meta/docs/BENEFITS_AND_METRICS.md) (EN).

| Метрика | bare | только AGENTS.md | **kit standard** |
|---------|------|------------------|------------------|
| Медиана балла (0–10) | 6 | 8 | **8** |
| Успех задач | 64% | 91% | **91%** |
| Нецелевой grep (11 задач) | **13** | 0 | **1** |
| Map-first | 0% | 64% | **36%** |

**Примеры (все задачи — в [BENEFITS_AND_METRICS_ru.md](meta/docs/BENEFITS_AND_METRICS_ru.md)):**

| Задача | Суть | bare → kit |
|--------|------|------------|
| T01 | Production entry, не dev | 5 → **8** |
| T02 | Где JWT? | 6 → **7** (+ индексы лучше) |
| T03 | Webhook + HTTP client | оба 6, у kit меньше grep |
| T04 | `sed` по всему `src/` | **2 → 8** |
| T05 | Новый `billing/` — docs | **5 → 10** |
| T06 | Auth + OpenAPI — с чего начать | 6 → **7** |
| T07 | Checkout (ловушка legacy) | **1 → 5–7** |
| T08 | Баг фильтра каталога | 7 → **7–10** |

**Неделя команды:** день 0 — `init`; день 1 — Tier 0/1 в карте; день 2 — новый разработчик читает map-first; день 3 — новый модуль → map + index (T05); день 4 — `doctor` перед PR.

Подробные таблицы профилей: [PROFILE_COMPARISON.md](meta/docs/PROFILE_COMPARISON.md). ROI: [ROI_PLAYBOOK.md](meta/docs/ROI_PLAYBOOK.md).

## Документация

| Doc | Purpose |
|-----|---------|
| [**SETUP.cmd**](SETUP.cmd) | **Мастер установки (Windows)** |
| [meta/docs/QUICK_SETUP.md](meta/docs/QUICK_SETUP.md) | 3 шага для пользователя |
| [meta/docs/AUDIT_PLAN.md](meta/docs/AUDIT_PLAN.md) | Пробелы, TODO, план улучшений |
| [**meta/docs/INSTALL.md**](meta/docs/INSTALL.md) | **Canonical install guide** |
| [meta/docs/INSTALL_WINDOWS.md](meta/docs/INSTALL_WINDOWS.md) | Windows (CMD / Node; без `` ` `` и без PSSecurityException) |
| [meta/docs/TROUBLESHOOTING.md](meta/docs/TROUBLESHOOTING.md) | Error catalog |
| [meta/docs/BENEFITS_AND_METRICS_ru.md](meta/docs/BENEFITS_AND_METRICS_ru.md) | **Замеры и примеры задач** |
| [meta/docs/GETTING_STARTED.md](meta/docs/GETTING_STARTED.md) | Short overview |
| [COMMUNITY_ru.md](COMMUNITY_ru.md) | Сообщество (RU) |
| [FAQ.md](FAQ.md) | Частые вопросы |
| [VERSION.md](VERSION.md) | Versioning policy |

---

## Зачем (одной фразой)

**Карта → индекс → 1–2 hot-файла** вместо слепого grep — см. таблицу замеров выше и [BENEFITS_AND_METRICS_ru.md](meta/docs/BENEFITS_AND_METRICS_ru.md).

## Not the same as

| Package | Role |
|---------|------|
| [`8DNA_EXPORT_PACKAGE/`](../8DNA_EXPORT_PACKAGE/) | Heritage / patents / 8DNA architecture |
| **genetic-ai-starter** | Day-to-day AI ops for any new project |

---

## Quick install (мастер)

**Самый простой способ:** откройте папку kit и запустите мастер.

| ОС | Действие |
|----|----------|
| **Windows** | Двойной щелчок **`SETUP.cmd`** → ответьте на вопросы |
| **macOS / Linux** | `node scripts/init.mjs` в папке kit |

Мастер спросит: папку проекта, имя, domain, профиль, расширение AgentStack — и запустит установку.

**Your project** = целевая папка. **Kit** = эта папка (`genetic-ai-starter/`), не ваш репозиторий.

### macOS / Linux (вручную)

```bash
node /path/to/genetic-ai-starter/scripts/install.mjs \
  --target /path/to/your-project \
  --profile standard \
  --project-name "My App" \
  --domain app \
  --strict
```

### Windows (PowerShell)

```cmd
set PROJECT_NAME=My App
set DOMAIN=app
set PROFILE=standard
C:\Projects\genetic-ai-starter\scripts\install.cmd C:\Projects\your-project
```

Одной строкой (Node):

```text
node "C:\Projects\genetic-ai-starter\scripts\install.mjs" --target "C:\Projects\your-project" --profile standard --project-name "My App" --domain app --strict
```

PowerShell: только `powershell -ExecutionPolicy Bypass -File "...\install.ps1" ...` — см. [INSTALL_WINDOWS.md](meta/docs/INSTALL_WINDOWS.md).

**Repair:** `repair.cmd <project>` или `node <kit>/scripts/repair.mjs --target <project>`.

---

## Profiles

| Profile | Содержимое | AgentStack |
|---------|------------|------------|
| **minimal** | AGENTS (краткий) + 2 rules + stub-карта | опционально `--with-agentstack` |
| **standard** | + philosophy + `docs/ai/` + 5 rules + 4 skills (**рекомендуется**) | опционально |
| **full** | весь payload + CI sample | **включено** |
| **founder** | как `full`, акцент direct-ship в lock/доках | **включено** |

**Подробные таблицы:** [meta/docs/PROFILE_COMPARISON.md](meta/docs/PROFILE_COMPARISON.md).

---

## After install (in your project)

1. Edit `docs/ai/AI_NAVIGATION_MAP.md` (Tier 0 / Tier 1).
2. Add `AI_INDEX.md` per large subsystem.
3. `node <kit>/scripts/doctor.mjs --target .` — see also `docs/ai/OPERATIONS.md` in the project.

---

## Scripts (kit repo)

| Script | Purpose |
|--------|---------|
| **`SETUP.cmd`** / `init.mjs` | **Interactive wizard** (recommended) |
| `install.mjs` / `install.cmd` | Install into target (Windows: prefer `.cmd`) |
| `install-here.cmd` | Install into current directory |
| `repair.mjs` / `repair.cmd` | Fix partial / broken philosophy |
| `upgrade.mjs` | Re-install from lock file |
| `uninstall.mjs` | Remove kit artifacts |
| `doctor.mjs` | Health check |
| `new-gene.mjs` | Scaffold gene from template |
| `validate-installed.mjs` | Link + file checks |
| `verify-install.ps1` | Temp-dir smoke test (Windows) |

---

## Maintainers (AgentStack monorepo)

```bash
node genetic-ai-starter/scripts/sync-kit-version.mjs
node genetic-ai-starter/scripts/validate-kit.mjs
node genetic-ai-starter/tests/install.test.mjs
node genetic-ai-starter/tests/verify-temp-install.test.mjs
```

See [MAINTAINERS.md](MAINTAINERS.md).

---

## English

[README.en.md](README.en.md) · [LICENSE_NOTICE.md](LICENSE_NOTICE.md)
