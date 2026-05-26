# Troubleshooting — Genetic AI Starter Kit

## Install / path

| Symptom | Cause | Fix |
|---------|--------|-----|
| `Cannot find module ... install.mjs` | Running from **target** repo; kit not there | Full path: `node "C:\...\genetic-ai-starter\scripts\install.mjs" --target ...` |
| `PSSecurityException` / unsigned script | `& install.ps1` under Restricted policy | **`install.cmd`** or `powershell -ExecutionPolicy Bypass -File "...\install.ps1" ...` — see [INSTALL_WINDOWS.md](INSTALL_WINDOWS.md) |
| PowerShell `CommandNotFoundException` for `.ps1` | Missing `&` when not using `-File` | Prefer `install.cmd` / Node; or Bypass `-File` |
| `Missing C:\Projects\shared\constants.py` | Standalone kit without `PLATFORM_VERSION` | Update kit; ensure `PLATFORM_VERSION` exists or set `$env:AGENTSTACK_CORE_VERSION` |
| Command breaks mid-line | Copied `` ` `` line continuation | **One line** per command; see INSTALL_WINDOWS |
| Line continuation with `\` at EOL | Bash style on Windows | One line, or `install.cmd` |

## Philosophy / validation

| Symptom | Cause | Fix |
|---------|--------|-----|
| `philosophy/ skipped` then broken links | Old folder in target; docs installed without genes | Re-run install (auto-repair) or `repair.mjs` / `-Repair -Strict` |
| `validate-installed FAILED` philosophy links | Incomplete or stale `philosophy/` | `node <kit>/scripts/repair.mjs --target <project> --repair-philosophy` |
| `[LINK] .cursorrules.fragment.md` | Pre–0.4.13 KIP kit / stale gene link | Upgrade kit **0.4.13+**; alias resolves to `.cursorrules` |
| Tenant map rows lost after upgrade | Pre–KIP v2.1 full overwrite | Upgrade with preserve (default); recover from git; `migrate-navigation-markers.mjs --write` |
| `repair.mjs` wiped custom navigation | Repair used to equal full upgrade | **0.4.13+** repair preserves navigation; use `--repair-philosophy` only when needed |
| `Installed OK` but validate failed | Old install UX | **0.4.13+** exits 1; see `.genetic-ai/last-upgrade-report.json` |
| Want to keep custom genes | Default skip when complete | `--merge-philosophy` / `upgrade --no-force-philosophy` |
| Replace all starter genes | Full reset | `--force-philosophy` on upgrade |

## Cursor / rules

| Symptom | Cause | Fix |
|---------|--------|-----|
| Two `genetic-ai:begin` blocks | Re-install without idempotent merge | `upgrade.mjs` or fix `.cursorrules` manually |
| `.cursorrules.fragment.md` in target | Old install | Delete file; content is in `.cursorrules` |
| Skills not in project | Used `--skills global` | Re-install without flag or copy from `~/.cursor/skills/` |

## Submodule / kit root

| Symptom | Cause | Fix |
|---------|--------|-----|
| `tools/genetic-ai-starter` empty | Submodule not initialized | `git submodule update --init --recursive` |
| `Cannot find module ... bootstrap-standard.mjs` | No kit on disk yet | `node -e "fetch(...)"` path: run [`remote-bootstrap.mjs`](https://github.com/agentstacktech/genetic-ai-starter/blob/main/scripts/remote-bootstrap.mjs) or `git submodule add` per [INTEGRATION_MODES.md](INTEGRATION_MODES.md) |
| Doctor: submodule drift | HEAD ≠ `kitSource.ref` in lock | `node tools/genetic-ai-starter/scripts/upgrade.mjs --target . --sync-submodule` |
| Wrong kit resolved | Multiple kits / stale lock | Set `GENETIC_AI_KIT_ROOT` or `node .../doctor.mjs --kit-root <path>` |

## Version / lock

| Symptom | Cause | Fix |
|---------|--------|-----|
| No `kit.lock.json` | Install never succeeded | Complete install with `--strict` |
| Wrong version in lock | Installed with old kit | `upgrade.mjs` after updating kit folder |
| `lockSchemaVersion` missing | Pre–KIP v1 lock | `node <kit>/scripts/migrate-kit-lock.mjs --target .` |

## AgentStack extension

| Symptom | Cause | Fix |
|---------|--------|-----|
| `CONTEXT_FOR_AI.md` missing | Extension in lock but files removed | Re-run install `--with-agentstack` |
| Duplicate map append rows | Old extension install | Fixed in current kit; run `upgrade.mjs` |

## Still stuck

1. `node <kit>/scripts/doctor.mjs --target <project>`
2. `node <kit>/scripts/validate-installed.mjs --target <project>`
3. See [INSTALL.md](INSTALL.md) and [INSTALL_WINDOWS.md](INSTALL_WINDOWS.md)
