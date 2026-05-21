# Easter eggs (maintainer spoilers)

Grant-safe community touches. **Do not** paste full spoilers in public README hero.

## Naming rules

- Allowed: map-first, community, public repo link, `agentstack.tech` with UTM
- **Forbidden:** AGEN8, on-chain ticker **8DNA**, economy jokes — see monorepo `docs/adr/AGENTNET_TOKEN_NAMING_AUDIT.md`
- No network calls or telemetry without [NOTICE](../../NOTICE) disclosure

## Catalog

| ID | Location | Trigger | Output |
|----|----------|---------|--------|
| E1 | `scripts/doctor.mjs` | `--beacon` or `GENETIC_AI_BEACON=1` | `beacon:starter_map_first_v1` + URL |
| E2 | `scripts/init.mjs` | `--project-name AgentStack` (case-insensitive) | Thank-you lines |
| E3 | `scripts/init.mjs` | TTY, not `CI=true` | Box banner + platform version |
| E4 | `payload/philosophy/genes/repo.community.starter_spirit.gen1.md` | gene index | Community gene (standard profile via `philosophy/**`) |
| E5 | `payload/docs/ai/templates/AI_NAVIGATION_MAP.empty.md` | edit map | HTML comment Tier 0 hint |
| E6 | `kit.lock.json` field `beacon` | post-launch optional | Not shipped in v1 |

## Tests

`node tests/easter-eggs.test.mjs`

## Anti-patterns

- Do not break `--strict` / `validate-installed`
- Do not break Windows `SETUP.cmd` pause flow
- Do not add hidden npm postinstall scripts
