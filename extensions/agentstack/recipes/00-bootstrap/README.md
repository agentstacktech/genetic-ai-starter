# 00 — Bootstrap

Initialize `@agentstack/sdk`, print module catalog, log in, list projects, and pin active project scope.

## Env

- `AGENTSTACK_API_BASE` — optional REST base
- `AGENTSTACK_EMAIL` / `AGENTSTACK_PASSWORD` — login (optional for catalog-only)
- `AGENTSTACK_PROJECT_ID` — preferred active project

## Run

```bash
npm run recipe:00-bootstrap
```

## Outcome

Sets `sdk.updateProjectId` via `ensureScope` when credentials are present.
