# Kit operations — {{PROJECT_NAME}}

Installed **genetic-ai-starter** (platform version in `.genetic-ai/kit.lock.json`).

**Integration:** [INTEGRATION_MODES](https://github.com/agentstacktech/genetic-ai-starter/blob/main/meta/docs/INTEGRATION_MODES.md) · upstream [DOC_HUB](https://github.com/agentstacktech/genetic-ai-starter/blob/main/meta/docs/DOC_HUB.md).

<!-- genetic-ai-operations:body:begin -->
## Health check

Resolve kit root (first match): `--kit-root` → `GENETIC_AI_KIT_ROOT` → `lock.kitRootRel` → `tools/genetic-ai-starter`.

```bash
node <kit>/scripts/doctor.mjs --target .
node <kit>/scripts/validate-installed.mjs --target .
```

Or CI: `node <kit>/scripts/ci-kit.mjs --target .`

## Upgrade (preserve tenant map by default)

```bash
node <kit>/scripts/upgrade.mjs --target . --dry-run
node <kit>/scripts/upgrade.mjs --target . --yes
```

Use `--force-navigation` only to reset kit-owned regions. See `meta/docs/POST_UPGRADE_TENANT.md`.

## Repair

```bash
node <kit>/scripts/repair.mjs --target . --validate-only
node <kit>/scripts/repair.mjs --target . --repair-philosophy
```

## Uninstall

```bash
node <kit>/scripts/uninstall.mjs --target .
```
<!-- genetic-ai-operations:body:end -->
