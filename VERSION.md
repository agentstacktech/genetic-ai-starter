# Version — Genetic AI Starter Kit

## Policy

This kit has **no independent package semver**. It tracks the **AgentStack platform patch** (currently **0.4.11**).

| Source | When used |
|--------|-----------|
| `shared/constants.py` → `AGENTSTACK_CORE_VERSION` | Kit inside AgentStack monorepo |
| `genetic-ai-starter/PLATFORM_VERSION` | Standalone kit copy |
| `KIT_MANIFEST.json` → `version` | Must match resolved platform version |
| `$env:AGENTSTACK_CORE_VERSION` | Optional override |

`kit.lock.json` in consumer projects records `kitVersion` and `platformVersionSource` at install time.

---

## Maintainer sync (monorepo)

After bumping `AGENTSTACK_CORE_VERSION`:

```bash
node genetic-ai-starter/scripts/sync-kit-version.mjs
node genetic-ai-starter/scripts/validate-kit.mjs
```

Updates `PLATFORM_VERSION`, `KIT_MANIFEST.json`, and version strings in selected docs.

---

## Consumer lifecycle

| Action | Command |
|--------|---------|
| **Setup wizard** | `SETUP.cmd` (Windows) / `node scripts/init.mjs` |
| Install | `install.mjs` / `install.cmd` |
| Repair | `repair.mjs` or `install.ps1 -Repair` |
| Upgrade | `upgrade.mjs` |
| Health | `doctor.mjs` |

See [CHANGELOG.md](CHANGELOG.md) for release notes and [meta/docs/INSTALL.md](meta/docs/INSTALL.md) for usage.

---

## Roadmap

Open kit work is tracked in GitHub Issues on [agentstacktech/genetic-ai-starter](https://github.com/agentstacktech/genetic-ai-starter/issues). Monorepo maintainers use [GAP_REGISTER.md](../docs/genetic-ai-starter-maintainers/GAP_REGISTER.md) (not in the public kit mirror).
