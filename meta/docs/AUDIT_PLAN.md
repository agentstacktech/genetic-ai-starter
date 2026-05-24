# Audit plan — Genetic AI Starter Kit (0.4.11)

Living audit: logical gaps, tech debt, open work. **Task IDs** map to [GAP_REGISTER.md](GAP_REGISTER.md) (Gxx) or **T-xx** (this doc, implementation queue).

**Last audit:** 2026-05-20

---

## Executive summary

| Area | Status | Top action |
|------|--------|------------|
| Install / Windows | Good | T-01 done: `GITIGNORE` in `install.cmd` |
| Init wizard | Good | T-02: default gitignore guidance in QUICK_SETUP |
| Gitignore kit | Good | T-03 done: doctor + upgrade + stub guard |
| Payload / copy | OK | Stub skipped via `SKIP_COPY_TO_TARGET` |
| Benchmarks | **Done** (harness v1) | G40 optional SDK repeat |
| Distribution | **OSS ready** | G45 publish + template repo (operator); artifacts in tree |
| Ecosystem | Open | G37 Copilot, G40 SDK bench |
| Scaffolding | **Done** | G39 `new-gene.mjs` |
| OSS governance | **Done** | LICENSE, CI mirror, easter eggs, grants evidence doc |

---

## Closed in this audit (T-xx)

| ID | Issue | Fix |
|----|--------|-----|
| T-01 | `install.cmd` ignored `GITIGNORE` env | `GITIGNORE=full\|none` → `--gitignore-kit` |
| T-03 | `upgrade` did not refresh `.gitignore` block | Reapply when `lock.gitignoreKit === 'full'` |
| T-04 | `doctor` silent on gitignore / stub leak | Checks added |
| T-05 | `validate-installed` no stub-leak check | Fails if `AI_NAVIGATION_MAP.minimal.stub.md` in target |
| T-06 | `VERSION.md` listed init as open | Updated |
| T-07 | `ANALYSIS.md` stale (G36, minimal stub) | Updated priorities |
| T-08 | `KIT_MANIFEST` missing new payload paths | `local/README`, gitignore header, benchmark gene |
| T-09 | No consumer audit / task doc | This file + backlog sync |

---

## Open — product (GAP_REGISTER)

| ID | Summary | Priority |
|----|---------|----------|
| G35 | npm + GitHub template | P1 |
| G37 | Copilot / non-Cursor adapter | P3 |
| G38 | Benchmark matrix published | **Done** |
| G39 | `new-gene.mjs` scaffolder | **Done** |
| G45 | npm + template publish | P1 → **ready** (operator launch) |
| G40 | `@cursor/sdk` automated benchmark | P3 |

---

## Open — found in audit (new)

### G41 — `gitignore-kit` vs `git status`

| Field | Detail |
|-------|--------|
| **Problem** | Files already tracked before install stay in git even with `full` gitignore. |
| **Mitigation** | Document in OPERATIONS: `git rm -r --cached philosophy docs/ai AGENTS.md` after enabling full block. |
| **Status** | Documented (T-10) |

### G42 — Init `--yes` defaults `gitignoreKit` to `none`

| Field | Detail |
|-------|--------|
| **Problem** | CI/non-interactive installs skip privacy gitignore unless flag passed. |
| **Mitigation** | `Install-AgentScreen.cmd` uses `--gitignore-kit full`; document env `GITIGNORE=full` for cmd. |
| **Future** | `--gitignore-kit full` as opt-in default for `init --yes` in consumer template only |

### G43 — Monorepo `philosophy/` vs consumer kit copy

| Field | Detail |
|-------|--------|
| **Risk** | Two sources of truth: `AgentStack/philosophy/` and `payload/philosophy/`. |
| **Mitigation** | `sync-from-canonical.mjs` on maintainer bumps; accepted (extends G10). |

### G44 — Benchmark gene in payload, not in manifest until T-08

| Field | Detail |
|-------|--------|
| **Status** | Fixed in manifest |

### G45 — No `package.json` for kit (blocks G35)

| Field | Detail |
|-------|--------|
| **Deliverable** | Stub `package.json` with `bin` → `scripts/init.mjs` (private, unpublished until registry) |

### G46 — `uninstall` with missing lock

| Field | Detail |
|-------|--------|
| **Problem** | Removes paths but may leave `.gitignore` block if lock deleted manually. |
| **Fix** | Always call `removeGitignoreBlock` (already done); document |

---

## Accepted (unchanged)

- G10 extension drift  
- G16 RU-first genes  
- Benchmark harness v1 is reproducible via `run-matrix.mjs`; optional manual/SDK repeat (G40)  

---

## Implementation TODO (ordered)

### P0 — correctness (this PR)

- [x] T-01 `install.cmd` + `GITIGNORE` env  
- [x] T-03 `upgrade.mjs` gitignore refresh  
- [x] T-04 `doctor.mjs` gitignore + stub leak  
- [x] T-05 `validate-installed` stub leak  
- [x] T-08 `KIT_MANIFEST` paths  
- [x] T-09 `AUDIT_PLAN.md`  
- [x] G39 `scripts/new-gene.mjs` + test  
- [x] T-10 OPERATIONS git cached files note  

### P1 — quality

- [x] G38 Benchmark matrix + RESULTS/ANALYSIS committed  
- [ ] G35 `package.json` stub + PUBLISHING checklist run  
- [x] Add `install.test.mjs` case: `--gitignore-kit full` + block present  
- [ ] `init-wizard.test.mjs` with `--gitignore-kit full`  
- [x] `package.json` stub (G45)  

### P2 — docs / DX

- [x] Doc wave v2 — NAVIGATION_OS, TOKEN_ECONOMICS, KILLER_FEATURE, METRICS_GLOSSARY, DOC_HUB, scorer 1.1.1 (2026-05-24)  
- [x] `GENE_COMPRESSION_MAP` T06 walkthrough  
- [x] `metrics.snapshot.json` + `check-docs-metrics.mjs`  
- [ ] Onboarding sample repo (filled map + 2 indexes) — meta doc only  
- [ ] EN mirror of `PROFILE_COMPARISON.md` (optional)  

### T-doc register (doc wave v2)

| ID | Status |
|----|--------|
| T-doc-01 … T-doc-20 | Done — see [DOC_AUDIT_GAPS.md](DOC_AUDIT_GAPS.md) G1–G15 |

### P3 — ecosystem

- [ ] G37 Copilot overlay  
- [ ] G40 SDK matrix  

---

## Verification commands

```bash
node genetic-ai-starter/scripts/validate-kit.mjs
node genetic-ai-starter/tests/install.test.mjs
node genetic-ai-starter/tests/gitignore-kit.test.mjs
node genetic-ai-starter/tests/init-wizard.test.mjs
node genetic-ai-starter/tests/new-gene.test.mjs
```

Windows:

```cmd
genetic-ai-starter\scripts\verify-install.cmd
```

---

## Maintainer sync checklist

1. `sync-kit-version.mjs` after platform bump  
2. `sync-from-canonical.mjs` if `CONTEXT_FOR_AI` changed  
3. Re-run audit section **P0** tests  
4. Update this file dates and close T-xx rows  
