# Maintainers — Genetic AI Starter Kit

Kit path: `genetic-ai-starter/` in AgentStack monorepo. Platform line **0.4.13**.

**Operator docs (monorepo git only, outside kit subtree):** [docs/genetic-ai-starter-maintainers/README.md](../docs/genetic-ai-starter-maintainers/README.md)

## Release checklist (platform bump)

1. Bump `AGENTSTACK_CORE_VERSION` in `shared/constants.py`
2. `node genetic-ai-starter/scripts/sync-kit-version.mjs`
3. `node genetic-ai-starter/scripts/sync-from-canonical.mjs` (DX genes + CONTEXT excerpt when present)
4. Refresh `extensions/agentstack/capability-snapshot.json` if SDK exports or MCP catalog changed (`check-capability-contract.mjs --refresh`)
5. `node genetic-ai-starter/scripts/validate-kit.mjs`
6. `node genetic-ai-starter/scripts/validate-genes.mjs`
7. `node genetic-ai-starter/scripts/check-capability-contract.mjs`
8. `node genetic-ai-starter/tests/recipe-typecheck.test.mjs`
9. `node genetic-ai-starter/tests/agentstack-consumer-flow.test.mjs`
10. `node genetic-ai-starter/scripts/build-doc-search-index.mjs`
11. `node genetic-ai-starter/tests/install.test.mjs`
10. `node genetic-ai-starter/tests/verify-temp-install.test.mjs`
11. `node genetic-ai-starter/tests/standalone-kit-install.test.mjs`
12. `node genetic-ai-starter/tests/philosophy-incomplete.test.mjs`
13. Update [CHANGELOG.md](CHANGELOG.md) and [GAP_REGISTER.md](../docs/genetic-ai-starter-maintainers/GAP_REGISTER.md) if surface changes

Windows:

```cmd
genetic-ai-starter\scripts\verify-install.cmd
```

## Sync from canonical

```bash
node genetic-ai-starter/scripts/sync-from-canonical.mjs
```

| Canonical (monorepo) | Kit payload |
|----------------------|-------------|
| `docs/AI_INDEXING_SYSTEM.md` | `payload/docs/ai/AI_INDEXING_SYSTEM.md` |
| `philosophy/genes/foundation.*.gen1.md` (8 files) | `payload/philosophy/genes/` |
| `philosophy/LANCE_PRINCIPLE_CREATION_OVER_CONFLICT.md` | `payload/philosophy/principles/LANCE_CREATION_OVER_CONFLICT.md` |
| `philosophy/ELEGANT_MINIMALISM_PRINCIPLE.md` | `payload/philosophy/principles/ELEGANT_MINIMALISM.md` |
| `philosophy/archive/FOUNDATION_HERITAGE_READING.md` | `payload/philosophy/archive/` |
| `philosophy/AI_GENE_INSTRUCTIONS.md` | `payload/philosophy/` (banner + read order) |
| `philosophy/genes/repo.engineering.controlled_changes.gen1.md` | same under payload |
| `philosophy/genes/repo.tooling.genetic_starter.agentstack_dx.gen1.md` | `payload/philosophy/genes/` |
| `philosophy/genes/repo.platform.sdk.onboarding.gen1.md` | `payload/philosophy/genes/` |
| `philosophy/genes/repo.platform.sdk.recipes.gen1.md` | `payload/philosophy/genes/` |
| `philosophy/genes/repo.platform.capability_contract.gen1.md` | `payload/philosophy/genes/` |
| `philosophy/genes/repo.tooling.gene_lifecycle.gen1.md` | `payload/philosophy/genes/` |
| `docs/plugins/CONTEXT_FOR_AI.md` | `extensions/agentstack/overlay/CONTEXT_FOR_AI.md` |
| `.cursor/rules/ai-navigation-indexes.mdc` | `genetic-navigation.mdc` |
| `hosted-storefront/`, `hosted-sdk-cdn/` (export pointer) | `payload/templates/hosted-storefront.export.md` |

## Documentation maintenance

```bash
cd genetic-ai-starter
npm run audit:bench:full   # after run-matrix
npm run audit:docs
node scripts/validate-kit.mjs
```

See [DOC_WAVE_V3_RUNBOOK.md](../docs/genetic-ai-starter-maintainers/DOC_WAVE_V3_RUNBOOK.md).

### DX scripts (post-expansion)

| Script | Purpose |
|--------|---------|
| `scripts/scaffold.mjs` | Subsystem / agentstack-feature / ADR generators |
| `scripts/generate-llms-txt.mjs` | `llms.txt` + `llms-full.txt` from map + genes |
| `scripts/build-doc-search-index.mjs` | `doc-search-index.json` for client search |
| `scripts/calculate-roi.mjs` | Modeled $ ROI worksheet + `roi-model.snapshot.json` |
| `scripts/check-roi-model.mjs` | Docs ↔ snapshot drift guard |
| `scripts/submodule-add-sdk.mjs` | Flow B — delegate to SDK submodule script |
| `scripts/link-sdk-deps.mjs` | Wire `examples/agentstack/package.json` to SDK submodule |
| `scripts/lib/pin-recipe-package.mjs` | npm pin vs file: link for consumer recipes |
| `scripts/lib/navigation-contract.mjs` | Contract region helpers for scaffolder |

Windows: `scaffold.cmd`, `generate-llms-txt.cmd`, `check-capability-contract.cmd`.

Capability snapshot refresh (maintainer, network):

```bash
node genetic-ai-starter/scripts/check-capability-contract.mjs --refresh
# Then update extensions/agentstack/capability-snapshot.json from live matrix + /mcp/actions + SDK exports
```

## PR checklist

- [ ] `validate-kit.mjs` passes
- [ ] `npm run audit:docs` when touching README metrics or paired docs
- [ ] Install tests pass
- [ ] Docs updated ([INSTALL.md](meta/docs/INSTALL.md) if behavior changed)
- [ ] `PLATFORM_VERSION` matches manifest after sync

## Mirror release (OSS)

Full procedure: [RELEASE_RUNBOOK.md](../docs/genetic-ai-starter-maintainers/RELEASE_RUNBOOK.md)

1. [PREFLIGHT_CHECKLIST.md](../docs/genetic-ai-starter-maintainers/PREFLIGHT_CHECKLIST.md)
2. [MIRROR_SYNC.md](../docs/genetic-ai-starter-maintainers/MIRROR_SYNC.md) — subtree split (maintainer docs are **not** in the kit path)
3. Tag `genetic-ai-starter-v0.4.11` → `.github/workflows/release-genetic-ai-starter.yml`
4. Mirror CI green
5. `npm publish` per [PUBLISHING.md](../docs/genetic-ai-starter-maintainers/PUBLISHING.md)
6. [LAUNCH_CHECKLIST.md](../docs/genetic-ai-starter-maintainers/LAUNCH_CHECKLIST.md) before flipping public

**Rollback:** npm `dist-tag` revert; never force-push public `main`.

## Registry

`repo.tooling.genetic_starter.gen1` → [README.md](README.md) · public: https://github.com/agentstacktech/genetic-ai-starter · platform: https://github.com/agentstacktech/AgentStack
