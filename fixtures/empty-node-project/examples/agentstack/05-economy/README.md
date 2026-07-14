# 05 — Economy

Read AGNT ledger balance via `sdk.platform.economy` (`@agentstack/sdk/economy`).

## Env

- `AGENTSTACK_EMAIL` / `AGENTSTACK_PASSWORD`
- `AGENTSTACK_PROJECT_ID`
- `AGENTSTACK_USER_ID` — account key subject (default `1`)

## Run

```bash
npm run recipe:05-economy
```

## Import

Subpath `@agentstack/sdk/economy` re-exports ledger clients; recipes use the platform facade after login.
