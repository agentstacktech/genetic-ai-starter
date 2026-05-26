# AI navigation map — {{PROJECT_NAME}}

**Purpose:** One screen for agents and humans — where to read **before** grepping.

**Workflow:** `.cursor/rules/genetic-navigation.mdc` · [AI_INDEXING_SYSTEM.md](AI_INDEXING_SYSTEM.md)

---

<!-- genetic-ai-map:tier0:begin -->
## Tier 0 — Always relevant

| Genetic tag | Path | When to read |
|-------------|------|--------------|
| `repo.philosophy.master.gen1` | [philosophy/PHILOSOPHY_INDEX.md](../../philosophy/PHILOSOPHY_INDEX.md) | Principles, starter genes |
| `repo.engineering.controlled_changes.gen1` | [philosophy/genes/repo.engineering.controlled_changes.gen1.md](../../philosophy/genes/repo.engineering.controlled_changes.gen1.md) | How agents edit code |
| `repo.navigation.map.gen1` | [docs/ai/AI_NAVIGATION_MAP.md](AI_NAVIGATION_MAP.md) | This registry |
| `{{DOMAIN}}.app.root.gen1` | `src/` | Application source (adjust path) |
| `{{DOMAIN}}.app.tests.gen1` | `tests/` | Tests (adjust path) |
<!-- genetic-ai-map:tier0:end -->

<!-- tenant-map:tier1:begin -->
## Tier 1 — Large subsystems

_Add rows when subsystems gain `AI_INDEX.md` (~10+ integration points)._

| Genetic tag | Path | When to read |
|-------------|------|--------------|
| *(example)* `{{DOMAIN}}.auth.gen1` | `src/auth/` | Auth boundary |
<!-- tenant-map:tier1:end -->

<!-- genetic-ai-map:tier1-seed:begin -->
<!-- Kit seed rows for new projects -->
<!-- genetic-ai-map:tier1-seed:end -->

---

## See also

- [CUSTOMIZE_DOMAIN.md](CUSTOMIZE_DOMAIN.md)
- [templates/AI_NAVIGATION_MAP.empty.md](templates/AI_NAVIGATION_MAP.empty.md)
