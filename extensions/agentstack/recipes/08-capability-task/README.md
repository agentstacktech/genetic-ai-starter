# 08 — Capability task

Run a comfort task via `runTaskCapability` from `@agentstack/sdk/capability-tasks`.

## Env

- `AGENTSTACK_PROJECT_ID` — optional when login omitted
- `AGENTSTACK_EMAIL` / `AGENTSTACK_PASSWORD` — optional

## Run

```bash
npm run recipe:08-capability-task
```

Registers a local `recipe.demo.echo` port, then executes it. Discover task ids in `sdk.getModuleCatalog().tasks`.
