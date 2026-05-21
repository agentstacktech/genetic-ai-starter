# Changelog — Genetic AI Starter Kit

Version numbers follow **AgentStack platform patch** (`AGENTSTACK_CORE_VERSION`), not a separate kit semver.

## 0.4.11 — kit release (OSS launch)

### OSS & governance

- Apache-2.0 [LICENSE](LICENSE), [NOTICE](NOTICE), [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), [GOVERNANCE.md](GOVERNANCE.md).
- Public mirror CI (`.github/workflows/ci.yml`), npm [package.json](package.json) + `bin/genetic-ai-init.js`.
- Easter eggs E1–E5 + [meta/docs/EASTER_EGGS.md](meta/docs/EASTER_EGGS.md); `tests/easter-eggs.test.mjs`.
- Grants evidence: monorepo [docs/grants/GENETIC_AI_STARTER_OSS_EVIDENCE.md](../docs/grants/GENETIC_AI_STARTER_OSS_EVIDENCE.md).
- Release runbook, preflight checklist, launch checklist, comms templates.

### Audit & scaffolding
- [AUDIT_PLAN.md](meta/docs/AUDIT_PLAN.md) — gap register, T-xx tasks, verification commands.
- **`scripts/new-gene.mjs`** — scaffold domain/subsystem/ADR genes from templates.
- **`package.json`** stub (`bin.genetic-ai-init`) for future G35 publish.
- Doctor / validate-installed: gitignore block + stub-leak checks; `install.cmd` + `GITIGNORE=full`.

### Interactive setup

- **`--gitignore-kit full`** — idempotent `.gitignore` block; philosophy/docs/ai/AGENTS/cursor kit paths stay local, not in git.
- **`SETUP.cmd`** / **`scripts/init.mjs`** — мастер установки (папка, имя, domain, профиль, AgentStack, gitignore).
- Windows: двойной щелчок, без ExecutionPolicy и без `` ` `` в командах.
- `install.cmd` + `PROFILE` env; `repair.cmd`, `install-here.cmd`, `verify-install.cmd`.

### Install and platform targeting

- **Standalone kit:** `PLATFORM_VERSION` file plus resolution order: env → `shared/constants.py` (monorepo) → `PLATFORM_VERSION` → `KIT_MANIFEST.json` — installs work when the kit is copied to `C:\Projects\genetic-ai-starter\` without the AgentStack repo.
- **Philosophy auto-repair:** if `philosophy/` exists but starter files are missing, install applies `--force-philosophy` automatically (`philosophy-state.mjs`).
- **Fail-fast validation:** `install.mjs` runs `validate-installed.mjs` after copy; non-zero exit on broken links or missing required files.
- **Repair path:** `repair.mjs` / `upgrade.mjs` (force philosophy) and Windows `-Repair` on `install.ps1`.
- **Minimal profile:** `AGENTS.minimal.md` (no broken philosophy links); stub `AI_NAVIGATION_MAP.md` written on install.
- **Consumer ops doc:** `payload/docs/ai/OPERATIONS.md` (doctor, repair, upgrade, uninstall).

### Windows toolchain

- `install.ps1` — kit root discovery, absolute `--target`, post-install validate.
- `install.cmd` / `install-here.ps1` — CMD and “install here” flows.
- `verify-install.ps1` — temp-directory smoke test (standard + minimal).
- `Install-AgentScreen.cmd` — example paths for standalone + monorepo kit locations.
- Documentation: PowerShell requires `&` before script path; [INSTALL_WINDOWS.md](meta/docs/INSTALL_WINDOWS.md).

### Scripts and validation

- `doctor.mjs` — incomplete philosophy detection, stale fragment warning, cursor block count.
- `validate-installed.mjs` — profile-aware checks; repair hints on philosophy link failures.
- `repair.mjs` — thin wrapper over `upgrade.mjs`.

### Quality and benchmarks

- `benchmarks/` — synthetic `shop-api` fixture, seven control arms, task rubric (T01–T11, S01–S04), `run-matrix.mjs`, `analyze-results.mjs`, CI smoke tests.
- Tests: `verify-temp-install`, `standalone-kit-install`, `philosophy-incomplete`.
- `SKIP_COPY_TO_TARGET` for merge-only payload files (`AGENTS.minimal.md`, map stub, cursor fragment).

### Documentation (meta)

- Canonical [meta/docs/INSTALL.md](meta/docs/INSTALL.md), [TROUBLESHOOTING.md](meta/docs/TROUBLESHOOTING.md).
- [GAP_REGISTER.md](meta/docs/GAP_REGISTER.md) tracks **open** gaps only; closed work listed here.

### Earlier 0.4.11 monorepo passes

- Idempotent `.cursorrules` merge (`<!-- genetic-ai:begin/end -->`).
- AgentStack nav append marker `genetic-ai-extension:agentstack-nav`.
- `sync-kit-version.mjs`, `--skills global`, kit version aligned to platform (no separate 1.0.x semver).
- Extension install: no duplicate genetic-ai blocks in `.cursorrules`.

---

## Template for next platform bump

1. Bump `AGENTSTACK_CORE_VERSION` in `shared/constants.py`.
2. `node genetic-ai-starter/scripts/sync-kit-version.mjs`
3. `node genetic-ai-starter/scripts/validate-kit.mjs`
4. Run `genetic-ai-starter/tests/*.test.mjs` and `benchmarks/tests/*.test.mjs`.
5. Add a new `## X.Y.Z` section above this template; update [GAP_REGISTER.md](meta/docs/GAP_REGISTER.md).
