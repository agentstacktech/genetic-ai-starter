# 03 — MCP execute

Call `agentstack.execute` as a JSON-RPC `tools/call` batch against `POST /mcp`.

## Env

- `AGENTSTACK_API_KEY` or `AGENTSTACK_ACCESS_TOKEN`
- `AGENTSTACK_PROJECT_ID` — context override (default `1`)
- `AGENTSTACK_API_BASE` — REST base used to derive `/mcp` origin

## Run

```bash
npm run recipe:03-mcp-execute
```

## Notes

Same entry as Cursor MCP. Batch format also accepts `{ steps, context, options }` without JSON-RPC. Catalog: `GET /mcp/actions`.
