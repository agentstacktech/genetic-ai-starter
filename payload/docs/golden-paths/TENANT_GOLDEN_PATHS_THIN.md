# Tenant golden paths (thin)

**Genetic tag:** `docs.golden_paths.tenant.gen1`

Portable summary for agents building on AgentStack. Full hub: platform repo `docs/golden-paths/TENANT_GOLDEN_PATHS.md`.

## Decision tree

| Change type | Path |
|-------------|------|
| Platform substrate (core, nginx, migrations) | Deploy preset — **not** tenant DNA |
| Tenant 8DNA (knowledge, bots, config) | Safe cycle: `agentstack_safe_project_cycle` → domain MCP → verify → `generation.promote` · mentor heal: `agentstack_tenant_ops_mcp_first` |
| Hosted static bytes `/s/{pid}/` | `hosting.*` MCP / publish scripts |
| Showcase archetype | `showcase_bootstrap` + snapshot rollback |

## Three PID planes

| Plane | PID | Rule |
|-------|-----|------|
| Ecosystem / finances | **1** | Platform services, default JWT context |
| Tenant flagship | **1444** Unity · **1472** EDITFLOW | 8DNA via generation supply only |
| Showcase | **1438** ArcaneStack | `is_platform_showcase` — guest proof apps |

**Never:** patch prod tenant DNA from deploy scripts. **Never:** conflate pid=1 with tenant flagship scope.

## Archetype quick links

| Archetype | Client | Data path |
|-----------|--------|-----------|
| Platform SPA | `agentstack-frontend` | `useSDKQuery` + write contours |
| EDITFLOW | `hosted-vertical/` | `tenantRest` — not browser MCP |
| Unity mentor | Platform shell + bots | MCP + generation supply |
| ArcaneStack | Consumer Vite SPA | `sdk.protocol` + FAP cells |

## Anti-patterns

- MCP from browser UI → use SDK
- `getSDKInstance()` in React → `useSDK()`
- Invented query keys → module `*QueryKeys.ts`
- Prod `dna_set_*` without `env_uuid` → generation fork first
