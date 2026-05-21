# Maintainers — Genetic AI Starter Kit

Kit path: `genetic-ai-starter/` in AgentStack monorepo. Platform line **0.4.11** — open gaps in [meta/docs/GAP_REGISTER.md](meta/docs/GAP_REGISTER.md).

## Release checklist (platform bump)

1. Bump `AGENTSTACK_CORE_VERSION` in `shared/constants.py`
2. `node genetic-ai-starter/scripts/sync-kit-version.mjs`
3. `node genetic-ai-starter/scripts/validate-kit.mjs`
4. `node genetic-ai-starter/tests/install.test.mjs`
5. `node genetic-ai-starter/tests/verify-temp-install.test.mjs`
6. `node genetic-ai-starter/tests/standalone-kit-install.test.mjs`
7. `node genetic-ai-starter/tests/philosophy-incomplete.test.mjs`
8. Update [CHANGELOG.md](CHANGELOG.md), [GAP_REGISTER.md](meta/docs/GAP_REGISTER.md), [AUDIT_PLAN.md](meta/docs/AUDIT_PLAN.md), [PROFILE_COMPARISON.md](meta/docs/PROFILE_COMPARISON.md) if surface changes

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

## PR checklist

- [ ] `validate-kit.mjs` passes
- [ ] Install tests pass
- [ ] Docs updated ([INSTALL.md](meta/docs/INSTALL.md) if behavior changed)
- [ ] `PLATFORM_VERSION` matches manifest after sync

## Mirror release (OSS)

Full procedure: [meta/docs/RELEASE_RUNBOOK.md](meta/docs/RELEASE_RUNBOOK.md)

1. [PREFLIGHT_CHECKLIST.md](meta/docs/PREFLIGHT_CHECKLIST.md) — gitleaks + payload license + CI green
1b. [MIRROR_SYNC.md](meta/docs/MIRROR_SYNC.md) — include/exclude paths
2. Tag `genetic-ai-starter-v0.4.11` in monorepo → run `.github/workflows/release-genetic-ai-starter.yml`
3. Secrets: `KIT_MIRROR_TOKEN`, `KIT_MIRROR_REPO` (= `agentstacktech/genetic-ai-starter`)
4. Mirror CI green (`.github/workflows/ci.yml` — Linux + Windows)
5. `npm publish` from mirror release workflow or local with provenance
6. [LAUNCH_CHECKLIST.md](meta/docs/LAUNCH_CHECKLIST.md) before flipping public

**Rollback:** npm `dist-tag` revert; never force-push public `main` — see RELEASE_RUNBOOK.

## Registry

`repo.tooling.genetic_starter.gen1` → [README.md](README.md) · public: https://github.com/agentstacktech/genetic-ai-starter · platform: https://github.com/agentstacktech/AgentStack
