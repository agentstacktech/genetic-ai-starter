# ADR: Navigation contract (KIP v2.1)

**Status:** Accepted  
**Contract:** `contracts/NAVIGATION_CONTRACT.v1.json`

## Context

Consumer upgrades overwrote tenant navigation (`AI_NAVIGATION_MAP`, `AGENTS.md`) and `validate-installed` failed on maintainer-only links (e.g. `.cursorrules.fragment.md`).

## Decision

1. **Region markers** separate kit-owned vs tenant-owned markdown.
2. **Default merge mode:** `preserve_regions` on upgrade; `--force-navigation` replaces protected files from payload.
3. **Philosophy** remains `force_starter_on_upgrade` (independent policy).
4. **Lock** may record `navigationContractVersion`, `navigationPreserveDefault`, `kitSource.type: ephemeral`.

## Consequences

- Legacy consumers run `migrate-navigation-markers.mjs` once before first preserve upgrade.
- CI uses `last-upgrade-report.json` and documented exit codes.
