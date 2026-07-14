# 06 — Logic dry run

MCP-действие `logic.dry_run` — симуляция правила без побочных эффектов.

## Переменные

- `AGENTSTACK_API_KEY`
- `AGENTSTACK_PROJECT_ID`
- `LOGIC_RULE_ID` — id правила (по умолчанию `demo-rule`)

## Запуск

```bash
npm run recipe:06-logic
```

## Альтернатива SDK

`sdk.logic.dryRun(ruleId, { event_data })` через REST с `context.dry_run`.
