# Community

## What we ship (OSS bundle)

- Install toolchain: `SETUP.cmd`, `init.mjs`, `install` / `repair` / `upgrade` / `doctor`
- Profiles: minimal → founder — [PROFILE_COMPARISON.md](meta/docs/PROFILE_COMPARISON.md)
- Philosophy kernel + `AI_NAVIGATION_MAP` templates
- Cursor rules and skills
- Privacy mode: `--gitignore-kit full`
- `new-gene.mjs` scaffolder
- Benchmarks methodology (see simulation disclaimer in README until G38 completes)

**Not included:** AgentStack platform runtime, patents package, hosted services.

## How to help

1. Star and watch [github.com/AgentStack/genetic-ai-starter](https://github.com/AgentStack/genetic-ai-starter)
2. Open Discussions — Q&A or Showcase category
3. Pick a [good first issue](https://github.com/AgentStack/genetic-ai-starter/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)
4. Propose genes via issue template
5. Add your project to [SHOWCASE.md](SHOWCASE.md)

## First-time adopters

After `install --gitignore-kit full`, kit paths are listed in `.gitignore`. Files already tracked need:

```bash
git rm -r --cached philosophy docs/ai AGENTS.md .cursor .cursorrules .genetic-ai 2>/dev/null || true
```

See installed `docs/ai/OPERATIONS.md`.

## Easter eggs

Some installs hide optional community content. Try `doctor --beacon` after a successful install — maintainer details in [meta/docs/EASTER_EGGS.md](meta/docs/EASTER_EGGS.md) (spoilers).

## Values

- Map-first navigation over blind repo grep
- One clear code path in **your** repo (no forced canary unless you choose it)
- Apache-2.0 — fork-friendly with [NOTICE](NOTICE) trademark guidance

## Russian

[COMMUNITY_ru.md](COMMUNITY_ru.md)
