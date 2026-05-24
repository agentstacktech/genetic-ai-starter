# Kit operations — {{PROJECT_NAME}}

Installed **genetic-ai-starter** (platform version in `.genetic-ai/kit.lock.json`).

**Integration:** [INTEGRATION_MODES](https://github.com/agentstacktech/genetic-ai-starter/blob/main/meta/docs/INTEGRATION_MODES.md) · upstream [DOC_HUB](https://github.com/agentstacktech/genetic-ai-starter/blob/main/meta/docs/DOC_HUB.md).

## Health check

From your project root (submodule layout):

```bash
node tools/genetic-ai-starter/scripts/doctor.mjs --target .
node tools/genetic-ai-starter/scripts/validate-installed.mjs --target .
```

Or CI: `node tools/genetic-ai-starter/scripts/ci-kit.mjs --target .`

Windows:

```cmd
tools\genetic-ai-starter\scripts\repair.cmd .
```

## Repair broken install

```bash
node tools/genetic-ai-starter/scripts/repair.mjs --target .
```

## Upgrade kit version

Sync submodule pin then re-install navigation payload:

```bash
node tools/genetic-ai-starter/scripts/upgrade.mjs --target . --sync-submodule
```

## Uninstall

```bash
node tools/genetic-ai-starter/scripts/uninstall.mjs --target .
```

Removes navigation payload and `.genetic-ai/` metadata. **Does not** remove the `tools/genetic-ai-starter` git submodule by default.

Optional (destructive): `--remove-submodule` runs `git submodule deinit` for the path in lock.

## Private install (not in git)

If install used `--gitignore-kit full`, navigation paths are in `.gitignore` but the **submodule** at `tools/genetic-ai-starter` remains committed for scripts.

See [INTEGRATION_MODES](https://github.com/agentstacktech/genetic-ai-starter/blob/main/meta/docs/INTEGRATION_MODES.md) § gitignore-kit full + submodule.
