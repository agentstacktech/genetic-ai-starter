# Install guide — Genetic AI Starter Kit (canonical)

**Platform version:** tracks `AGENTSTACK_CORE_VERSION` (see `PLATFORM_VERSION` in kit root when used standalone).

---

## Interactive setup (recommended)

Run from the **kit folder** (not from your app repo):

| OS | Entry |
|----|--------|
| Windows | Double-click **`SETUP.cmd`** at kit root |
| Any | `node scripts/init.mjs` |

The wizard asks for target path, project name, domain, profile, and optional AgentStack extension, then runs `install.mjs` with `--strict`.

Non-interactive: `node scripts/init.mjs --yes --target <path> --profile standard --project-name "My App" --domain app`

---

## Prerequisites

| Requirement | Notes |
|-------------|--------|
| Node.js **18+** | `node -v` |
| Git repository | New or existing project root |
| Kit location | Monorepo path **or** standalone copy with `scripts/` + `PLATFORM_VERSION` |

---

## Choose deployment layout

| Layout | Kit path example | Version source |
|--------|------------------|----------------|
| **Inside AgentStack monorepo** | `.../AgentStack/genetic-ai-starter/` | `shared/constants.py` |
| **Standalone copy** | `C:\Projects\genetic-ai-starter\` | `PLATFORM_VERSION` + `KIT_MANIFEST.json` |

The install scripts live **in the kit**, not inside your app. Your app is only `--target`.

---

## Install commands

### Linux / macOS

```bash
node /path/to/genetic-ai-starter/scripts/install.mjs \
  --target /path/to/your-project \
  --profile standard \
  --project-name "My App" \
  --domain app \
  --strict
```

### Windows (recommended)

**CMD** (bypasses execution policy; one line):

```cmd
set PROJECT_NAME=My App
set DOMAIN=app
set PROFILE=standard
C:\Projects\genetic-ai-starter\scripts\install.cmd C:\Projects\your-project
```

**Node** (one line):

```text
node "C:\Projects\genetic-ai-starter\scripts\install.mjs" --target "C:\Projects\your-project" --profile standard --project-name "My App" --domain app --strict
```

**PowerShell** — use `-ExecutionPolicy Bypass -File`, not bare `& install.ps1` (often blocked). Full guide: [INSTALL_WINDOWS.md](INSTALL_WINDOWS.md).

### Install into current directory

```cmd
cd /d C:\Projects\your-project
C:\Projects\genetic-ai-starter\scripts\install-here.cmd
```

---

## Profiles

**Full comparison (files, agent behavior, AgentStack):** [PROFILE_COMPARISON.md](PROFILE_COMPARISON.md).

| Profile | Use when | AgentStack extension |
|---------|----------|----------------------|
| **minimal** | Tiny repos; stub map + 2 rules only | Optional: `--with-agentstack` |
| **standard** | **Default** — philosophy + `docs/ai/` + 5 rules + 4 skills | Optional: `--with-agentstack` |
| **full** | Building on AgentStack (MCP, SDK, 8DNA) + CI sample workflow | **Included** |
| **founder** | Same files as `full`; lock + docs emphasize direct-ship (no default personal canary) | **Included** |

`full` and `founder` copy the same payload paths (~41 files); difference is mainly `profile` in `.genetic-ai/kit.lock.json` and documented agent priority for `repo.engineering.founder_direct_ship.gen1`. The founder gene file is also present on disk with `standard`, but indexed for founder-led sessions.

---

## Flags reference

| Flag | Purpose |
|------|---------|
| `--target` | Project root (required) |
| `--profile` | `minimal` \| `standard` \| `full` \| `founder` |
| `--project-name` | Substituted into `AGENTS.md` |
| `--domain` | Genetic tag prefix (`app`, `api`, …) |
| `--strict` | Fail if `{{PLACEHOLDER}}` remain |
| `--merge-philosophy` | Keep existing genes; add missing |
| `--force-philosophy` | Overwrite starter `philosophy/` |
| `--with-agentstack` | Platform extension overlay |
| `--skills global` | Skills under `~/.cursor/skills/` |
| `--gitignore-kit full` | Merge `.gitignore` block so kit docs/rules are not committed |
| `--gitignore-kit none` | Default — kit files may be committed |

**Automatic:** if `philosophy/` exists but is **incomplete**, install forces philosophy refresh (no flag needed).

Install **always** runs `validate-installed` at the end; exit code 1 on failure.

---

## After install

1. Open project in Cursor.
2. Edit [`docs/ai/AI_NAVIGATION_MAP.md`](../../payload/docs/ai/AI_NAVIGATION_MAP.md) — Tier 0 / Tier 1 for your tree.
3. Add [`AI_INDEX.md`](../../payload/docs/ai/templates/AI_INDEX.template.md) per large subsystem (~10+ integration points).
4. Run `doctor.mjs` periodically.

Consumer copy in target: `docs/ai/OPERATIONS.md`.

---

## Upgrade / repair / uninstall

| Action | Command |
|--------|---------|
| **Repair** (broken links, partial philosophy) | `node <kit>/scripts/repair.mjs --target <project>` · Windows: `repair.ps1` |
| **Upgrade** (new kit version) | `node <kit>/scripts/upgrade.mjs --target <project>` |
| **Uninstall** | `node <kit>/scripts/uninstall.mjs --target <project>` |

Windows repair: `repair.cmd <project>` or `install.cmd` with repair via `repair.mjs`

---

## Verify kit before shipping changes (maintainers)

```bash
node genetic-ai-starter/scripts/validate-kit.mjs
node genetic-ai-starter/tests/install.test.mjs
genetic-ai-starter\scripts\verify-install.cmd
```

---

## See also

- [PROFILE_COMPARISON.md](PROFILE_COMPARISON.md) — profile × AgentStack matrix (RU)
- [INSTALL_WINDOWS.md](INSTALL_WINDOWS.md) — Windows-specific pitfalls
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — error catalog
- [GETTING_STARTED.md](GETTING_STARTED.md) — short overview
- [STACK_PROFILES.md](STACK_PROFILES.md) — stack-specific Tier 0 hints (not install profiles)
