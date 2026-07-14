# Gene — `repo.platform.capability_contract.gen1`

**Genetic tag:** `repo.platform.capability_contract.gen1`  
**Status:** ACTIVE (payload mirror)

---

## Intent

Keep **four planes** aligned — zero drift target:

1. `sdk.getCapabilityMatrix()`
2. `GET /mcp/actions`
3. `@agentstack/sdk` `package.json` exports
4. Kit docs: `docs/ai/CONTEXT_FOR_AI.md`, `docs/ai/agentstack-capability-snapshot.json`, recipe gates

Regenerate upstream matrix: `python agentstack-core/scripts/gen_capability_matrix.py --check` (monorepo). Refresh kit snapshot when domains change.

---

## Cross-links

- [`repo.platform.sdk.recipes.gen1.md`](repo.platform.sdk.recipes.gen1.md)
- [`repo.tooling.genetic_starter.agentstack_dx.gen1.md`](repo.tooling.genetic_starter.agentstack_dx.gen1.md)
- Upstream: [CAPABILITY_MATRIX.md](https://github.com/agentstacktech/AgentStack/blob/master/docs/plugins/CAPABILITY_MATRIX.md)
- Live catalog: `GET https://agentstack.tech/mcp/actions`
