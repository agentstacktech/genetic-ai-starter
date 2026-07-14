---
name: agentstack-sdk-bootstrap
description: Bootstrap AgentStack SDK in a consumer project — shared client, catalog, login, project scope. Use when wiring @agentstack/sdk, src/lib/agentstack.ts, or first REST/MCP call.
---

# AgentStack SDK bootstrap

**Genetic tag:** `repo.platform.sdk.onboarding.gen1`

## When to use

- User asks to integrate AgentStack, add SDK, or wire API keys
- Task needs `AgentStackSDK`, project scope, or capability matrix
- Before any tenant-scoped write or MCP batch

## Steps

1. Read `docs/ai/CONTEXT_FOR_AI.md` and `docs/ai/agentstack-capability-snapshot.json`.
2. Confirm bootstrap file: `src/lib/agentstack.ts` (from kit overlay) — single shared `AgentStackSDK` instance.
3. Copy `.env.example` → `.env.local`; set `AGENTSTACK_API_BASE`, `AGENTSTACK_PROJECT_ID`, and `AGENTSTACK_API_KEY` or session creds.
4. Run recipe `examples/agentstack/00-bootstrap/` (or kit `extensions/agentstack/recipes/00-bootstrap/`).
5. Call `sdk.getModuleCatalog()` and `sdk.getCapabilityMatrix()` before feature work.
6. Gate writes with `ensureScope()` / `assertProjectIdConfigured()`.

## Channel order

1. MCP `agentstack.execute`
2. `sdk.protocol` / `sdk.platform`
3. 8DNA KV (last resort)

## Do not

- Do not create multiple SDK singletons.
- Do not use `sdk.admin` in integrator apps.
- Do not commit secrets.

## Done when

Catalog prints modules, project scope is pinned, and capability matrix is available for gating.
