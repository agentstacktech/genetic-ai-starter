# Gap register — Genetic AI Starter Kit

Living register for **open** and **accepted** gaps only. Resolved items are recorded in [CHANGELOG.md](../../CHANGELOG.md) (platform **0.4.11**).

**Status keys:** `open` (planned work) · `accepted` (known limitation, no immediate fix)

---

## Open

### G35 — Distribution: GitHub template + npm

| Field | Detail |
|-------|--------|
| **Problem** | Consumers must clone AgentStack or copy `genetic-ai-starter/` manually; no one-command global install. |
| **Target** | `npx @agentstack/genetic-ai-starter init` or GitHub “Use this template”. |
| **Deliverables** | Public template repo; npm package with `bin` calling `install.mjs`; README in template; CI sample workflow included. |
| **Acceptance** | Fresh machine: `npx … init --target ./app` produces passing `validate-installed` without monorepo paths. |
| **Docs** | [PUBLISHING.md](PUBLISHING.md) § Distribution |
| **Depends on** | Stable `PLATFORM_VERSION` standalone story (done in 0.4.11) |

### G36 — Interactive init wizard

| Field | Detail |
|-------|--------|
| **Status** | **Done** (platform 0.4.11) — `SETUP.cmd` / `scripts/init.mjs` |
| **Entry** | Double-click `SETUP.cmd` (Windows) or `node scripts/init.mjs` |
| **Remaining** | Optional npm `npx … init` wrapper (G35) |

### G37 — Copilot / non-Cursor adapters

| Field | Detail |
|-------|--------|
| **Problem** | Rules are `.mdc` + Cursor skills; Copilot and other agents ignore them. |
| **Target** | `copilot-instructions.md` or `AGENTS.md`-only mode generated from same payload. |
| **Deliverables** | Profile flag or `extensions/copilot/` overlay; doc mapping table (Cursor rule → Copilot section). |
| **Acceptance** | Copilot session on sample repo follows map-first order in manual test checklist. |
| **Priority** | P3 — after standard Cursor path is stable |

### G38 — Benchmark: manual Cursor matrix

| Field | Detail |
|-------|--------|
| **Problem** | [`benchmarks/results/`](../../benchmarks/results/) use policy simulation; not publishable as hard numbers. |
| **Target** | ≥1 full manual pass (7×11 synthetic) stored in `results/raw/`. |
| **Deliverables** | Updated [RESULTS.md](../../benchmarks/results/RESULTS.md) + [ANALYSIS.md](../../benchmarks/results/ANALYSIS.md); `run-meta.json` with real model id. |
| **Acceptance** | `RUN_MATRIX.md` all `[x]`; aggregate CSV committed or attached to ADR. |
| **Docs** | [benchmarks/RUNBOOK.md](../../benchmarks/RUNBOOK.md) |

### G39 — `scripts/new-gene.mjs` scaffolder

| Field | Detail |
|-------|--------|
| **Status** | **Done** — `node scripts/new-gene.mjs --type domain\|subsystem\|adr` |
| **Docs** | [BOOTSTRAP_CHECKLIST.md](BOOTSTRAP_CHECKLIST.md), [AUDIT_PLAN.md](AUDIT_PLAN.md) |
| **Remaining** | Optional: auto-append map row (interactive confirm) |

### G41 — Gitignore vs already-tracked files

| Field | Detail |
|-------|--------|
| **Problem** | `--gitignore-kit full` does not untrack files already in git index. |
| **Mitigation** | [OPERATIONS.md](../../payload/docs/ai/OPERATIONS.md) — `git rm -r --cached` after enabling block. |
| **Status** | Accepted + documented |

### G42 — Non-interactive init defaults `gitignoreKit` to `none`

| Field | Detail |
|-------|--------|
| **Mitigation** | Use `--gitignore-kit full`, `GITIGNORE=full` + `install.cmd`, or `Install-AgentScreen.cmd`. |
| **Status** | Accepted |

### G45 — npm package publish (G35)

| Field | Detail |
|-------|--------|
| **Status** | **Ready** — `package.json` Apache-2.0, `bin/genetic-ai-init.js`, mirror `release.yml` (OIDC + provenance). |
| **Remaining** | Operator: `npm publish` + create `genetic-ai-starter-template` repo from [template-repo/](../../template-repo/) — [PUBLISHING.md](PUBLISHING.md), [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md) |

### G40 — Automated benchmark (`@cursor/sdk`)

| Field | Detail |
|-------|--------|
| **Problem** | Manual matrix is expensive to repeat each platform bump. |
| **Target** | Batch runner with fixed model slug (phase 2 in [benchmarks/METHODOLOGY.md](../../benchmarks/METHODOLOGY.md)). |
| **Deliverables** | `benchmarks/scripts/run-sdk-matrix.mjs` (optional CI, secrets required). |
| **Acceptance** | Reproducible CSV from CI artifact on demand. |
| **Depends on** | G38 (gold prompts frozen) |

---

## Accepted (ongoing)

### G10 — AgentStack extension can lag canonical monorepo

| Field | Detail |
|-------|--------|
| **Risk** | `extensions/agentstack/` excerpt may drift from live `docs/plugins/CONTEXT_FOR_AI.md`. |
| **Mitigation** | `sync-from-canonical.mjs`; extension version pin in manifest; maintainers run sync on doc PRs. |
| **Consumer action** | Use `--with-agentstack` only when building on AgentStack; link to upstream docs for MCP/canary detail. |

### G16 — i18n: RU canonical in payload, EN partial

| Field | Detail |
|-------|--------|
| **Risk** | Some payload genes RU-first; EN-only teams read `README.en.md` + INSTALL. |
| **Mitigation** | EN README + meta docs; genes stay RU where copied from monorepo philosophy. |
| **Future** | Optional `payload-en/` profile (not scheduled for 0.4.11). |

---

## How to close a gap

1. Implement fix in kit tree.
2. Add/adjust tests under `genetic-ai-starter/tests/`.
3. Document in [CHANGELOG.md](../../CHANGELOG.md) under next platform section.
4. Remove row from this file (or move to Accepted with mitigation).
