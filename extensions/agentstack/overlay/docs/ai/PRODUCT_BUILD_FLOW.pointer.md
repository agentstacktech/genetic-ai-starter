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
| hosted_site_edit | mcp_hosting_edit_site_safe | sdk.hosting.quickStart |
| bot_channel | mcp_bots_simulate | — |
| showcase_portfolio_storefront | mcp_showcase_catalog_safe | sdk.hosting.quickStart |
| migrate_legacy | mcp_session_setup | sdk.protocol |
| hosted_vertical_saas | mcp_hosted_vertical_bootstrap | @agentstack/hosted-wire |
| service_business | mcp_read_bootstrap | — |
| ai_product | mcp_knowledge_ingest | — |
| marketplace | mcp_session_setup | — |
| internal_tool | mcp_session_setup | — |
| community | mcp_session_setup | — |
| key2unity_auth_portal | mcp_key2unity_auth_portal | @agentstack/hosted-wire/activateSession |
| support_bot | mcp_bots_simulate | — |
| knowledge_assistant | mcp_knowledge_ingest | — |
| agency | mcp_crm_contact_deal | — |
| freelancer | mcp_hosted_vertical_bootstrap | — |
| content_site | mcp_hosting_quickstart | — |
<!-- END:AUTOGEN-ARCHETYPE-COMPACT -->

See `docs/ai/CONTEXT_FOR_AI.md` for channel order.
