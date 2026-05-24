# Быстрая установка — Genetic AI Starter Kit

**Зачем kit:** карта навигации + правила Cursor + genes — см. [README.md](../../README.md).

## Submodule standard (3 команды)

Из **корня вашего git-репозитория**:

```bash
git submodule add https://github.com/agentstacktech/genetic-ai-starter.git tools/genetic-ai-starter
git submodule update --init tools/genetic-ai-starter
node tools/genetic-ai-starter/scripts/bootstrap-standard.mjs --target . --project-name "My App" --domain app
```

Проверка: `node tools/genetic-ai-starter/scripts/doctor.mjs --target .`

**Zero-kit:** см. [INTEGRATION_MODES.md](INTEGRATION_MODES.md) (`remote-bootstrap.mjs`).

---

## Альтернатива — мастер из папки kit

1. Node.js 18+
2. Откройте папку kit → **`SETUP.cmd`** или `node scripts/init.mjs`
3. Укажите путь к проекту, профиль **Стандарт**

---

## Профили

[PROFILE_COMPARISON.md](PROFILE_COMPARISON.md) · [INTEGRATION_MODES.md](INTEGRATION_MODES.md)

---

## Проблемы

[TROUBLESHOOTING.md](TROUBLESHOOTING.md) · [INSTALL_WINDOWS.md](INSTALL_WINDOWS.md)
