# 02 — 8DNA CRUD (protocol)

List DNA rows with `sdk.protocol.dnaList`, run a protein command via `executeCommand`, then invalidate snapshot cache.

## Env

- `AGENTSTACK_EMAIL` / `AGENTSTACK_PASSWORD`
- `AGENTSTACK_PROJECT_ID` — optional
- `DNA_COMMAND` — command id (default `get_projects`)

## Run

```bash
npm run recipe:02-8dna-crud
```

## Pattern

Prefer `sdk.protocol` over raw `/commands/*`. After writes, call `invalidateSnapshotPrefix`.
