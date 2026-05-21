# Pre-flight checklist — OSS mirror push

Run before the first sync to [agentstacktech/genetic-ai-starter](https://github.com/agentstacktech/genetic-ai-starter).

## Secrets (pf-1)

- [ ] `gitleaks detect --source genetic-ai-starter/` — zero findings (or document false positives)
- [ ] No `.env`, API keys, VPS credentials, or private keys in tree
- [ ] No real tokens in `fixtures/` or `benchmarks/`
- [ ] `KIT_MIRROR_TOKEN` stored only in GitHub Actions secrets (never committed)

## Payload license (pf-2)

- [ ] All files under `payload/philosophy/genes/`, `.cursor/rules`, `.cursor/skills` are original or Apache-2.0 compatible
- [ ] No proprietary blobs from monorepo runtime (`gene_manager.py`, patents package) copied into kit
- [ ] See [CONTRIBUTING.md](../../CONTRIBUTING.md) appendix «Payload redistribution»

## CI (pf-5)

- [ ] Monorepo workflow `.github/workflows/genetic-ai-starter.yml` green locally or on PR
- [ ] `node genetic-ai-starter/scripts/validate-kit.mjs`
- [ ] All `genetic-ai-starter/tests/*.test.mjs` pass

## Sign-off

| Date | Maintainer | gitleaks | CI |
|------|------------|----------|-----|
| | | | |
