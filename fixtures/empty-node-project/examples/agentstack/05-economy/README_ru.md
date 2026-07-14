# 05 — Economy

Чтение баланса AGNT через `sdk.platform.economy` (`@agentstack/sdk/economy`).

## Переменные

- `AGENTSTACK_EMAIL` / `AGENTSTACK_PASSWORD`
- `AGENTSTACK_PROJECT_ID`
- `AGENTSTACK_USER_ID` — для ключа счёта (по умолчанию `1`)

## Запуск

```bash
npm run recipe:05-economy
```

## Импорт

Подпуть `@agentstack/sdk/economy` экспортирует клиенты ledger; в рецепте — фасад platform после входа.
