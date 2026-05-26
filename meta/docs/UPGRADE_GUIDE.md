# Upgrade guide (KIP v2.1)

## Kit root resolution (precedence)

1. `--kit-root` CLI
2. `GENETIC_AI_KIT_ROOT` environment variable
3. `lock.kitRootRel` (submodule / path / npm)
4. `tools/genetic-ai-starter` default
5. `node_modules/@agentstack/genetic-ai-starter`

## Recommended flow

```bash
node <kit>/scripts/upgrade.mjs --target . --dry-run
node <kit>/scripts/upgrade.mjs --target . --yes
node <kit>/scripts/doctor.mjs --target .
```

## Flags

| Flag | Effect |
|------|--------|
| `--preserve-navigation` | Default: merge kit regions only |
| `--force-navigation` | Re-apply all kit-owned regions from payload; tenant `tenant-map:*` blocks are kept (requires `--yes`) |
| `--force-philosophy` | Overwrite starter philosophy genes |
| `--no-force-philosophy` | Keep existing philosophy files |
| `--offer-submodule` | Print submodule pin instructions (ephemeral lock) |
| `--json-report` | Emit `.genetic-ai/last-upgrade-report.json` |

## Exit codes

| Code | Meaning |
|------|---------|
| 0 | OK |
| 1 | validate-installed failed |
| 2 | partial apply / region conflicts |
| 3 | aborted (missing `--yes` on destructive op) |
