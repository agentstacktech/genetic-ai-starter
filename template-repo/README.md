# genetic-ai-starter-template

GitHub Template repository for new projects. **Do not** vendor monorepo paths — use published npm kit.

## Use this template

1. Click **Use this template** on GitHub.
2. Clone your new repo.
3. Install:

```bash
npx @agentstack/genetic-ai-starter@0.4.11 init --yes --target . --profile standard --project-name "My App" --domain app
```

4. Read order in your repo: `AGENTS.md` → `docs/ai/AI_NAVIGATION_MAP.md` → fill Tier 0/1.

5. Verify:

```bash
node node_modules/@agentstack/genetic-ai-starter/scripts/doctor.mjs --target .
```

Or use kit path from install output.

## CI

Copy [.github/workflows/genetic-ai-validate.yml](.github/workflows/genetic-ai-validate.yml) — validates installed kit in consumer repo.

## Docs

- Kit: https://github.com/agentstacktech/genetic-ai-starter
- Install: https://github.com/agentstacktech/genetic-ai-starter/blob/main/meta/docs/INSTALL.md

## Maintainer publish

Regenerate template from clean `npx init` dry-run per [meta/docs/PUBLISHING.md](../meta/docs/PUBLISHING.md) on each platform tag.
