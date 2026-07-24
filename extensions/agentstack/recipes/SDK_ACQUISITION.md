# SDK acquisition — AgentStack recipes

Genetic tag: `repo.platform.sdk.recipes.gen1`

Recipes depend on `@agentstack/sdk@0.4.15`. **Never auto-run `npm install`** from agents or CI without explicit human approval — document flows only.

## Flow A — npm (published package)

For standalone consumer projects:

```bash
cd recipes
npm install
```

`package.json` pins `@agentstack/sdk` to **0.4.13**. After install:

```bash
npm run recipe:00-bootstrap
```

Set env before authenticated recipes:

| Variable | Purpose |
|----------|---------|
| `AGENTSTACK_API_BASE` | REST base (default production `/api`) |
| `AGENTSTACK_EMAIL` / `AGENTSTACK_PASSWORD` | Login |
| `AGENTSTACK_PROJECT_ID` | Active project scope |
| `AGENTSTACK_API_KEY` | MCP `fetch` recipes (03, 06, 09, 11) |

## Flow B — git submodule (monorepo-adjacent)

When developing inside or beside the AgentStack monorepo:

```bash
# From consumer repo (git required):
node path/to/genetic-ai-starter/scripts/submodule-add-sdk.mjs --target . --tag v0.4.15
node path/to/genetic-ai-starter/scripts/link-sdk-deps.mjs --target .
cd vendor/agentstack-sdk && npm install && npm run build
cd examples/agentstack && npm install
```

Or manually:

```bash
git submodule add https://github.com/agentstacktech/agentstack-sdk.git vendor/agentstack-sdk
cd vendor/agentstack-sdk/packages/core && npm install && npm run build
```

Point recipes at the local build (kit `link-sdk-deps.mjs` does this automatically):

```json
"dependencies": {
  "@agentstack/sdk": "file:../../vendor/agentstack-sdk/packages/core"
}
```

Rebuild SDK after source changes. Prefer Flow A for kit consumers; Flow B for platform contributors.

## Verify install

```bash
npm run typecheck
```

## Related docs

- SDK README: `agentstack-unified-sdk/packages/core/README.en.md`
- Agent protocol: `docs/AGENT_PROTOCOL_QUICKSTART.md`
- MCP catalog: `GET /mcp/actions` on your deployment origin
