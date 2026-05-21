# Bootstrap checklist

## Day 1

- [ ] Install kit (`standard` profile) — see [INSTALL.md](INSTALL.md)
- [ ] Fill Tier 0 in `docs/ai/AI_NAVIGATION_MAP.md`
- [ ] `doctor.mjs` + `validate-installed.mjs` pass (install runs validate automatically)
- [ ] Bookmark `docs/ai/OPERATIONS.md` for repair/upgrade
- [ ] One agent task using map → index workflow

## Week 1

- [ ] First `AI_INDEX.md` on largest subsystem
- [ ] First domain gene: `node <kit>/scripts/new-gene.mjs --target . --type domain --domain <domain>`
- [ ] First ADR from `docs/ai/adr/ADR_TEMPLATE.md` (if architectural decision made)

## Month 1

- [ ] Tier 1 rows for subsystems with 10+ integration points
- [ ] Optional: consumer CI workflow from `payload/.github/workflows/genetic-ai-validate.yml.sample`
- [ ] Review ROI metrics in `meta/docs/ROI_PLAYBOOK.md`
