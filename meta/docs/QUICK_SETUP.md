# Быстрая установка — Genetic AI Starter Kit

**Зачем kit:** карта навигации + правила Cursor + genes — см. [README.md](../../README.md).  
**ROI (модель):** [VALUE_AND_ROI_BY_PROJECT_SIZE_ru.md](VALUE_AND_ROI_BY_PROJECT_SIZE_ru.md) · `node scripts/calculate-roi.mjs`

## Submodule standard (3 команды)

Из **корня вашего git-репозитория**:

```bash
git submodule add https://github.com/agentstacktech/genetic-ai-starter.git tools/genetic-ai-starter
git submodule update --init tools/genetic-ai-starter
node tools/genetic-ai-starter/scripts/bootstrap-standard.mjs --target . --project-name "My App" --domain app
```

Проверка: `node tools/genetic-ai-starter/scripts/doctor.mjs --target .`

## Приложение на AgentStack

```bash
node tools/genetic-ai-starter/scripts/install.mjs \
  --target . --profile agentstack-app --project-name "My App" --domain app --strict
cd examples/agentstack && npm install @agentstack/sdk@0.4.13 && npm run recipe:00-bootstrap
```

Гайд: [AGENTSTACK_APP_GUIDE_ru.md](AGENTSTACK_APP_GUIDE_ru.md)

**Zero-kit:** см. [INTEGRATION_MODES.md](INTEGRATION_MODES.md) (`remote-bootstrap.mjs`).

---

## Альтернатива — мастер из папки kit

1. Node.js 18+
2. Откройте папку kit → **`SETUP.cmd`** или `node scripts/init.mjs`
3. Профиль **Стандарт** или **agentstack-app** для SDK/MCP

---

## Профили

[PROFILE_COMPARISON.md](PROFILE_COMPARISON.md) · [INTEGRATION_MODES.md](INTEGRATION_MODES.md)

---

## Проблемы

[TROUBLESHOOTING.md](TROUBLESHOOTING.md) · [INSTALL_WINDOWS.md](INSTALL_WINDOWS.md)
