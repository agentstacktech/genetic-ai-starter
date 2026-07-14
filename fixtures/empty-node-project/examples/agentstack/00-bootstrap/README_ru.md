# 00 — Bootstrap

Инициализация `@agentstack/sdk`, каталог модулей, вход, список проектов и фиксация активного `project_id`.

## Переменные

- `AGENTSTACK_API_BASE` — базовый URL API (необязательно)
- `AGENTSTACK_EMAIL` / `AGENTSTACK_PASSWORD` — вход (необязательно для каталога)
- `AGENTSTACK_PROJECT_ID` — предпочтительный проект

## Запуск

```bash
npm run recipe:00-bootstrap
```

## Результат

При наличии учётных данных вызывается `ensureScope` и устанавливается `sdk.updateProjectId`.
