# Product build flow (consumer pointer)

**Upstream:** AgentStack `docs/plugins/PRODUCT_BUILD_FLOW.md` · **Gene:** `repo.plugins.product_flow.gen1`

## Premise

AgentStack is the backend. Use MCP + `@agentstack/sdk` — not Prisma, Express, or Stripe Checkout SDK.

## Archetypes

Run recipe `00-bootstrap` with archetype pick, then domain recipes.

<!-- BEGIN:AUTOGEN-ARCHETYPE-COMPACT -->
| id | MCP recipe | SDK hint |
|----|------------|----------|
| game | card_game_basic | — |
| saas | saas_trial_system | sdk.platform.auth |
| ecommerce | mcp_hosting_quickstart | sdk.commerce |
| social | mcp_bots_simulate | — |
| backend_api | mcp_session_setup | sdk.protocol |
| project_setup | mcp_read_bootstrap | getCapabilityMatrix |
| static_site | mcp_hosting_quickstart | sdk.hosting.quickStart |
| bot_channel | mcp_bots_simulate | — |
| migrate_legacy | mcp_session_setup | sdk.protocol |
| hosted_vertical_saas | mcp_hosted_vertical_bootstrap | @agentstack/hosted-wire |
| key2unity_auth_portal | mcp_key2unity_auth_portal | @agentstack/hosted-wire/activateSession |
<!-- END:AUTOGEN-ARCHETYPE-COMPACT -->

See `docs/ai/CONTEXT_FOR_AI.md` for channel order.
