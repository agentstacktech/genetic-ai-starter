# Gene — `repo.platform.capability_contract.gen1`

**Genetic tag:** `repo.platform.capability_contract.gen1`  
**Category:** repo / platform  
**Status:** ACTIVE

---

## Intent

**Drift contract** between four discoverability planes that must stay aligned for integrators, plugins, recipes, and AI agents:

1. **`sdk.getCapabilityMatrix()`** — client-side module enablement (`platform` + `domain` ids, `enabled` flags).
2. **`GET /mcp/actions`** — authoritative MCP action catalogue (canonical dotted `action` ids).
3. **`@agentstack/sdk` package exports** — `package.json` `exports` map and subpath facades (`/commerce/*`, `/economy`, `/manifest`, …).
4. **Kit docs** — `CONTEXT_FOR_AI.md`, `capability-snapshot.json`, recipe `gateCapability` tables, plugin skills linking to `CAPABILITY_MATRIX.md`.

**Acceptance target (DX expansion):** capability contract drift **0** — see `genetic-ai-starter/benchmarks/results/BASELINE_PRE_DX_EXPANSION.md`.

---

## Planes and owners

| Plane | Source of truth | Regenerator / check |
|-------|-----------------|---------------------|
| MCP actions | `mcp/` registry → `GET /mcp/actions` | [gen_capability_matrix.py](https://github.com/agentstacktech/AgentStack/tree/main/scripts/gen_capability_matrix.py) `--check` |
| Human/plugin matrix | [docs/plugins/CAPABILITY_MATRIX.md](https://github.com/agentstacktech/AgentStack/tree/main/docs/plugins/CAPABILITY_MATRIX.md) | Same script; CI fails on stale autogen block |
| SDK matrix | `AgentStackSDK.getCapabilityMatrix()` | [docs/SDK_AI_SURFACE.md](https://github.com/agentstacktech/AgentStack/tree/main/docs/SDK_AI_SURFACE.md); SDK tests + `check:docs-urls` |
| SDK exports | `agentstack-unified-sdk/packages/core/package.json` | Release checklist in [SDK_INTEGRATION_FLOWS.md](https://github.com/agentstacktech/AgentStack/tree/main/agentstack-unified-sdk/docs/SDK_INTEGRATION_FLOWS.md) Flow F |
| Kit offline snapshot | `extensions/agentstack/overlay/capability-snapshot.json` | Manual refresh when domains shift; note `generatedNote` in file |
| Recipe gates | `recipes/_lib/recipe-common.ts` `gateCapability` | Bump when matrix domain ids rename |

---

## Contract rules

1. **Action names** exist only in `GET /mcp/actions` (or in-process `MCP_TOOLS_REGISTRY`) — skills and genes **link**, never inline full tables (`repo.plugins.capability_routing.gen1`).
2. **Domain ids** in `getCapabilityMatrix().domain` must map to MCP domains documented in `CONTEXT_FOR_AI.md` — no parallel naming in kit overlay.
3. **SDK subpath** recipes (04–05, 08, 10) must match published `exports`; broken subpath = contract failure, not a recipe-only fix.
4. **Offline snapshot** is a **degraded-mode** copy for air-gapped editors — refresh after platform releases; live `GET /mcp/actions` wins when online.
5. **Channel correctness:** integrator code uses `sdk.protocol` / MCP envelope — not undocumented REST shortcuts when an action exists in the matrix.

---

## AI instructions

### Do

- Before adding a recipe or skill route, read **live** `GET /mcp/actions` or run `gen_capability_matrix.py` locally.
- When `mcp/` gains actions, regenerate `CAPABILITY_MATRIX.md` in the **same PR**.
- When SDK adds a module id, update `getCapabilityMatrix()` implementation **and** kit snapshot if the extension ships a static copy.
- Cite **`repo.platform.capability_contract.gen1`** in PRs that touch any plane in the table above.

### Do not

- Do **not** hand-edit autogen sentinels in `CAPABILITY_MATRIX.md`.
- Do **not** duplicate action parameter tables in `CONTEXT_FOR_AI.md` — domain rows only.
- Do **not** add recipe `gateCapability` strings that do not appear in matrix or MCP summary.

---

## Cross-links

- [repo.plugins.capability_routing.gen1.md](https://github.com/agentstacktech/AgentStack/tree/main/philosophy/genes/repo.plugins.capability_routing.gen1.md) — decision-first skills + matrix generator
- [repo.platform.sdk.unified.gen1.md](https://github.com/agentstacktech/AgentStack/tree/main/philosophy/genes/repo.platform.sdk.unified.gen1.md) — SDK integration umbrella
- [repo.platform.sdk.recipes.gen1.md](repo.platform.sdk.recipes.gen1.md) — recipe gates
- [repo.tooling.genetic_starter.agentstack_dx.gen1.md](repo.tooling.genetic_starter.agentstack_dx.gen1.md) — DX eval acceptance
- [mcp/AI_INDEX.md](https://github.com/agentstacktech/AgentStack/tree/main/agentstack-core/mcp/AI_INDEX.md) — MCP registry hot files
- [docs/MCP_CAPABILITY_MATRIX.md](https://github.com/agentstacktech/AgentStack/tree/main/docs/MCP_CAPABILITY_MATRIX.md) — human MCP overview
- [genetic-ai-starter/extensions/agentstack/overlay/capability-snapshot.json](../../../extensions/agentstack/overlay/capability-snapshot.json) — kit static snapshot
