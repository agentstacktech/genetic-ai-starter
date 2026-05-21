# Mirror sync — include / exclude (oss-sync-filter)

Monorepo path `genetic-ai-starter/` is the **source of truth**. Public mirror `AgentStack/genetic-ai-starter` receives a **subtree split** of this folder (see monorepo `.github/workflows/release-genetic-ai-starter.yml`).

## Included (ship to mirror)

| Path | Reason |
|------|--------|
| `payload/`, `profiles/`, `extensions/`, `scripts/` | Core kit |
| `benchmarks/` | OSS methodology proof |
| `tests/`, `fixtures/` (non-secret) | CI parity |
| `meta/docs/` | Install, runbooks, easter egg maintainer doc |
| `bin/`, `package.json`, `LICENSE`, `NOTICE` | npm + legal |
| `.github/` | Mirror CI, release, templates |
| `template-repo/` | Template publish instructions |
| `COMMUNITY.md`, `SHOWCASE.md`, root READMEs | Public-facing |

## Excluded (never push)

| Pattern | Reason |
|---------|--------|
| `.env`, `*.pem`, `*credentials*` | Secrets |
| `fixtures/win-install-test/**` temp artifacts | Local smoke only (if present) |
| Nested `.git/` inside kit folder | Accidental nested repo |
| `node_modules/`, `*.tgz` from local `npm pack` | Build artifacts |
| Monorepo-only paths outside subtree | Not in split prefix |

## Pre-flight

Run [PREFLIGHT_CHECKLIST.md](PREFLIGHT_CHECKLIST.md) before every sync: `gitleaks detect --source genetic-ai-starter/`.

## Parity check

Release workflow records `sha256sum` of file manifest after subtree split. Mirror CI must match monorepo test list in `genetic-ai-starter.yml`.

## Emergency manual push

Only if Action fails; document reason in mirror Release notes. Prefer tag + workflow re-run.
