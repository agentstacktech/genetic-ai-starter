# Kit operations variant — path / ephemeral kit root

<!-- genetic-ai-operations:body:begin -->
## Health check (path-only install)

Kit is not pinned as a submodule. Resolve root:

1. `GENETIC_AI_KIT_ROOT` environment variable
2. Path from last `upgrade.mjs --kit-root <clone>`
3. `tools/genetic-ai-starter` if present

```bash
node /path/to/genetic-ai-starter/scripts/doctor.mjs --target .
node /path/to/genetic-ai-starter/scripts/validate-installed.mjs --target .
```

## Upgrade

```bash
node /path/to/genetic-ai-starter/scripts/upgrade.mjs --target . --kit-root /path/to/genetic-ai-starter --yes
```

Lock may record `kitSource.type: ephemeral`. For reproducible CI, add submodule:

```bash
node /path/to/genetic-ai-starter/scripts/submodule-add-kit.mjs --target .
```

Then: `upgrade.mjs --target . --sync-submodule --yes`

## Repair

```bash
node <kit>/scripts/repair.mjs --target . --validate-only
```
<!-- genetic-ai-operations:body:end -->
