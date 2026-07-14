# 11 — Integration webhook

Register an inbound webhook via MCP `webhooks.register` (alias family: `webhooks.create_endpoint` in some catalogs).

## Env

- `AGENTSTACK_API_KEY`
- `AGENTSTACK_PROJECT_ID`
- `WEBHOOK_URL` — required for live register
- `WEBHOOK_EVENTS` — comma-separated (default `integration.inbound`)
- `WEBHOOK_SECRET` — signing secret

## Run

```bash
npm run recipe:11-integration-webhook
```

SDK REST alternative: `sdk.webhooks.createWebhook({ url, events, secret })`.
