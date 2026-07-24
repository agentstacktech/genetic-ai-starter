# Gene — `repo.platform.sdk.recipes.gen1`

**Genetic tag:** `repo.platform.sdk.recipes.gen1`  
**Category:** repo / platform / sdk  
**Status:** ACTIVE

---

## Intent

Index and maintenance contract for **runnable TypeScript recipes 00–11** under `genetic-ai-starter/extensions/agentstack/recipes/`. Each recipe is a minimal, verifiable integrator script (`run.ts` + README pair) that teaches one SDK/MCP/8DNA surface without importing the whole monorepo.

Recipes are **kit subtree artifacts** — not copied to consumer installs; run from the vendored kit path or clone.

---

## Hot files

| File | Role |
|------|------|
| [recipes/AI_INDEX.md](../../../extensions/agentstack/recipes/AI_INDEX.md) | Machine + human recipe map |
| [recipes/package.json](../../../extensions/agentstack/recipes/package.json) | SDK pin + `recipe:*` scripts |
| [recipes/_lib/recipe-common.ts](../../../extensions/agentstack/recipes/_lib/recipe-common.ts) | `gateCapability`, `ensureScope`, `withRetry`, `verifyStep` |
| [recipes/SDK_ACQUISITION.md](../../../extensions/agentstack/recipes/SDK_ACQUISITION.md) | Flow A npm / Flow B submodule |

---

## Recipe index (00–11)

| Id | Folder | Surface | Gate |
|----|--------|---------|------|
| **00** | `00-bootstrap/` | SDK init, login, projects, scope | — |
| **01** | `01-discover-capabilities/` | `getModuleCatalog`, `getCapabilityMatrix`, `GET /mcp/actions` | — |
| **02** | `02-8dna-crud/` | `sdk.protocol.dnaList`, `executeCommand`, snapshots | `protocol` |
| **03** | `03-mcp-execute/` | `agentstack.execute` via `POST /mcp` | token (`AGENTSTACK_API_KEY`) |
| **04** | `04-commerce/` | `@agentstack/sdk/commerce` facade | `commerce.*` |
| **05** | `05-economy/` | `@agentstack/sdk/economy` balance read | `economy` |
| **06** | `06-logic/` | MCP `logic.dry_run` | `logic` |
| **07** | `07-hosting/` | `sdk.hosting.quickStart` | `hosting` (domain) |
| **08** | `08-capability-task/` | `runTaskCapability` | tasks catalog |
| **09** | `09-rag/` | MCP `rag.search` | RAG tier |
| **10** | `10-uam-app/` | UAM manifest (`@agentstack/sdk/manifest`) | — |
| **11** | `11-integration-webhook/` | MCP `webhooks.register` | `webhooks` |

```bash
cd genetic-ai-starter/extensions/agentstack/recipes
npm install
npm run recipe:00-bootstrap
```

---

## AI instructions

1. **TTFC target:** consumer install → first successful SDK call in **≤ one recipe run** (`00-bootstrap`).
2. Before optional modules, call **`gateCapability`** / `getCapabilityMatrix()` — recipes 04–09 assume gated domains.
3. MCP recipes use the same Bearer contract as Cursor plugin MCP — not the integrator API key alone unless documented in recipe README.
4. When `@agentstack/sdk` surface changes: bump pin in `package.json`, update affected `run.ts` + README/README_ru pair, refresh [recipes/AI_INDEX.md](../../../extensions/agentstack/recipes/AI_INDEX.md) table.
5. Link upstream docs for full signatures — recipes stay short; matrix stays in `docs/plugins/CAPABILITY_MATRIX.md`.

---

## Cross-links

- [repo.platform.sdk.onboarding.gen1.md](repo.platform.sdk.onboarding.gen1.md) — full onboarding pipeline
- [repo.platform.capability_contract.gen1.md](repo.platform.capability_contract.gen1.md) — matrix / MCP drift checks
- [repo.tooling.genetic_starter.agentstack_dx.gen1.md](repo.tooling.genetic_starter.agentstack_dx.gen1.md) — DX umbrella
- [agentstack-unified-sdk/AI_INDEX.md](https://github.com/agentstacktech/AgentStack/tree/main/agentstack-unified-sdk/AI_INDEX.md) — SDK package map
- [docs/plugins/CAPABILITY_MATRIX.md](https://github.com/agentstacktech/AgentStack/tree/main/docs/plugins/CAPABILITY_MATRIX.md) — generated action catalogue
- [repo.plugins.capability_routing.gen1.md](https://github.com/agentstacktech/AgentStack/tree/main/philosophy/genes/repo.plugins.capability_routing.gen1.md) — decision-first routing to this matrix
