# Установка на Windows — Genetic AI Starter Kit

**Канон:** [INSTALL.md](INSTALL.md) · **Профили:** [PROFILE_COMPARISON.md](PROFILE_COMPARISON.md) · **Ошибки:** [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## Самый простой способ — мастер

1. Откройте папку kit (`C:\Projects\genetic-ai-starter\` или `...\AgentStack\genetic-ai-starter\`).
2. **Двойной щелчок** по файлу **`SETUP.cmd`**.
3. Ответьте на вопросы (куда установить, имя, domain, профиль).
4. Дождитесь «Установка завершена» и откройте проект в Cursor.

Требуется только **Node.js 18+**. Политика PowerShell и обратные кавычки `` ` `` не нужны.

Альтернатива в терминале: `node scripts\init.mjs`

---

## Ручная установка (если без мастера)

| Способ | Execution policy | Перенос строк |
|--------|------------------|---------------|
| **1. Node** (`install.mjs`) | не нужен | одна строка |
| **2. CMD** (`install.cmd`) | обход автоматически | одна строка |
| **3. PowerShell** `-ExecutionPolicy Bypass -File` | обход | одна строка |
| ~~`& install.ps1` без Bypass~~ | **часто PSSecurityException** | не используйте в доках |

**Не используйте** обратную кавычку `` ` `` для переноса в примерах — при копировании из браузера/чата строка ломается. Пишите **одной строкой** или через `install.cmd`.

---

## 1. Пути

| Kit | Пример |
|-----|--------|
| Отдельная копия | `C:\Projects\genetic-ai-starter\` |
| Монорепо | `C:\Projects\AgentStack\genetic-ai-starter\` |

**Цель** — ваш проект, например `C:\Projects\AgentScreen`.  
Команды запускают **скрипты из kit**, не из целевого репозитория.

---

## 2. Рекомендуется: Node (одна строка)

Из любого каталога:

```text
node "C:\Projects\genetic-ai-starter\scripts\install.mjs" --target "C:\Projects\AgentScreen" --profile full --project-name "AgentScreen" --domain app --strict
```

Профили: `minimal` | `standard` | `full` | `founder`.

---

## 3. CMD — `install.cmd` (без политики подписи)

```cmd
cd /d C:\Projects\AgentScreen
set PROJECT_NAME=AgentScreen
set DOMAIN=app
set PROFILE=full
C:\Projects\genetic-ai-starter\scripts\install.cmd C:\Projects\AgentScreen
```

Готовый пример (пути внутри файла): `genetic-ai-starter\Install-AgentScreen.cmd`

Переменные окружения для `install.cmd`:

| Переменная | По умолчанию |
|------------|--------------|
| `PROJECT_NAME` | `My Project` |
| `DOMAIN` | `app` |
| `PROFILE` | `standard` |
| `GITIGNORE` | не задан; `full` → `--gitignore-kit full` |
| `STRICT` | включён (`STRICT=0` чтобы отключить) |

---

## 4. PowerShell — только с Bypass (одна строка)

**Ваш случай (profile full):**

```text
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Projects\genetic-ai-starter\scripts\install.ps1" -Target "C:\Projects\AgentScreen" -ProjectName "AgentScreen" -Domain app -Profile full -Strict
```

Ошибка из скриншота (`не имеет цифровой подписи` / `PSSecurityException`) возникает при:

```text
& "C:\Projects\genetic-ai-starter\scripts\install.ps1" ...
```

без `-ExecutionPolicy Bypass`. Исправление — строка выше или `install.cmd`.

### Опционально: разрешить `&` навсегда (текущий пользователь)

```text
powershell -ExecutionPolicy Bypass -File "C:\Projects\genetic-ai-starter\scripts\enable-windows-scripts.ps1"
```

После этого можно `& "...\install.ps1" ...`, но **CMD/Node по-прежнему надёжнее**.

---

## 5. Установка в текущую папку

```cmd
cd /d C:\Projects\AgentScreen
C:\Projects\genetic-ai-starter\scripts\install-here.cmd
```

Или Node:

```text
node "C:\Projects\genetic-ai-starter\scripts\install.mjs" --target "." --profile standard --project-name "AgentScreen" --domain app --strict
```

(`--target` с путём `.` — из каталога проекта.)

---

## 6. Repair

```cmd
C:\Projects\genetic-ai-starter\scripts\repair.cmd C:\Projects\AgentScreen
```

```text
node "C:\Projects\genetic-ai-starter\scripts\repair.mjs" --target "C:\Projects\AgentScreen"
```

```text
powershell -NoProfile -ExecutionPolicy Bypass -File "C:\Projects\genetic-ai-starter\scripts\repair.ps1" -Target "C:\Projects\AgentScreen"
```

---

## 7. Проверка

```text
node "C:\Projects\genetic-ai-starter\scripts\doctor.mjs" --target "C:\Projects\AgentScreen"
```

Smoke-test kit (временная папка):

```cmd
C:\Projects\genetic-ai-starter\scripts\verify-install.cmd
```

---

## 8. Типичные ошибки

| Сообщение | Причина | Решение |
|-----------|---------|---------|
| `PSSecurityException` / нет цифровой подписи | `& install.ps1` при Restricted | `install.cmd` или `-ExecutionPolicy Bypass -File` |
| `CommandNotFoundException` | забыли `&` при вызове `.ps1` | CMD/Node или Bypass `-File` |
| `Missing ...\shared\constants.py` | старый kit | обновить kit + `PLATFORM_VERSION` |
| Строка обрывается на `` ` `` | перенос PowerShell при копировании | одна строка |

---

## 9. Переменная `GENETIC_AI_STARTER_KIT` (опционально)

```text
setx GENETIC_AI_STARTER_KIT "C:\Projects\genetic-ai-starter"
```

Новое окно CMD:

```cmd
set PROJECT_NAME=AgentScreen
set PROFILE=full
"%GENETIC_AI_STARTER_KIT%\scripts\install.cmd" C:\Projects\AgentScreen
```

---

## Требования

- Node.js **18+**
- PowerShell **5.1+** (для `.ps1` / `.cmd`) или только Node
