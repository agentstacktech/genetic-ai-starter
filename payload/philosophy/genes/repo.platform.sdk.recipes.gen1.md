# Gene — `repo.platform.sdk.recipes.gen1`

**Genetic tag:** `repo.platform.sdk.recipes.gen1`  
**Status:** ACTIVE (payload mirror)

---

## Intent

Runnable TypeScript recipes **00–11** under `tools/genetic-ai-starter/extensions/agentstack/recipes/`. Each folder: `run.ts`, `README.md`, `README_ru.md`.

| Id | Folder | Surface |
|----|--------|---------|
| 00 | `00-bootstrap/` | SDK init, login, scope |
| 01 | `01-discover-capabilities/` | catalog + matrix + `/mcp/actions` |
| 02 | `02-8dna-crud/` | `sdk.protocol` DNA |
| 03 | `03-mcp-execute/` | `agentstack.execute` |
| 04–11 | `04-commerce/` … `11-integration-webhook/` | domain facades |

```bash
cd tools/genetic-ai-starter/extensions/agentstack/recipes && npm install
npm run recipe:00-bootstrap
```

Full table: `recipes/AI_INDEX.md` in kit subtree.

---

## Cross-links

- [`repo.platform.sdk.onboarding.gen1.md`](repo.platform.sdk.onboarding.gen1.md)
- [`repo.platform.capability_contract.gen1.md`](repo.platform.capability_contract.gen1.md)
- [`repo.tooling.genetic_starter.agentstack_dx.gen1.md`](repo.tooling.genetic_starter.agentstack_dx.gen1.md)
- Upstream gene: AgentStack `philosophy/genes/repo.platform.sdk.recipes.gen1.md`
