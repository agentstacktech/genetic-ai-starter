# Post-upgrade checklist (tenant projects)

After upgrading to genetic-ai-starter **0.4.13** (KIP v2.1):

1. Run `migrate-navigation-markers.mjs --target . --dry-run`, then `--write` if legacy map had no markers.
2. Run `upgrade.mjs --target . --yes` (preserve navigation default).
3. Run `doctor.mjs` and `validate-installed.mjs`.
4. If lock shows `kitSource.type: ephemeral`, add submodule (`--offer-submodule` on upgrade for commands).
5. Restore any intentional overrides from git history if you previously ran `--force-navigation`.
6. Commit lock + navigation files + optional `.genetic-ai/last-upgrade-report.json`.

## AgentScreen-style recovery

If Tier 1 rows were lost before KIP v2.1: recover from git history, wrap in `tenant-map:tier1` markers, re-run upgrade with preserve.
