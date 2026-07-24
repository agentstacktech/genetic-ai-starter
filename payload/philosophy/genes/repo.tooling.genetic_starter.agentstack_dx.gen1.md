# Gene — `repo.tooling.genetic_starter.agentstack_dx.gen1`

**Genetic tag:** `repo.tooling.genetic_starter.agentstack_dx.gen1`  
**Category:** repo / tooling  
**Status:** ACTIVE  
**Platform version:** tracks `AGENTSTACK_CORE_VERSION` — see `genetic-ai-starter/VERSION.md`

---

## Intent

Umbrella for the **AgentStack Starter DX expansion** — everything that helps integrators and AI agents go from kit install to a correct first SDK/MCP/8DNA call without reading the whole monorepo. Covers the **`agentstack` kit extension**, runnable recipes, gene scaffolder, benchmark evals, MCP config template, and devcontainer bootstrap.

This gene sits **above** `repo.tooling.genetic_starter.gen1` (Navigation OS) and **beside** `repo.tooling.genetic_starter.integration.gen1` (transport). Read integration first for submodule/install; read this gene for **develop-on-AgentStack** surfaces.

---

## Navigation OS + DX layers (L0–L5)

| Layer | Artifact | AgentStack DX |
|-------|----------|---------------|
| **L0** | Genetic tags | `repo.tooling.genetic_starter.agentstack_dx.gen1`, `repo.platform.sdk.onboarding.gen1`, `repo.platform.sdk.recipes.gen1`, `repo.platform.capability_contract.gen1` |
| **L1** | `docs/ai/AI_NAVIGATION_MAP.md` | Append via `extensions/agentstack/merge/navigation-map.append.md` |
| **L2** | `**/AI_INDEX.md` | `extensions/agentstack/AI_INDEX.md`, `extensions/agentstack/recipes/AI_INDEX.md` |
| **L3** | `philosophy/genes/` | This cluster + `GENE_COMPRESSION_MAP.md` § Cluster Kit |
| **L4** | Cursor rules / MCP | `overlay/.cursor/rules/agentstack-sdk-first.mdc`, `.cursor/mcp.json.template`, plugin `/agentstack-init` |
| **L5** | Lock, doctor, evals | `.genetic-ai/kit.lock.json`, `doctor.mjs`, `benchmarks/tasks/tasks.json` (`substrate: agentstack`), recipe `npm run recipe:*` |

---

## DX surfaces (hot paths)

| Surface | Location | Role |
|---------|----------|------|
| **Extension** | `genetic-ai-starter/extensions/agentstack/` | Overlays, merge, recipes subtree |
| **Recipes 00–11** | `extensions/agentstack/recipes/` | Runnable TypeScript; gene `repo.platform.sdk.recipes.gen1` |
| **Onboarding path** | Plugin → SDK → protocol → MCP → 8DNA | Gene `repo.platform.sdk.onboarding.gen1` |
| **Capability contract** | Matrix + `/mcp/actions` + kit snapshot | Gene `repo.platform.capability_contract.gen1` |
| **Gene scaffolder** | `genetic-ai-starter/scripts/new-gene.mjs` | Domain / subsystem / ADR genes from templates |
| **Gene validation** | `genetic-ai-starter/scripts/validate-genes.mjs` | Payload gene section grammar; gene `repo.tooling.gene_lifecycle.gen1` |
| **MCP template** | `extensions/agentstack/overlay/.cursor/mcp.json.template` | Bearer from `/agentstack-init` → `~/.cursor/mcp.json` |
| **Devcontainer** | `genetic-ai-starter/docs/snippets/devcontainer-genetic-ai-starter.md` | `postCreateCommand` + submodule bootstrap |
| **Benchmark evals** | `genetic-ai-starter/benchmarks/` | Shop harness + `substrate: agentstack` tasks; baseline `benchmarks/results/BASELINE_PRE_DX_EXPANSION.md` |

**Profiles:** `full`, `founder`, **`agentstack-app`** — see `KIT_MANIFEST.json` and `meta/docs/PROFILE_COMPARISON.md`.

---

## AI instructions

1. **Install:** `--with-agentstack` or profile `agentstack-app` — do not hand-copy `overlay/` without `install.mjs` merge semantics.
2. **First SDK call:** run recipe `00-bootstrap` or import `src/lib/agentstack.ts` overlay — target TTFC ≤ one recipe run.
3. **Channel order:** discover (`getModuleCatalog`, `getCapabilityMatrix`) → gate optional domains → `sdk.protocol` / `sdk.platform` → MCP `agentstack.execute` → 8DNA `executeCommand` — see `repo.platform.sdk.onboarding.gen1`.
4. **Drift:** when MCP domains or SDK exports change, refresh `capability-snapshot.json`, regenerate `CAPABILITY_MATRIX.md`, bump recipe SDK pin — see `repo.platform.capability_contract.gen1`.
5. **New project genes:** use `new-gene.mjs`; bump generation only per `repo.tooling.gene_lifecycle.gen1`.

---

## Cross-links

- [genetic-ai-starter/extensions/agentstack/AI_INDEX.md](../../../extensions/agentstack/AI_INDEX.md) — extension hot files
- [genetic-ai-starter/extensions/agentstack/README.md](../../../extensions/agentstack/README.md) — overlays + quick start
- [genetic-ai-starter/meta/docs/AGENTSTACK_APP_GUIDE.md](../../../meta/docs/AGENTSTACK_APP_GUIDE.md) — consumer install flow A/B
- [genetic-ai-starter/meta/docs/VALUE_AND_ROI_BY_PROJECT_SIZE.md](../../../meta/docs/VALUE_AND_ROI_BY_PROJECT_SIZE.md) — modeled $ savings by team size
- [repo.tooling.genetic_starter.gen1.md](repo.tooling.genetic_starter.gen1.md) — kit Navigation OS parent
- [repo.tooling.genetic_starter.integration.gen1.md](repo.tooling.genetic_starter.integration.gen1.md) — submodule / bootstrap transport
- [repo.platform.sdk.onboarding.gen1.md](repo.platform.sdk.onboarding.gen1.md) — develop-on-AgentStack path
- [repo.platform.sdk.recipes.gen1.md](repo.platform.sdk.recipes.gen1.md) — recipes 00–11 index
- [repo.platform.capability_contract.gen1.md](repo.platform.capability_contract.gen1.md) — matrix / MCP / SDK drift contract
- [repo.tooling.gene_lifecycle.gen1.md](repo.tooling.gene_lifecycle.gen1.md) — gen bump + validate-genes
- [docs/AI_NAVIGATION_MAP.md](../../docs/ai/AI_NAVIGATION_MAP.md) — Tier 0 kit row + extension append
