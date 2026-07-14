# 03 — MCP execute

Вызов `agentstack.execute` через JSON-RPC `tools/call` на `POST /mcp`.

## Переменные

- `AGENTSTACK_API_KEY` или `AGENTSTACK_ACCESS_TOKEN`
- `AGENTSTACK_PROJECT_ID` — контекст (по умолчанию `1`)
- `AGENTSTACK_API_BASE` — для вычисления URL `/mcp`

## Запуск

```bash
npm run recipe:03-mcp-execute
```

## Заметки

Тот же вход, что у Cursor MCP. Пакетный формат: `{ steps, context, options }`. Каталог: `GET /mcp/actions`.
