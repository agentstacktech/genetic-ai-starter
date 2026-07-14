
## AgentStack extension

- Capability routing: [docs/ai/CONTEXT_FOR_AI.md](docs/ai/CONTEXT_FOR_AI.md)
- Static capability snapshot: [docs/ai/agentstack-capability-snapshot.json](docs/ai/agentstack-capability-snapshot.json)
- SDK bootstrap: [src/lib/agentstack.ts](src/lib/agentstack.ts) — `catalog()`, `capabilities()`, `ensureScope()`
- Env template: [.env.example](.env.example)
- SDK-first rule: [.cursor/rules/agentstack-sdk-first.mdc](.cursor/rules/agentstack-sdk-first.mdc)
- MCP template (Bearer from `/agentstack-init`): [.cursor/mcp.json.template](.cursor/mcp.json.template)
- Runnable recipes: [extensions/agentstack/recipes/](extensions/agentstack/recipes/) — start with `00-bootstrap`
- Tenant canary (when relevant): [.cursor/rules/platform-vs-tenant-canary.mdc](.cursor/rules/platform-vs-tenant-canary.mdc)
- Extension index: [extensions/agentstack/AI_INDEX.md](extensions/agentstack/AI_INDEX.md)
