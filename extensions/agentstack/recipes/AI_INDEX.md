# AgentStack SDK recipes — AI index

**Genetic tag:** `repo.platform.sdk.recipes.gen1`  
**Package:** `genetic-ai-starter/extensions/agentstack/recipes/`  
**SDK pin:** `@agentstack/sdk@0.4.15`

Runnable TypeScript templates for integrators and AI agents. Each folder has `run.ts`, `README.md`, and `README_ru.md`.

## Hot files

| File | Role |
|------|------|
| `package.json` | SDK pin + `recipe:*` scripts |
| `tsconfig.json` | Strict NodeNext typecheck |
| `_lib/recipe-common.ts` | `gateCapability`, `ensureScope`, `withRetry`, `verifyStep` |
| `SDK_ACQUISITION.md` | Flow A npm / Flow B submodule (no auto-install) |

## Recipe map

| Id | Folder | Surface | Gate capability |
|----|--------|---------|-----------------|
| 00 | `00-bootstrap/` | SDK init, login, projects, scope | — |
| 01 | `01-discover-capabilities/` | `getModuleCatalog`, `getCapabilityMatrix`, `/mcp/actions` | — |
| 02 | `02-8dna-crud/` | `sdk.protocol.dnaList`, `executeCommand`, snapshots | `protocol` |
| 03 | `03-mcp-execute/` | `agentstack.execute` JSON-RPC batch via `POST /mcp` | `mcp:execute` (token) |
| 04 | `04-commerce/` | `@agentstack/sdk/commerce` facade discovery | `commerce.*` |
| 05 | `05-economy/` | `@agentstack/sdk/economy` balance read | `economy` |
| 06 | `06-logic/` | MCP `logic.dry_run` | `logic` |
| 07 | `07-hosting/` | `sdk.hosting.quickStart` | `hosting` (domain) |
| 08 | `08-capability-task/` | `runTaskCapability` | tasks catalog |
| 09 | `09-rag/` | MCP `rag.search` | RAG tier |
| 10 | `10-uam-app/` | UAM manifest (`@agentstack/sdk/manifest`) | — |
| 11 | `11-integration-webhook/` | MCP `webhooks.register` | `webhooks` |

## Run

```bash
npm run recipe:<folder-name-without-path>
# e.g. npm run recipe:00-bootstrap
```

## Sideways links

- Monorepo SDK index: `agentstack-unified-sdk/AI_INDEX.md`
- MCP capability matrix: `docs/plugins/CAPABILITY_MATRIX.md`
- Kit extension: `genetic-ai-starter/extensions/agentstack/README.md`
- Navigation map row: append via `extensions/agentstack/merge/navigation-map.append.md`

## Maintenance

When SDK surface changes: bump pin in `package.json`, update affected `run.ts` + README pair, refresh this table.
