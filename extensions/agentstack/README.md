# AgentStack extension

**Genetic tag:** `repo.tooling.genetic_starter.agentstack_dx.gen1`  
**Consumer guide:** [meta/docs/AGENTSTACK_APP_GUIDE.md](../../meta/docs/AGENTSTACK_APP_GUIDE.md)  
**ROI:** [meta/docs/VALUE_AND_ROI_BY_PROJECT_SIZE.md](../../meta/docs/VALUE_AND_ROI_BY_PROJECT_SIZE.md)

Installed with `--with-agentstack`, profiles **`full`**, **`founder`**, or **`agentstack-app`** (recommended for platform consumers).

Adds MCP/8DNA routing context, SDK bootstrap, MCP template, integrator rules, and (with **`agentstack-app`**) runnable recipes.

## Overlays (copied to target)

| Artifact | Target path |
|----------|-------------|
| `overlay/CONTEXT_FOR_AI.md` | `docs/ai/CONTEXT_FOR_AI.md` |
| `overlay/capability-snapshot.json` | `docs/ai/agentstack-capability-snapshot.json` |
| `overlay/platform-vs-tenant-canary.mdc` | `.cursor/rules/platform-vs-tenant-canary.mdc` |
| `overlay/.cursor/rules/agentstack-sdk-first.mdc` | `.cursor/rules/agentstack-sdk-first.mdc` |
| `overlay/.cursor/mcp.json.template` | `.cursor/mcp.json.template` |
| `overlay/src/lib/agentstack.ts` | `src/lib/agentstack.ts` |
| `overlay/.env.example` | `.env.example` |
| `overlay/.devcontainer/devcontainer.json` | `.devcontainer/devcontainer.json` (agentstack-app) |

## Merge (appended)

| Artifact | Target path |
|----------|-------------|
| `merge/navigation-map.append.md` | `docs/ai/AI_NAVIGATION_MAP.md` |
| `merge/cursorrules.append.md` | `.cursorrules` (inside kit markers) |

## Recipes

| Profile | Recipes location |
|---------|------------------|
| **`agentstack-app`** | **`examples/agentstack/`** (or `examples/agentstack-python/` with `--lang python`) — npm-pinned `@agentstack/sdk` |
| `full` / `founder` / `--with-agentstack` | Kit subtree [`recipes/`](recipes/) only — not copied |

See [`recipes/AI_INDEX.md`](recipes/AI_INDEX.md) · [`recipes/SDK_ACQUISITION.md`](recipes/SDK_ACQUISITION.md).

## Quick start (agentstack-app)

```bash
node <kit>/scripts/install.mjs --target . --profile agentstack-app --strict
cd examples/agentstack && npm install @agentstack/sdk@0.4.13 && npm run recipe:00-bootstrap
```

1. Copy `.env.example` → `.env.local`; set `AGENTSTACK_PROJECT_ID`.
2. `/agentstack-init` in Cursor (MCP token).
3. `doctor.mjs` + `check-capability-contract.mjs --target .`.

**Flow B (SDK submodule):** `submodule-add-sdk.mjs` → `link-sdk-deps.mjs`.

## Preserve on upgrade

`extension.manifest.json` `preserveTargets`: customized `CONTEXT_FOR_AI.md`, `src/lib/agentstack.ts`, `.env.example`, `.cursor/mcp.json.template`.

`upgrade.mjs` refreshes overlays and recipes for `agentstack-app` lock profiles.

## Docs upstream

Canonical platform docs: [AgentStack monorepo](https://github.com/agentstacktech/AgentStack) — `docs/plugins/CONTEXT_FOR_AI.md`. This extension links; it does not fork platform genes.

**Capability snapshot (WCP / robot-ready):** `capability-snapshot.json` (and overlay twin) is a **static offline** MCP/SDK routing aid (`repo.platform.capability_contract.gen1`). Refresh from live `GET /mcp/actions` or `sdk.getCapabilityMatrix()` when the platform capability plane moves (Fabric descriptors, PTC, organelle.execute). It is **not** the SPA Discover manifest and **not** the public SEO `/api/discovery/public-manifest.json` — see monorepo [DISCOVERY_MANIFEST_DELTA.md](../../../docs/ecosystem/DISCOVERY_MANIFEST_DELTA.md). Keep `platformVersion` aligned with the consumer’s AgentStack line when you bump the kit.

**Profile matrix:** [meta/docs/PROFILE_COMPARISON.md](../../meta/docs/PROFILE_COMPARISON.md) · **AI index:** [AI_INDEX.md](AI_INDEX.md).
