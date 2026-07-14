# 01 — Discover capabilities

`getModuleCatalog()` и `getCapabilityMatrix()`, проверка доменов через `gateCapability`, опционально `GET /mcp/actions`.

## Переменные

- `AGENTSTACK_API_KEY` — для запроса каталога MCP-действий

## Запуск

```bash
npm run recipe:01-discover-capabilities
```

## Заметки

Перед опциональными модулями (`commerce`, `economy`, `logic`) проверяйте `getCapabilityMatrix()`. Полный список: `GET /mcp/actions`.
