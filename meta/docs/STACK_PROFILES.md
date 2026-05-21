# Stack profiles — Tier 0 hints

> **Not install profiles.** Install profiles (`minimal`, `standard`, `full`, `founder`) are documented in [PROFILE_COMPARISON.md](PROFILE_COMPARISON.md).

Use the tables below with `profiles/*.json` or manually append to `docs/ai/AI_NAVIGATION_MAP.md`.

## node-ts (default fixture)

| Tag | Path | When |
|-----|------|------|
| `{{DOMAIN}}.app.root.gen1` | `src/` | Application source |
| `{{DOMAIN}}.app.tests.gen1` | `tests/` or `src/**/*.test.ts` | Tests |

## python-api

| Tag | Path | When |
|-----|------|------|
| `{{DOMAIN}}.api.gen1` | `src/` or `app/` | FastAPI/Flask package |
| `{{DOMAIN}}.api.tests.gen1` | `tests/` | Pytest tree |

## monorepo

Add one Tier 0 row per package (`packages/foo/`, `apps/web/`).

## mobile

| Tag | Path | When |
|-----|------|------|
| `{{DOMAIN}}.mobile.app.gen1` | `lib/` or `app/` | Flutter/RN root |

See `payload/docs/ai/CUSTOMIZE_DOMAIN.md` for naming law.
