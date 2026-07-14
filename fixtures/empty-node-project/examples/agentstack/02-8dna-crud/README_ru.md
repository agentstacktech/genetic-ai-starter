# 02 — 8DNA CRUD (protocol)

`sdk.protocol.dnaList`, `executeCommand` и `invalidateSnapshotPrefix` для согласованного кэша.

## Переменные

- `AGENTSTACK_EMAIL` / `AGENTSTACK_PASSWORD`
- `AGENTSTACK_PROJECT_ID` — необязательно
- `DNA_COMMAND` — id команды (по умолчанию `get_projects`)

## Запуск

```bash
npm run recipe:02-8dna-crud
```

## Паттерн

Используйте `sdk.protocol`, не сырой `/commands/*`. После мутаций — `invalidateSnapshotPrefix`.
