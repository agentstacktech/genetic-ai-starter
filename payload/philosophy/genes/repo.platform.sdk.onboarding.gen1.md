# Gene — `repo.platform.sdk.onboarding.gen1`

**Genetic tag:** `repo.platform.sdk.onboarding.gen1`  
**Status:** ACTIVE (payload mirror)

---

## Intent

**Develop-on-AgentStack** path in consumer repos: plugin init → `@agentstack/sdk` → discover → `sdk.protocol` → MCP → 8DNA.

---

## Pipeline

1. `/agentstack-init` — Device Code → Bearer in `~/.cursor/mcp.json`
2. `npm install @agentstack/sdk` — see kit `recipes/SDK_ACQUISITION.md`
3. `getModuleCatalog()` + `getCapabilityMatrix()`
4. `sdk.platform` / `sdk.protocol` for app code; `POST /mcp` for agent batches
5. `executeCommand` / DNA KV for project data

Canonical AI docs: [agentstack-unified-sdk/AGENTS.md](https://github.com/agentstacktech/AgentStack/blob/master/agentstack-unified-sdk/AGENTS.md) · [SDK_INTEGRATION_FLOWS.md](https://github.com/agentstacktech/AgentStack/blob/master/agentstack-unified-sdk/docs/SDK_INTEGRATION_FLOWS.md)

---

## Cross-links

- [`repo.platform.sdk.recipes.gen1.md`](repo.platform.sdk.recipes.gen1.md)
- [`repo.platform.capability_contract.gen1.md`](repo.platform.capability_contract.gen1.md)
- [`repo.tooling.genetic_starter.agentstack_dx.gen1.md`](repo.tooling.genetic_starter.agentstack_dx.gen1.md)
- Consumer overlay: `docs/ai/CONTEXT_FOR_AI.md`
- Bootstrap: `src/lib/agentstack.ts`
