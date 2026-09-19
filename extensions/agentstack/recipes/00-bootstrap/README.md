# 00 — Bootstrap

Initialize `@agentstack/sdk`, print module catalog, log in, list projects, and pin active project scope.

## Step 0 — Pick product archetype

Before domain work, classify the app (`static_site`, `saas`, `ecommerce`, `bot_channel`, …). Machine SoT: `docs/_generated/mcp_agent_instruction_index.json` → `product_archetypes`. Narrative: monorepo `docs/plugins/PRODUCT_BUILD_FLOW.md` or kit `docs/ai/PRODUCT_BUILD_FLOW.pointer.md`.

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
