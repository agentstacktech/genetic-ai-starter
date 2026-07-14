---
name: agentstack-recipe-run
description: Run numbered AgentStack SDK recipes (00–11) from examples/agentstack/ or kit extension. Use when validating install, TTFC, or learning canonical SDK/MCP patterns.
---

# AgentStack recipe run

**Genetic tag:** `repo.platform.sdk.recipes.gen1`

## When to use

- User asks to run bootstrap, verify SDK install, or "first call" to AgentStack
- After `agentstack-app` profile install
- CI smoke for consumer project

## Recipe index

| # | Folder | Action |
|---|--------|--------|
| 00 | `00-bootstrap` | Catalog, login, project scope |
| 01 | `01-discover-capabilities` | Capability matrix + MCP snapshot |
| 02 | `02-8dna-crud` | `dnaList` + `executeCommand` |
| 03 | `03-mcp-execute` | POST `/mcp` batch |
| 04–11 | commerce, economy, logic, hosting, … | Domain-specific |

## Steps

1. Locate recipes: `examples/agentstack/` (installed) or `tools/genetic-ai-starter/extensions/agentstack/recipes/`.
2. TypeScript: `cd examples/agentstack && npm install && npm run recipe:00-bootstrap`.
3. Python: `python examples/agentstack-python/00-bootstrap.py` (when `--lang python`).
4. Set env from `.env.example` — never commit secrets.
5. Read per-recipe `README.md` for required env vars.

## Language flag

Install with `--lang typescript` (default) or `--lang python` — copies TS or Python recipe folder.

## Done when

Recipe exits 0 with `✓` verification steps, or offline mode skips with documented env gaps.

## Related docs

- `examples/agentstack/SDK_ACQUISITION.md` — Flow A (npm) / B (submodule)
- Kit consumer guide: `tools/genetic-ai-starter/meta/docs/AGENTSTACK_APP_GUIDE.md` (submodule) or [GitHub](https://github.com/agentstacktech/genetic-ai-starter/blob/master/meta/docs/AGENTSTACK_APP_GUIDE.md)
- ROI model: [VALUE_AND_ROI_BY_PROJECT_SIZE.md](https://github.com/agentstacktech/genetic-ai-starter/blob/master/meta/docs/VALUE_AND_ROI_BY_PROJECT_SIZE.md)
