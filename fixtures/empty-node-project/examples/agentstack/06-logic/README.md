# 06 — Logic dry run

Documented MCP action `logic.dry_run` — simulate a rule without side effects.

## Env

- `AGENTSTACK_API_KEY`
- `AGENTSTACK_PROJECT_ID`
- `LOGIC_RULE_ID` — target rule (default `demo-rule`)

## Run

```bash
npm run recipe:06-logic
```

## SDK alternative

`sdk.logic.dryRun(ruleId, { event_data })` sets `context.dry_run` on REST execute.
