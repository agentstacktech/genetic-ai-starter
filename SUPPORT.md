# Support

## Supported versions

Only the **latest** `platform-*` release tag is fully supported. See [CHANGELOG.md](CHANGELOG.md) and [SECURITY.md](SECURITY.md).

## Getting help

1. [FAQ.md](FAQ.md) — install, Windows, gitignore, profiles
2. [meta/docs/TROUBLESHOOTING.md](meta/docs/TROUBLESHOOTING.md)
3. [GitHub Discussions](https://github.com/agentstacktech/genetic-ai-starter/discussions) — Q&A and showcase
4. GitHub Issues — bugs and gene proposals on the **public mirror** repo

## Upgrading kit version

If your project has `.genetic-ai/kit.lock.json`:

```bash
node /path/to/genetic-ai-starter/scripts/upgrade.mjs --target /path/to/your-project
node /path/to/genetic-ai-starter/scripts/doctor.mjs --target /path/to/your-project
```

Re-run install with the same profile if `upgrade` reports philosophy gaps.

## npm vs monorepo path

- **Consumers:** `npx @agentstack/genetic-ai-starter init --yes --target . ...`
- **Maintainers / monorepo:** `node genetic-ai-starter/scripts/install.mjs`

Do not rely on monorepo-relative paths in published consumer projects.

## AgentStack platform

Optional SDK/MCP integration: https://agentstack.tech/?utm_source=genetic-ai-starter

Platform support is separate from kit install issues.
