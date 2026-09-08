# Maintainers — Genetic AI Starter Kit

Kit path: `genetic-ai-starter/` in AgentStack monorepo. Platform line **0.4.18** (tracks `AGENTSTACK_CORE_VERSION`).

**Operator docs (monorepo git only, outside kit subtree):** [docs/genetic-ai-starter-maintainers/README.md](../docs/genetic-ai-starter-maintainers/README.md) · **Sync flow:** [KIT_SYNC_FLOW.md](../docs/genetic-ai-starter-maintainers/KIT_SYNC_FLOW.md)

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

Windows QA (required before release):

1. `scripts\verify-install.cmd` (Node smoke)
2. `node scripts\preflight.mjs --quick`
3. `SETUP.cmd` dry path: `node scripts\init.mjs --yes --target <temp> --profile standard --dry-run`
4. Guard: `node scripts\install.mjs --target <kit-root>` must fail `E_TARGET_IS_KIT`
5. `node tests\guard-target.test.mjs` + `node tests\preflight.test.mjs`

```cmd
genetic-ai-starter\scripts\verify-install.cmd
```

## Sync from canonical

Preferred one-shot (version + sync + validate + transform/alias/site guards):

```bash
node genetic-ai-starter/scripts/sync-smoke.mjs
# or: cd genetic-ai-starter && npm run sync-smoke
```

Step-by-step:

```bash
node genetic-ai-starter/scripts/sync-kit-version.mjs
node genetic-ai-starter/scripts/sync-from-canonical.mjs
```

| Canonical (monorepo) | Kit payload |
|----------------------|-------------|
| `docs/AI_INDEXING_SYSTEM.md` | `payload/docs/ai/AI_INDEXING_SYSTEM.md` |
| `philosophy/genes/foundation.*.gen1.md` (8 files) | `payload/philosophy/genes/` |
| `philosophy/genes/repo.engineering.ai_navigation.gen1.md` (+ `retrieve.gen1`) | Kit keeps `repo.navigation.map.gen1` / `index.gen1` (aliases); monorepo mirrors those tags as thin redirects. Sync via transforms — do not fork a third catalog shape. |
| `docs/AI_INDEXING_SYSTEM.md` | `payload/docs/ai/AI_INDEXING_SYSTEM.md` via **`kitAiIndexingTransform`** (strips monorepo-only adapters; points kit genes) |
| `philosophy/LANCE_PRINCIPLE_CREATION_OVER_CONFLICT.md` | `payload/philosophy/principles/LANCE_CREATION_OVER_CONFLICT.md` |
| `philosophy/ELEGANT_MINIMALISM_PRINCIPLE.md` | `payload/philosophy/principles/ELEGANT_MINIMALISM.md` |
| `philosophy/archive/FOUNDATION_HERITAGE_READING.md` | `payload/philosophy/archive/` |
| `philosophy/AI_GENE_INSTRUCTIONS.md` | `payload/philosophy/` (banner + read order) |
| `philosophy/genes/repo.engineering.controlled_changes.gen1.md` | same under payload |
| `philosophy/genes/repo.engineering.dna_protein_data_plane.gen1.md` | `payload/philosophy/genes/` |
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
npm run audit:docs         # includes check-site-inventory (498/244)
npm run test:sync-transforms

### Platform stats chain

```bash
node scripts/export-platform-stats.mjs          # kit snapshot + site JSON if monorepo site present
node scripts/export-platform-stats.mjs --live-mcp   # optional prod health WARN (never mutates snapshot)
node scripts/check-stats-plane-parity.mjs       # kit MCP fields vs docs/publication snapshot
node scripts/sync-platform-stats-site.mjs --check # verify docs/genetic-system-site/data/
```

Digest: [meta/docs/PLATFORM_SCALE_DIGEST.md](meta/docs/PLATFORM_SCALE_DIGEST.md) · decomposition: [GENETIC_SCALE_METRICS_DECOMPOSITION.md](meta/docs/GENETIC_SCALE_METRICS_DECOMPOSITION.md)
node scripts/validate-kit.mjs
```

See [DOC_WAVE_V3_RUNBOOK.md](../docs/genetic-ai-starter-maintainers/DOC_WAVE_V3_RUNBOOK.md) · [KIT_SYNC_FLOW.md](../docs/genetic-ai-starter-maintainers/KIT_SYNC_FLOW.md) · [KIT_PLUGIN_SYNC_RUNBOOK.md](../docs/genetic-ai-starter-maintainers/KIT_PLUGIN_SYNC_RUNBOOK.md).

### Fast vs full gates

| Gate | Command | When |
|------|---------|------|
| **Fast** (maintainer smoke) | `node genetic-ai-starter/scripts/sync-smoke.mjs` | After platform bump or canonical sync |
| **Full** (release) | `cd genetic-ai-starter && npm run audit:docs && npm run validate-kit` + install tests in [RELEASE_RUNBOOK.md](../docs/genetic-ai-starter-maintainers/RELEASE_RUNBOOK.md) | Before mirror tag / npm publish |
| **Triangle** (kit + plugin + CONTEXT) | `npm run audit:agentstack-dx-plane` (monorepo root) | When touching `provided_plugins/`, overlay CONTEXT, or capability snapshot |

`export-platform-stats.mjs` uses scoped package roots derived from `docs/AI_NAVIGATION_MAP.md` (`navigation-map-roots.mjs` + small `EXTRA_INDEX_SCAN_ROOTS` fallback; ~3–4s); `--full-scan` audits parity; `tests/export-platform-stats.test.mjs` in sync-smoke enforces scoped ≡ full.

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
| `scripts/check-site-inventory.mjs` | HTML inventory vs `platform-stats.snapshot.json` |
| `scripts/sync-smoke.mjs` | Maintainer E2E: version → sync → validate → tests |
| `scripts/lib/kit-sync-transforms.mjs` | Canonical → kit text transforms (indexing / foundation / CONTEXT overlay) |
| `scripts/lib/walk-files.mjs` | Shared tree walk (EPERM-safe) |
| `scripts/lib/run-kit-steps.mjs` | Step orchestrator: sync-smoke, audit-docs, doctor `--docs` |
| `scripts/lib/doc-audit-steps.mjs` | Doc audit step SoT |
| `scripts/lib/platform-stats-scan.mjs` | Scoped AI_INDEX inventory for `export-platform-stats` |
| `scripts/lib/navigation-map-roots.mjs` | Derive scan roots from `AI_NAVIGATION_MAP.md` + extras |
| `scripts/lib/kit-sync-map.mjs` | Canonical → kit `KIT_SYNC_MAP` SoT (sync + freshness gate) |
| `scripts/lib/list-markdown-rel.mjs` | Consumer markdown rel paths (`validate-installed`) |
| `scripts/lib/doc-hub-seeds.mjs` | DOC_HUB link-check seeds |
| `scripts/lib/audit-markdown-links.mjs` | Thin wrapper over `resolve-markdown-links.mjs` |
| `scripts/lib/recipe-scan.mjs` | Recipe import/action scan (capability contract + codegen) |
| `scripts/lib/scan-philosophy-genes.mjs` | Gene + AI_INDEX scan for llms.txt / doc-search-index |
| `scripts/lib/run-labeled-steps.mjs` | Monorepo labeled steps (`audit-agentstack-dx-plane`) |
| `scripts/lib/navigation-contract.mjs` | Contract region helpers for scaffolder |

- `llms.txt` / `doc-search-index.json` — regenerated in `audit:docs` (`generate-llms-txt`, `build-doc-search-index`)

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

### Philosophy gate (5 questions)

Before merging kit PRs that change genes, rules, or navigation contract:

1. **Creation over conflict** — Does this add a second path instead of one clear behavior?
2. **Map-first** — Will agents still land on `AI_NAVIGATION_MAP` / local `AI_INDEX.md` before blind grep?
3. **Consumer safety** — No monorepo-only paths leaked into `payload/` or overlay without transform?
4. **Capability honesty** — If MCP/SDK surface changed, is `capability-snapshot.json` / CONTEXT excerpt updated?
5. **Direct ship** — For founder/platform work, no invented percent-canary or dual-path rollout unless explicitly requested?

See `philosophy/genes/repo.engineering.founder_direct_ship.gen1.md` and monorepo `PHILOSOPHY_GATE` pattern in `docs/genetic-ai-starter-maintainers/`.

## Mirror release (OSS)

Full procedure: [RELEASE_RUNBOOK.md](../docs/genetic-ai-starter-maintainers/RELEASE_RUNBOOK.md)

1. [PREFLIGHT_CHECKLIST.md](../docs/genetic-ai-starter-maintainers/PREFLIGHT_CHECKLIST.md)
2. [MIRROR_SYNC.md](../docs/genetic-ai-starter-maintainers/MIRROR_SYNC.md) — subtree split (maintainer docs are **not** in the kit path)
3. Tag `genetic-ai-starter-v<PLATFORM_VERSION>` → `.github/workflows/release-genetic-ai-starter.yml`
4. Mirror CI green
5. `npm publish` per [PUBLISHING.md](../docs/genetic-ai-starter-maintainers/PUBLISHING.md)
6. [LAUNCH_CHECKLIST.md](../docs/genetic-ai-starter-maintainers/LAUNCH_CHECKLIST.md) before flipping public

**Rollback:** npm `dist-tag` revert; never force-push public `main`.

## Registry

`repo.tooling.genetic_starter.gen1` → [README.md](README.md) · public: https://github.com/agentstacktech/genetic-ai-starter · platform: https://github.com/agentstacktech/AgentStack
