# 11 — Integration webhook

Регистрация входящего webhook через MCP `webhooks.register` (в каталогах также `webhooks.create_endpoint`).

## Переменные

- `AGENTSTACK_API_KEY`
- `AGENTSTACK_PROJECT_ID`
- `WEBHOOK_URL` — для живой регистрации
- `WEBHOOK_EVENTS` — через запятую (по умолчанию `integration.inbound`)
- `WEBHOOK_SECRET` — секрет подписи

## Запуск

```bash
npm run recipe:11-integration-webhook
```

REST в SDK: `sdk.webhooks.createWebhook({ url, events, secret })`.
