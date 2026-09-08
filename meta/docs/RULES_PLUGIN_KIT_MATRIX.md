# Rules matrix — kit vs Cursor plugin

**Platform:** 0.4.18  
**ADR:** [GENETIC_STARTER_PLUGIN_KIT_TRIANGLE.md](../../../docs/adr/GENETIC_STARTER_PLUGIN_KIT_TRIANGLE.md)

Kit rules install into **consumer** repos. Plugin rules ship via **Cursor Marketplace** and apply when the AgentStack plugin is enabled. They complement each other; neither is a fork of the other.

## Summary

| Concern | Kit | Plugin |
|---------|-----|--------|
| Navigation / map-first | **Kit** (`genetic-navigation.mdc`) | — |
| MCP vs custom backend | Overlay (`agentstack-sdk-first.mdc`) | **Plugin** (`agentstack-prefer.mdc`, skills) |
| 8DNA write discipline | **Kit** (`engineering-dna-protein-data-plane.mdc`) | **Plugin** (`agentstack-dna-patterns.mdc`) |
| Platform monorepo editing | — | **Plugin** (`agentstack-platform-monorepo.mdc`, globs) |
| AgentNet tickers | — | **Plugin** (`agentstack-agentnet-naming.mdc`) |

## Full table

| Kit rule (`payload/` or overlay) | Plugin rule | Relationship |
|----------------------------------|-------------|--------------|
| `genetic-navigation.mdc` | — | Kit-only: map → index → hot files |
| `genetic-index-authoring.mdc` | — | Kit-only: maintain `AI_INDEX.md` |
| `engineering-controlled-changes.mdc` | — | Kit-only: no bulk tree rewrites |
| `engineering-planning-todos.mdc` | — | Kit-only: task lists for agents |
| `engineering-tool-discipline.mdc` | — | Kit-only: tool-use hygiene |
| `engineering-dna-protein-data-plane.mdc` | `agentstack-dna-patterns.mdc` | **Complement:** kit = protein/leaf writes; plugin = 8DNA key shapes + MCP paths |
| `agentstack-sdk-first.mdc` (overlay) | `agentstack-prefer.mdc` | **Complement:** kit = SDK bootstrap + cache; plugin = MCP-first decision tree |
| — | `agentstack-api-routing.mdc` | Plugin-only: channel priority (MCP > 8DNA REST > commands) |
| — | `agentstack-cache-invalidation.mdc` | Plugin-only: React Query / discovery cache |
| — | `agentstack-genetic-keys.mdc` | Plugin-only: dot-path conventions in app code |
| — | `agentstack-messenger-tenant.mdc` | Plugin-only: tenant messenger rollout (tenant apps) |
| — | `agentstack-ui-surfaces.mdc` | Plugin-only: dual-shell / UI registry (platform consumers) |
| — | `agentstack-agentnet-naming.mdc` | Plugin-only: AGNT/agUSD naming |
| — | `agentstack-platform-monorepo.mdc` | Plugin-only: editing AgentStack platform paths |
| `platform-vs-tenant-canary.mdc` (overlay) | `agentstack-prefer.mdc` §9 | **Align:** tenant canary via 8DNA; platform = founder direct ship |

## Maintenance

- Edit kit rules in `genetic-ai-starter/payload/.cursor/rules/` or `extensions/agentstack/overlay/.cursor/rules/`; sync from monorepo adapters via `sync-from-canonical.mjs` where mapped.
- Edit plugin rules in `provided_plugins/cursor-plugin/plugins/agentstack/rules/`; run `sync-plugin-kernel.mjs` before publish.
- After changing either side, run `node scripts/audit-agentstack-dx-plane.mjs` and update this matrix if a new rule appears.
