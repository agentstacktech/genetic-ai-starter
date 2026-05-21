# Genetic AI Starter Kit

**Platform version:** `0.4.11` — aligned with **`AGENTSTACK_CORE_VERSION`** (monorepo) or [`PLATFORM_VERSION`](PLATFORM_VERSION) (standalone copy).

Portable **AI operations layer** for new repositories: philosophy genes → navigation map → subsystem indexes → Cursor rules/skills → optional AgentStack extension.

**English README (public default):** [README.en.md](README.en.md) · **Kit (public):** [agentstacktech/genetic-ai-starter](https://github.com/agentstacktech/genetic-ai-starter) (`main`) · **Platform:** [agentstacktech/AgentStack](https://github.com/agentstacktech/AgentStack) (`master`) · **npm:** `npx @agentstack/genetic-ai-starter init` · [URLs](meta/docs/REPOSITORY_LINKS.md)

**Genetic tag:** `repo.tooling.genetic_starter.gen1`

| Doc | Purpose |
|-----|---------|
| [**SETUP.cmd**](SETUP.cmd) | **Мастер установки (Windows)** |
| [meta/docs/QUICK_SETUP.md](meta/docs/QUICK_SETUP.md) | 3 шага для пользователя |
| [meta/docs/AUDIT_PLAN.md](meta/docs/AUDIT_PLAN.md) | Пробелы, TODO, план улучшений |
| [**meta/docs/INSTALL.md**](meta/docs/INSTALL.md) | **Canonical install guide** |
| [meta/docs/INSTALL_WINDOWS.md](meta/docs/INSTALL_WINDOWS.md) | Windows (CMD / Node; без `` ` `` и без PSSecurityException) |
| [meta/docs/TROUBLESHOOTING.md](meta/docs/TROUBLESHOOTING.md) | Error catalog |
| [meta/docs/GETTING_STARTED.md](meta/docs/GETTING_STARTED.md) | Short overview |
| [COMMUNITY_ru.md](COMMUNITY_ru.md) | Сообщество (RU) |
| [FAQ.md](FAQ.md) | Частые вопросы |
| [VERSION.md](VERSION.md) | Versioning policy |

---

## Why

Agents navigate **map → index → 1–2 hot files** instead of repo-wide grep. Benchmark summary: [`benchmarks/results/RESULTS.md`](benchmarks/results/RESULTS.md).

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
