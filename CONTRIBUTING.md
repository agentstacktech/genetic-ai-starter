# Contributing

Thank you for improving the Genetic AI Starter Kit.

## Where to contribute

| Change type | Repository |
|-------------|------------|
| Bugs, features, genes, docs for the **public kit** | [agentstacktech/genetic-ai-starter](https://github.com/agentstacktech/genetic-ai-starter) — **open issues and PRs here** (`main`) |
| AgentStack platform runtime, MCP, frontend | [agentstacktech/AgentStack](https://github.com/agentstacktech/AgentStack) (`master`) — label `kit` when the fix lands in monorepo SoT `genetic-ai-starter/` |

This folder in the platform monorepo is the **source of truth**. Releases sync to the public mirror via maintainers (see [MAINTAINERS.md](MAINTAINERS.md)). Canonical URLs: [REPOSITORY_LINKS.md](meta/docs/REPOSITORY_LINKS.md).

## Developer certificate of origin

By submitting a pull request, you certify that your contribution is your original work and you license it under the project's Apache-2.0 license (Developer Certificate of Origin 1.1):

```
By contributing to this project, I certify that my contribution is my
original work and I have the right to submit it under the Apache-2.0 license.
```

## Pull request checklist

- [ ] `node scripts/validate-kit.mjs` passes
- [ ] Relevant tests in `tests/` pass (including `easter-eggs.test.mjs` if touching scripts/payload)
- [ ] [CHANGELOG.md](CHANGELOG.md) updated for user-visible changes
- [ ] No secrets, credentials, or `.env` files committed
- [ ] Genetic tags follow `docs/AI_INDEXING_SYSTEM.md` shape (`domain.subsystem.role.gen1`)

## Proposing a new gene

1. Open an issue using the **Gene proposal** template (or Discussions → Ideas).
2. Scaffold locally: `node scripts/new-gene.mjs --type domain|subsystem|adr`
3. Add a row to `payload/philosophy/genes/GENE_INDEX.md` and map tier in consumer `AI_NAVIGATION_MAP.md` docs.
4. Keep genes **grant-safe**: no prohibited tickers (see monorepo `docs/adr/AGENTNET_TOKEN_NAMING_AUDIT.md`).

## Payload redistribution (appendix)

Files under `payload/` are intended for **redistribution** under Apache-2.0:

- Philosophy genes and templates
- Cursor rules (`.mdc`) and skills
- Documentation templates under `payload/docs/ai/`

**Not redistributed** from the monorepo: platform runtime, patent export packages, proprietary gene manager tooling.

Monorepo maintainers run [PREFLIGHT_CHECKLIST.md](../docs/genetic-ai-starter-maintainers/PREFLIGHT_CHECKLIST.md) before each mirror release (not in the public kit mirror).

## SPDX headers

New files in this kit may include:

```
SPDX-License-Identifier: Apache-2.0
```

Bulk header migration is optional; not required for every PR.
