# AgentStack extension — AI index

**Genetic tag:** `repo.tooling.genetic_starter.agentstack_extension.gen1`  
**Parent:** [genetic-ai-starter/AI_INDEX.md](../../AI_INDEX.md) · [docs/AI_NAVIGATION_MAP.md](https://github.com/agentstacktech/AgentStack/blob/master/docs/AI_NAVIGATION_MAP.md) (upstream)

Kit extension installed with `--with-agentstack` or profiles **`agentstack-app`** (recommended), **full**, **founder**. Overlays copy into the consumer project; **`agentstack-app`** also copies recipes to `examples/agentstack/`.

---

## Hot files

| Task | Path |
|------|------|
| Extension manifest | [extension.manifest.json](extension.manifest.json) |
| Capability routing (overlay) | [overlay/CONTEXT_FOR_AI.md](overlay/CONTEXT_FOR_AI.md) → `docs/ai/CONTEXT_FOR_AI.md` |
| Static MCP/SDK snapshot | [overlay/capability-snapshot.json](overlay/capability-snapshot.json) → `docs/ai/agentstack-capability-snapshot.json` (refresh note in README; ≠ Discover / public SEO manifest) |
| SDK bootstrap (overlay) | [overlay/src/lib/agentstack.ts](overlay/src/lib/agentstack.ts) → `src/lib/agentstack.ts` |
| Env template | [overlay/.env.example](overlay/.env.example) → `.env.example` |
| MCP config template | [overlay/.cursor/mcp.json.template](overlay/.cursor/mcp.json.template) → `.cursor/mcp.json.template` |
| SDK-first Cursor rule | [overlay/.cursor/rules/agentstack-sdk-first.mdc](overlay/.cursor/rules/agentstack-sdk-first.mdc) |
| Tenant canary rule | [overlay/platform-vs-tenant-canary.mdc](overlay/platform-vs-tenant-canary.mdc) |
| Navigation map append | [merge/navigation-map.append.md](merge/navigation-map.append.md) |
| Cursorrules append | [merge/cursorrules.append.md](merge/cursorrules.append.md) |
| Runnable recipes | [recipes/AI_INDEX.md](recipes/AI_INDEX.md) |
| Meta doc | [meta/docs/AGENTSTACK_EXTENSION.md](../../meta/docs/AGENTSTACK_EXTENSION.md) |
| Consumer guide | [meta/docs/AGENTSTACK_APP_GUIDE.md](../../meta/docs/AGENTSTACK_APP_GUIDE.md) |
| ROI by team size | [meta/docs/VALUE_AND_ROI_BY_PROJECT_SIZE.md](../../meta/docs/VALUE_AND_ROI_BY_PROJECT_SIZE.md) |

---

## Genetic tags (this extension)

| Tag | Role |
|-----|------|
| `repo.tooling.genetic_starter.agentstack_dx.gen1` | DX umbrella (recipes, MCP template, evals, scaffolder) |
| `repo.plugins.capability_routing.gen1` | MCP / domain intent map |
| `repo.platform.sdk.onboarding.gen1` | Bootstrap, env, MCP template |
| `repo.platform.sdk.recipes.gen1` | Runnable TypeScript recipes 00–11 |
| `repo.platform.capability_contract.gen1` | Matrix / MCP / SDK / kit snapshot drift |
| `repo.tooling.gene_lifecycle.gen1` | Gen bump policy + validate-genes |
| `repo.platform.sdk.agent_protocol.gen1` | `sdk.protocol` channel preference |
| `core.mcp.tools.gen1` | MCP streamable-http surface |
| `shared.dna.unified.gen1` | 8DNA KV + robot-ready snapshots |

---

## Sideways links

- Upstream capability map: [docs/plugins/CONTEXT_FOR_AI.md](https://github.com/agentstacktech/AgentStack/blob/master/docs/plugins/CONTEXT_FOR_AI.md)
- Cursor plugin MCP: [provided_plugins/cursor-plugin/mcp.json](https://github.com/agentstacktech/AgentStack/blob/master/provided_plugins/cursor-plugin/mcp.json)
- SDK integrator guide: [agentstack-unified-sdk/docs/AI_INTEGRATOR_GUIDE.md](https://github.com/agentstacktech/AgentStack/blob/master/agentstack-unified-sdk/docs/AI_INTEGRATOR_GUIDE.md)
- Install merge: [merge/install-merge.json](merge/install-merge.json)

---

## Maintenance

When AgentStack MCP domains or `@agentstack/sdk` exports change: refresh [overlay/capability-snapshot.json](overlay/capability-snapshot.json), bump `requiresKit` / recipe SDK pin, update [overlay/CONTEXT_FOR_AI.md](overlay/CONTEXT_FOR_AI.md) domain table excerpt only — link upstream for full matrix.
