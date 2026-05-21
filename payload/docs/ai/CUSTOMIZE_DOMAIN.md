# Customize domain segments — {{PROJECT_NAME}}

**Domain placeholder:** `{{DOMAIN}}` (e.g. `app`, `api`, `acme`)

---

## Naming law

1. **Lowercase** ASCII segments, dots only.
2. Shape: `{{DOMAIN}}.<area>.<role>.gen1`
3. Register every new tag in [AI_NAVIGATION_MAP.md](AI_NAVIGATION_MAP.md) before agents rely on it.
4. One tag per `AI_INDEX.md` unless areas are truly independent.

---

## Examples

| Product | Domain | Example tag |
|---------|--------|-------------|
| Web app | `app` | `app.checkout.ui.gen1` |
| HTTP API | `api` | `api.billing.endpoints.gen1` |
| Monorepo package | `pkg` | `pkg.shared.lib.gen1` |

---

## Steps

1. Run install with `--domain yourdomain`.
2. Copy [templates/project.domain.seed.gen1.md](../../philosophy/genes/templates/project.domain.seed.gen1.md) → `philosophy/genes/yourdomain.project.seed.gen1.md`.
3. Add Tier 0/1 rows to the navigation map.
4. Add `AI_INDEX.md` at the heaviest folder.

Stack hints (node-ts, python-api, monorepo, mobile) ship in the kit as `meta/docs/STACK_PROFILES.md` when you vendor the full `genetic-ai-starter` folder.
