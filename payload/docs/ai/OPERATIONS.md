# Kit operations — {{PROJECT_NAME}}

Installed **genetic-ai-starter** (platform version in `.genetic-ai/kit.lock.json`).

## Health check

From your project root (path to kit required):

```bash
node <path-to-genetic-ai-starter>/scripts/doctor.mjs --target .
node <path-to-genetic-ai-starter>/scripts/validate-installed.mjs --target .
```

Windows:

```cmd
"<path-to-kit>\scripts\repair.cmd" .
```

```text
node "<path-to-kit>/scripts/repair.mjs" --target .
```

## Repair broken install

Symptoms: `validate-installed` reports broken links to `philosophy/`, or install warned that philosophy was skipped.

```bash
node <path-to-kit>/scripts/repair.mjs --target .
```

This re-runs install using `kit.lock.json` and refreshes `philosophy/`.

## Upgrade kit version

After updating the kit folder to a newer platform patch:

```bash
node <path-to-kit>/scripts/upgrade.mjs --target .
```

## Uninstall

```bash
node <path-to-kit>/scripts/uninstall.mjs --target .
```

Removes genetic-ai markers and kit-managed files listed in lock (does not delete your application code).

## Private install (not in git)

If install used `--gitignore-kit full` (or wizard option «Не коммитить»), `.gitignore` contains a `# genetic-ai-starter:begin` … `end` block. Kit files remain on disk for agents but are not committed.

To commit kit files later: remove that block from `.gitignore`, run `git add`, or reinstall with `--gitignore-kit none`.

**Already tracked in git?** `.gitignore` only affects untracked files. After enabling full block, stop tracking kit paths (keeps local files):

```bash
git rm -r --cached AGENTS.md philosophy docs/ai .cursor/rules/genetic-navigation.mdc .cursor/rules/engineering-controlled-changes.mdc .cursor/rules/genetic-index-authoring.mdc .cursor/rules/engineering-tool-discipline.mdc .cursor/rules/engineering-planning-todos.mdc .cursor/rules/platform-vs-tenant-canary.mdc .cursor/skills .genetic-ai 2>/dev/null
git commit -m "Stop tracking local genetic-ai-starter kit files"
```

Adjust paths to match your profile (minimal installs fewer rules).
