# 01 — Discover capabilities

Read `getModuleCatalog()` and `getCapabilityMatrix()`, gate optional domains with `gateCapability`, and optionally list MCP actions.

## Env

- `AGENTSTACK_API_KEY` — for `GET /mcp/actions` probe

## Run

```bash
npm run recipe:01-discover-capabilities
```

## Notes

Always call `getCapabilityMatrix()` before optional modules (`commerce`, `economy`, `logic`). Full catalog: `GET /mcp/actions` on your deployment.
