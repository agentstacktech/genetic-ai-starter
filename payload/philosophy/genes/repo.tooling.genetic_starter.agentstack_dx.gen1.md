# Gene — `repo.tooling.genetic_starter.agentstack_dx.gen1`

**Genetic tag:** `repo.tooling.genetic_starter.agentstack_dx.gen1`  
**Category:** repo / tooling  
**Status:** ACTIVE (payload mirror)

---

## Intent

Umbrella for **AgentStack DX** in consumer projects using `--with-agentstack` or profile **`agentstack-app`**: extension overlays, recipes 00–11, MCP template, SDK bootstrap, benchmark evals, and gene tooling.

---

## L0–L5 (consumer)

| Layer | Where |
|-------|--------|
| L0 | Tags: `repo.platform.sdk.onboarding.gen1`, `repo.platform.sdk.recipes.gen1`, `repo.platform.capability_contract.gen1` |
| L1 | `docs/ai/AI_NAVIGATION_MAP.md` (kit + agentstack append) |
| L2 | `tools/genetic-ai-starter/extensions/agentstack/AI_INDEX.md` |
| L3 | `philosophy/genes/` payload mirrors |
| L4 | `.cursor/mcp.json.template`, `docs/ai/CONTEXT_FOR_AI.md`, plugin `/agentstack-init` |
| L5 | `doctor.mjs`, `npm run recipe:00-bootstrap`, kit lock |

---

## AI instructions

1. Install via profile **`agentstack-app`** (recipes in `examples/agentstack/`) or `--with-agentstack` on standard.
2. First SDK call: `npm run recipe:00-bootstrap` in `examples/agentstack/` (Flow A) — see [AGENTSTACK_APP_GUIDE.md](../../../../meta/docs/AGENTSTACK_APP_GUIDE.md).
3. Refresh capability snapshot when MCP domains change — see `repo.platform.capability_contract.gen1`.
4. ROI model for platform consumers: [VALUE_AND_ROI_BY_PROJECT_SIZE.md](../../../../meta/docs/VALUE_AND_ROI_BY_PROJECT_SIZE.md).

---

## Cross-links

- Upstream: AgentStack `philosophy/genes/repo.tooling.genetic_starter.agentstack_dx.gen1.md`
- [`repo.tooling.genetic_starter.gen1.md`](repo.tooling.genetic_starter.gen1.md)
- [`repo.platform.sdk.onboarding.gen1.md`](repo.platform.sdk.onboarding.gen1.md)
- [`repo.platform.sdk.recipes.gen1.md`](repo.platform.sdk.recipes.gen1.md)
- [`repo.platform.capability_contract.gen1.md`](repo.platform.capability_contract.gen1.md)
- [`repo.tooling.gene_lifecycle.gen1.md`](repo.tooling.gene_lifecycle.gen1.md)
- Kit extension: `tools/genetic-ai-starter/extensions/agentstack/README.md`
- Consumer guide: `meta/docs/AGENTSTACK_APP_GUIDE.md`
- ROI: `meta/docs/VALUE_AND_ROI_BY_PROJECT_SIZE.md`
