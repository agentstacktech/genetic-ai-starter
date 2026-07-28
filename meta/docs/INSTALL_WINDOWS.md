# Установка на Windows — Genetic AI Starter Kit

**Канон:** [INSTALL.md](INSTALL.md) · **Матрица сбоев:** [WINDOWS_INSTALL_MATRIX.md](WINDOWS_INSTALL_MATRIX.md) · **Профили:** [PROFILE_COMPARISON.md](PROFILE_COMPARISON.md) · **Ошибки:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## Приоритет (happy path)

1. **`SETUP.cmd`** — двойной щелчок (Node + preflight, **без PowerShell**)
2. **`npx @agentstack/genetic-ai-starter init`** — npm bin
3. **`node scripts\install.mjs`** — одна строка
4. **`scripts\install.cmd`** — CMD без PowerShell
5. PowerShell `-ExecutionPolicy Bypass -File` — **legacy / advanced**

**Важно:** при запуске `SETUP.cmd` из папки kit **укажите путь к вашему проекту** — не устанавливайте в папку kit.

English UI: **`SETUP.en.cmd`**

---

## Самый простой способ — мастер

1. Откройте папку kit (`C:\Projects\genetic-ai-starter\` или `...\AgentStack\genetic-ai-starter\`).
2. **Двойной щелчок** по **`SETUP.cmd`**.
3. Укажите **папку проекта** (например `C:\Projects\AgentScreen`), имя, domain, профиль.
4. Дождитесь «Setup completed» и откройте проект в Cursor.

Требуется **Node.js 18+**. PowerShell не нужен.

Проверка до установки:

```text
node "C:\Projects\genetic-ai-starter\scripts\preflight.mjs" --quick
```

---

## Ручная установка

| Способ | PowerShell | Примечание |
|--------|------------|------------|
| **SETUP.cmd** | не нужен | preflight + wizard |
| **npx** | не нужен | `npx @agentstack/genetic-ai-starter init` |
| **Node** `install.mjs` | не нужен | одна строка |
| **install.cmd** | **не нужен** | Node-only (0.4.15+) |
| **install.ps1** + Bypass | опционально | legacy |

**Не используйте** `` ` `` для переноса строк при копировании команд.

---

## Node (одна строка)

```text
node "C:\Projects\genetic-ai-starter\scripts\install.mjs" --target "C:\Projects\AgentScreen" --profile full --project-name "AgentScreen" --domain app --strict
```

Профили: `minimal` | `standard` | `full` | `founder` | `agentstack-app`

---

## CMD — `install.cmd` (без PowerShell)

```cmd
set PROJECT_NAME=AgentScreen
set DOMAIN=app
set PROFILE=full
C:\Projects\genetic-ai-starter\scripts\install.cmd C:\Projects\AgentScreen
```

---

## Zero-kit bootstrap (remote)

```cmd
curl -fsSL https://raw.githubusercontent.com/agentstacktech/genetic-ai-starter/main/scripts/remote-bootstrap.mjs -o %TEMP%\gai-bootstrap.mjs && node %TEMP%\gai-bootstrap.mjs --target .
```

---

## Переменная окружения (canonical)

```text
setx GENETIC_AI_KIT_ROOT "C:\Projects\genetic-ai-starter"
```

Legacy alias: `GENETIC_AI_STARTER_KIT` (читается, но не документируется).

---

## Repair / verify

```cmd
C:\Projects\genetic-ai-starter\scripts\repair.cmd C:\Projects\AgentScreen
node "C:\Projects\genetic-ai-starter\scripts\doctor.mjs" --target "C:\Projects\AgentScreen"
C:\Projects\genetic-ai-starter\scripts\verify-install.cmd
```

---

## Типичные ошибки

| Код / симптом | Решение |
|---------------|---------|
| `E_NODE_MISSING` | Установить Node 18+; перезапустить терминал; `winget install OpenJS.NodeJS.LTS` |
| `E_TARGET_IS_KIT` | Указать папку **проекта**, не папку kit |
| `PSSecurityException` | Использовать `SETUP.cmd` или Node |
| `E_PLATFORM_VERSION` | Обновить kit; проверить `PLATFORM_VERSION` |

Полная матрица: [WINDOWS_INSTALL_MATRIX.md](WINDOWS_INSTALL_MATRIX.md)

---

## Advanced: PowerShell policy (опционально)

См. [advanced/ENABLE_WINDOWS_SCRIPTS.md](advanced/ENABLE_WINDOWS_SCRIPTS.md) — не требуется для `SETUP.cmd` / Node.

---

## Требования

- Node.js **18+**
- PowerShell **не обязателен** для установки
