# Kit operations variant — git submodule

<!-- genetic-ai-operations:body:begin -->
## Health check

From project root:

```bash
node tools/genetic-ai-starter/scripts/doctor.mjs --target .
node tools/genetic-ai-starter/scripts/validate-installed.mjs --target .
```

Or CI: `node tools/genetic-ai-starter/scripts/ci-kit.mjs --target .`

## Upgrade kit version

```bash
node tools/genetic-ai-starter/scripts/upgrade.mjs --target . --sync-submodule --yes
```

## Repair

```bash
node tools/genetic-ai-starter/scripts/repair.mjs --target .
```

## Uninstall

```bash
node tools/genetic-ai-starter/scripts/uninstall.mjs --target .
```

Optional: `--remove-submodule` deinits the kit path from lock.
<!-- genetic-ai-operations:body:end -->
