# Windows install failure matrix (phase 0)

Gene: `repo.tooling.genetic_starter.gen1` · Repair: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

| ID | Symptom | Root cause | Fix (kit) |
|----|---------|------------|-----------|
| S01 | SETUP.cmd: Node not found | Node not on Explorer PATH | `resolve-node.cmd` + Program Files fallback |
| S02 | SyntaxError on import | Node &lt; 18 | `check-node.mjs` / preflight |
| S03 | Kit folder polluted | Install into kit root (wizard default) | `guard-target.mjs` + wizard default |
| S04 | No TTY | Non-interactive context | `--yes` + flags |
| S05 | Misleading SETUP.cmd hint | Wrong error copy | `i18n.mjs` `no_tty` |
| S06 | Platform version error | Stale standalone kit | `PLATFORM_VERSION` / preflight |
| S07 | Validate failed after install | Partial philosophy | `repair.mjs` |
| S08 | Console mojibake | Encoding | `chcp 65001` + `SETUP.en.cmd` |
| S09 | SmartScreen blocks .cmd | MOTW | Unblock / Run anyway |
| S10 | Path with spaces | CMD quoting | Quote paths in docs |
| S11 | MAX_PATH | Long paths | preflight warn |
| S12 | agentstack-app heavy | Recipes copy | post-install beacon |
| S13 | npx missing wrappers | npm `files` | package.json files |
| S14 | Wrong doctor path | Relative hint | absolute path in init |
| S15 | SETUP.ps1 PSSecurityException | ExecutionPolicy | Bypass self-reexec; use SETUP.cmd |

## PowerShell (PS01–PS06)

| ID | Symptom | Fix |
|----|---------|-----|
| PS01 | PSSecurityException | SETUP.cmd / `node install.mjs` |
| PS02 | ValidateSet agentstack-app | Dynamic profiles from JSON |
| PS03 | install.cmd needs PS | Node-only `install.cmd` |
| PS04 | `& install.ps1` | `-ExecutionPolicy Bypass -File` |
| PS05 | GENETIC_AI_STARTER_KIT vs KIT_ROOT | `env-kit-root.mjs` alias |
| PS06 | Hardcoded Lance path | `resolve-kit-root-cli.mjs` |

## Error codes

See [install-errors.mjs](../scripts/lib/install-errors.mjs) — `E_NODE_MISSING`, `E_TARGET_IS_KIT`, `E_PREFLIGHT_FAILED`, etc.
