# Improvement backlog — Genetic AI Starter Kit

Platform **0.4.11**. Shipped: [CHANGELOG.md](../../CHANGELOG.md). Audit: [AUDIT_PLAN.md](AUDIT_PLAN.md). Open gaps: [GAP_REGISTER.md](GAP_REGISTER.md).

---

## P0 — Done (audit 2026-05-20)

| Item | Notes |
|------|--------|
| Init wizard | `SETUP.cmd` / `init.mjs` |
| Gitignore kit | `--gitignore-kit full`, wizard, `install.cmd` + `GITIGNORE` |
| `new-gene.mjs` | G39 |
| Doctor / validate | gitignore block, stub leak |
| `AUDIT_PLAN.md` | Task register |

---

## P1 — Next

| Item | Gap | Action |
|------|-----|--------|
| Manual benchmark | G38 | [benchmarks/RUNBOOK.md](../../benchmarks/RUNBOOK.md) |
| npm + template | G35, G45 | `package.json` stub + publish checklist |
| Install test gitignore | T-P1 | `--gitignore-kit full` in `install.test.mjs` |

---

## P2 — DX

| Item | Gap | Action |
|------|-----|--------|
| Doc wave v2 | — | **Done** 2026-05-24 — scorer 1.1.1, meta docs, metrics.snapshot |
| doctor map drift | COMPARISON | P2 — map Tier1 path exists |
| Onboarding sample map | ANALYSIS | [BENCHMARK_ONBOARDING_SAMPLE.md](BENCHMARK_ONBOARDING_SAMPLE.md) |
| new-gene map append | G39 | Optional `--write-map` flag |

---

## P3 — Ecosystem

| Item | Gap |
|------|-----|
| Copilot adapter | G37 |
| SDK benchmark | G40 |

---

## Maintainer hygiene

```bash
node genetic-ai-starter/scripts/sync-kit-version.mjs
node genetic-ai-starter/scripts/validate-kit.mjs
node genetic-ai-starter/tests/install.test.mjs
node genetic-ai-starter/tests/gitignore-kit.test.mjs
node genetic-ai-starter/tests/init-wizard.test.mjs
node genetic-ai-starter/tests/new-gene.test.mjs
```

Windows: `genetic-ai-starter\scripts\verify-install.cmd`
