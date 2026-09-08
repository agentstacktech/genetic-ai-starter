# Dev Test Atlas — pointer (kit consumers)

**Genetic tag:** `repo.engineering.dev_test_atlas.gen1`

AgentStack platform CI uses scoped test slices (`npm run test:scope -- --gene <tag>`). Consumer repos typically run kit `doctor.mjs` / `validate-installed.mjs` instead of the full atlas.

| SoT | Location |
|-----|----------|
| **Authoritative** | AgentStack monorepo `docs/testing/AI_INDEX.md` + `docs/testing/catalog/dev_test_atlas_catalog.json` |
| **Kit maintainer smoke** | `node <kit>/scripts/sync-smoke.mjs` (monorepo) or `npm run sync-smoke` inside kit |

Upstream index: https://github.com/agentstacktech/AgentStack/blob/master/docs/testing/AI_INDEX.md
