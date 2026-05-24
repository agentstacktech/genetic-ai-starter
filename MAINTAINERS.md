# Maintainers — Genetic AI Starter Kit

Kit path: `genetic-ai-starter/` in AgentStack monorepo. Platform line **0.4.11**.

**Operator docs (monorepo git only, outside kit subtree):** [docs/genetic-ai-starter-maintainers/README.md](../docs/genetic-ai-starter-maintainers/README.md)

## Release checklist (platform bump)

1. Bump `AGENTSTACK_CORE_VERSION` in `shared/constants.py`
2. `node genetic-ai-starter/scripts/sync-kit-version.mjs`
3. `node genetic-ai-starter/scripts/validate-kit.mjs`
4. `node genetic-ai-starter/tests/install.test.mjs`
5. `node genetic-ai-starter/tests/verify-temp-install.test.mjs`
6. `node genetic-ai-starter/tests/standalone-kit-install.test.mjs`
7. `node genetic-ai-starter/tests/philosophy-incomplete.test.mjs`
8. Update [CHANGELOG.md](CHANGELOG.md) and [GAP_REGISTER.md](../docs/genetic-ai-starter-maintainers/GAP_REGISTER.md) if surface changes

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
| `philosophy/genes/repo.engineering.controlled_changes.gen1.md` | same under payload |
| `.cursor/rules/ai-navigation-indexes.mdc` | `genetic-navigation.mdc` |

## Documentation maintenance

```bash
cd genetic-ai-starter
npm run audit:bench:full   # after run-matrix
npm run audit:docs
node scripts/validate-kit.mjs
```

See [DOC_WAVE_V3_RUNBOOK.md](../docs/genetic-ai-starter-maintainers/DOC_WAVE_V3_RUNBOOK.md).

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
