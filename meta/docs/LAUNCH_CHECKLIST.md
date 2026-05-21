# Public launch checklist

Execute after **hard gates** in [RELEASE_RUNBOOK.md](RELEASE_RUNBOOK.md).

## Hard gates

- [ ] `LICENSE` + `NOTICE` on mirror
- [ ] CI green (easter-eggs, windows job)
- [ ] PREFLIGHT signed
- [ ] `npm pack` smoke passed

## Soft gates (document if skipped)

- [x] G38 benchmark matrix (RESULTS/ANALYSIS/run-meta.json)
- [ ] Social preview image uploaded
- [ ] example-saas-api demo repo

## Private mirror smoke (oss-private-smoke)

1. Create **private** [agentstacktech/genetic-ai-starter](https://github.com/agentstacktech/genetic-ai-starter)
2. Run release Action once → verify CI
3. Branch protection: require `ci`, block force push
4. Flip **public** only when hard gates pass

## Announce (T0)

- [ ] GitHub Release `platform-0.4.11`
- [ ] npm publish `@agentstack/genetic-ai-starter@0.4.11`
- [ ] Pin Discussions quickstart
- [ ] Update monorepo [docs/AI_NAVIGATION_MAP.md](../../../docs/AI_NAVIGATION_MAP.md) public URL

## Comms templates

- [meta/docs/COMMS_TEMPLATES.md](COMMS_TEMPLATES.md) — HN, blog draft
