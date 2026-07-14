# AgentStack extension

**Genetic tag:** `repo.tooling.genetic_starter.agentstack_dx.gen1`  
**Consumer guide:** [AGENTSTACK_APP_GUIDE.md](AGENTSTACK_APP_GUIDE.md) · [RU](AGENTSTACK_APP_GUIDE_ru.md)  
**ROI:** [VALUE_AND_ROI_BY_PROJECT_SIZE.md](VALUE_AND_ROI_BY_PROJECT_SIZE.md)

Enable with `--with-agentstack` or profiles **`full`**, **`founder`**, **`agentstack-app`** (recommended for SDK/MCP consumers).

## Contents

| Artifact | Purpose |
|----------|---------|
| `CONTEXT_FOR_AI.md` | MCP / 8DNA domain routing (excerpt) |
| `agentstack-sdk-first.mdc` | sdk.protocol, scope guards, no sdk.admin |
| `mcp.json.template` | `${AGENTSTACK_ACCESS_TOKEN}` — plugin is token SoT |
| `src/lib/agentstack.ts` | Bootstrap: catalog, capabilities, ensureScope |
| `capability-snapshot.json` | Offline contract for CI |
| Recipes (`agentstack-app`) | `examples/agentstack/` 00–11 |

## When to use

- Product **on** AgentStack (SDK, MCP, 8DNA) → profile **`agentstack-app`**
- Need capability routing (`GET /mcp/actions`) in agent context
- Want runnable recipes + `check-capability-contract` in CI

## When not to use

- Generic OSS with no AgentStack dependency — **standard** only

## Install

```bash
node <kit>/scripts/install.mjs --target . --profile agentstack-app --strict
```

See [INSTALL.md](INSTALL.md) · [extensions/agentstack/README.md](../../extensions/agentstack/README.md).

## Version pin

`extensions/agentstack/extension.manifest.json` `requiresKit` and `requiresPlatformVersion` align with `AGENTSTACK_CORE_VERSION`. Lock fields: `recipeSetVersion`, `capabilitySnapshotHash`.

Canonical docs live in the AgentStack monorepo; extension links are pointers, not forks.
