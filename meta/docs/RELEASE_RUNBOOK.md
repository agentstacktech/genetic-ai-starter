# Release runbook — mirror + npm

**Order:** monorepo tests → tag → sync Action → mirror CI → npm → public announcement.

## 1. Pre-release

- [ [PREFLIGHT_CHECKLIST.md](PREFLIGHT_CHECKLIST.md) ] secrets + payload license
- [ ] `node scripts/validate-kit.mjs`
- [ ] All `tests/*.test.mjs` + `benchmarks/tests/*.test.mjs`
- [ ] [CHANGELOG.md](../../CHANGELOG.md) section for platform version

## 2. Tag (monorepo)

```bash
git tag genetic-ai-starter-v0.4.11
git push origin genetic-ai-starter-v0.4.11
```

## 3. Sync to public mirror

Workflow: `.github/workflows/release-genetic-ai-starter.yml` (monorepo)

- `workflow_dispatch` or tag push
- Secrets: `KIT_MIRROR_TOKEN`, `KIT_MIRROR_REPO` (= `agentstacktech/genetic-ai-starter`) — see [REPOSITORY_LINKS.md](REPOSITORY_LINKS.md)
- Parity job compares file manifest hash
- Include/exclude rules: [MIRROR_SYNC.md](MIRROR_SYNC.md)

## 4. Mirror CI

Public repo `.github/workflows/ci.yml` must be green (Linux + Windows).

## 5. npm

```bash
cd genetic-ai-starter
npm pack
npm publish --access public --provenance
```

Requires: org 2FA, trusted publishing OIDC (see `.github/workflows/release.yml`).

## 6. GitHub Release (mirror)

- Tag `platform-0.4.11`
- Notes from CHANGELOG
- Optional: attach `npm pack` tarball

## 7. Template repo

Re-generate `genetic-ai-starter-template` from `npx` init smoke — [PUBLISHING.md](PUBLISHING.md).

---

## Rollback (emergency)

| Asset | Action |
|-------|--------|
| npm `latest` | `npm dist-tag add @agentstack/genetic-ai-starter@<prev> latest` — avoid yank unless security |
| Mirror tag | Document bad tag in Release; push fix tag `platform-0.4.11.1` |
| Monorepo | Revert commit; re-run sync with previous tag |

Do **not** force-push `main` on public mirror.

## Private smoke (before public)

See [LAUNCH_CHECKLIST.md](LAUNCH_CHECKLIST.md).
