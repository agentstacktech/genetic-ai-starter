# Getting started — Genetic AI Starter Kit

## Easiest path (recommended)

1. Install **Node.js 18+**.
2. Open the **kit folder** (`genetic-ai-starter/`, not your app yet).
3. Run the setup wizard:

| OS | Command |
|----|---------|
| **Windows** | Double-click **`SETUP.cmd`** |
| **macOS / Linux** | `node scripts/init.mjs` |

4. In the wizard: choose target folder → project name → domain → profile → confirm.
5. Open the target project in Cursor → read `AGENTS.md` and `docs/ai/AI_NAVIGATION_MAP.md`.

Profiles explained: [PROFILE_COMPARISON.md](PROFILE_COMPARISON.md).

GitHub: kit [agentstacktech/genetic-ai-starter](https://github.com/agentstacktech/genetic-ai-starter) · platform [agentstacktech/AgentStack](https://github.com/agentstacktech/AgentStack) — [REPOSITORY_LINKS.md](REPOSITORY_LINKS.md).

---

## Manual install

See [INSTALL.md](INSTALL.md) · Windows: [INSTALL_WINDOWS.md](INSTALL_WINDOWS.md) · Problems: [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

```bash
node /path/to/genetic-ai-starter/scripts/install.mjs \
  --target /path/to/your-project \
  --profile standard \
  --project-name "My App" \
  --domain app \
  --strict
```

Windows CMD:

```cmd
set PROJECT_NAME=My App
set PROFILE=standard
C:\path\to\genetic-ai-starter\scripts\install.cmd C:\path\to\your-project
```

---

## Philosophy folder

| Situation | Behavior |
|-----------|----------|
| No `philosophy/` | Full starter copy |
| Complete `philosophy/` | Kept (warn); use `--force-philosophy` to replace |
| **Incomplete** `philosophy/` | **Auto-repaired** on install |

---

## After install

1. Customize `docs/ai/AI_NAVIGATION_MAP.md`.
2. Add `AI_INDEX.md` per large subsystem.
3. `node <kit>/scripts/doctor.mjs --target <project>` — see `docs/ai/OPERATIONS.md` in the project.

## Lifecycle

```bash
node <kit>/scripts/repair.mjs --target <project>
node <kit>/scripts/upgrade.mjs --target <project>
node <kit>/scripts/uninstall.mjs --target <project>
```
