# Changelog — Genetic AI Starter Kit

Version numbers follow **AgentStack platform patch** (`AGENTSTACK_CORE_VERSION`), not a separate kit semver.

## 0.4.13 — foundation pillars wave (2026-05-25)

### Philosophy payload (aligned with AgentStack monorepo)

- **8 foundation genes:** `foundation.core_pillars`, `creation_over_conflict`, `elegant_minimalism`, `decomposition_reassembly`, `absolute_optimization`, `genetic_coding`, `time_decomposition`, `ai_gene_interface`.
- **Long-form in kit:** `payload/philosophy/principles/LANCE_CREATION_OVER_CONFLICT.md`, `ELEGANT_MINIMALISM.md`.
- **Heritage guide:** `payload/philosophy/archive/FOUNDATION_HERITAGE_READING.md` — how to read meaning after gene compression.
- **Sync:** `scripts/sync-from-canonical.mjs` + `scripts/lib/kit-sync-transforms.mjs` (15 files from monorepo).
- **Navigation:** `AGENTS.md`, `PHILOSOPHY_INDEX.md`, `GENE_INDEX.md`, `GENE_COMPRESSION_MAP.md` — Cluster Foundation first.

### Version

- `PLATFORM_VERSION`, `KIT_MANIFEST.json`, npm `package.json` → **0.4.13**.

## 0.4.11 — kit release (OSS launch)

### Submodule integration (KIP v2, 2026-05-24)

- **Kit Integration Protocol v2** — `kit.lock.json` + `kitSource` / `kitRootRel`; schema [`docs/schemas/kit.lock.v2.schema.json`](../docs/schemas/kit.lock.v2.schema.json).
- **Resolver** — `scripts/lib/resolve-kit-root.mjs` (doctor, upgrade, validate, `ci-kit.mjs`).
- **Bootstrap** — `bootstrap-standard.mjs`, `remote-bootstrap.mjs`, `submodule-add-kit.mjs`, `migrate-kit-lock.mjs`.
- **Docs** — [`meta/docs/INTEGRATION_MODES.md`](meta/docs/INTEGRATION_MODES.md); QUICK_SETUP submodule path; OPERATIONS without `<path-to-kit>`.
- **ADR** — [`docs/adr/GENETIC_STARTER_SUBMODULE_INTEGRATION.md`](../docs/adr/GENETIC_STARTER_SUBMODULE_INTEGRATION.md).
- Gene `repo.tooling.genetic_starter.integration.gen1` (monorepo + payload).

### Documentation (consumer vs maintainer split, 2026-05-24)

- Operator docs in **`docs/genetic-ai-starter-maintainers/`** (monorepo git only; outside kit subtree — never on public mirror). Legacy `meta/maintainers/` blocked by kit `.gitignore` + optional strip on mirror.
- **`meta/docs/DOC_HUB.md`** — user-facing index only; no GAP_REGISTER / PUBLISHING in public tree.
- CI: `check-meta-docs-boundary.mjs` + `strip-for-public-mirror.test.mjs` guard regressions.

### Documentation (doc wave v3, 2026-05-24)

- Auto-regenerated `benchmarks/results/RESULTS.md` from harness (scorer **1.2.1**, **14** tasks, **8** arms); `update-run-matrix.mjs` T12–T14.
- Narrative: `AGENT_FLOOR`, `PRODUCTION_OUTCOMES`, `AI_RELEASE_AUTONOMY` EN parity, `DOC_CLAIMS_AUDIT`, `REAL_BENEFITS` expansion.
- README EN/RU: production table, ecosystem stats, collapsed install; scenarios moved to `BENEFITS_AND_METRICS`.
- CI helpers: `audit:docs`, `check-i18n-parity.mjs`, `check-platform-stats.mjs`, `export-platform-stats.mjs`.
- i18n: `I18N_DOC_MATRIX.md`, `I18N_DOC_REGISTRY.md`, P1/P2 `_ru` mirrors, `GENE_ADAPTATION_ru` expanded; G16 mitigated.
- `check-doc-hub-links.mjs` in `audit:docs`; payload kit-meta genes use GitHub URLs (consumer `validate-installed` green).
- `init-wizard.test.mjs` covers `--gitignore-kit full`.

### OSS & governance

- Apache-2.0 [LICENSE](LICENSE), [NOTICE](NOTICE), [CONTRIBUTING.md](CONTRIBUTING.md), [SECURITY.md](SECURITY.md), [GOVERNANCE.md](GOVERNANCE.md).
- Public mirror CI (`.github/workflows/ci.yml`), npm [package.json](package.json) + `bin/genetic-ai-init.js`.
- Easter eggs E1–E5 + [EASTER_EGGS.md](../docs/genetic-ai-starter-maintainers/EASTER_EGGS.md); `tests/easter-eggs.test.mjs`.
- Grants evidence: monorepo [docs/grants/GENETIC_AI_STARTER_OSS_EVIDENCE.md](../docs/grants/GENETIC_AI_STARTER_OSS_EVIDENCE.md).
- Release runbook, preflight checklist, launch checklist, comms templates.

### Audit & scaffolding
- [AUDIT_PLAN.md](../docs/genetic-ai-starter-maintainers/AUDIT_PLAN.md) — gap register, T-xx tasks, verification commands.
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

- `benchmarks/` — synthetic `shop-api` fixture, eight control arms, task rubric (T01–T14, S01–S04), scorer 1.2.1, `run-matrix.mjs`, `analyze-results.mjs` (auto `RESULTS.md`), CI smoke tests.
- Tests: `verify-temp-install`, `standalone-kit-install`, `philosophy-incomplete`.
- `SKIP_COPY_TO_TARGET` for merge-only payload files (`AGENTS.minimal.md`, map stub, cursor fragment).

### Documentation (meta)

- Canonical [meta/docs/INSTALL.md](meta/docs/INSTALL.md), [TROUBLESHOOTING.md](meta/docs/TROUBLESHOOTING.md).
- [GAP_REGISTER.md](../docs/genetic-ai-starter-maintainers/GAP_REGISTER.md) tracks **open** gaps only; closed work listed here.

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
5. Add a new `## X.Y.Z` section above this template; update [GAP_REGISTER.md](../docs/genetic-ai-starter-maintainers/GAP_REGISTER.md).
