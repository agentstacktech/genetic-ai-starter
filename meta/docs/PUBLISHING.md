# Publishing roadmap — Genetic AI Starter Kit

## Current (platform 0.4.11)

| Channel | Status |
|---------|--------|
| Monorepo folder `genetic-ai-starter/` | Available |
| `node <kit>/scripts/install.mjs` | Available |
| Standalone copy + `PLATFORM_VERSION` | Available |
| Windows `install.ps1` / `install.cmd` | Available |

Version = `AGENTSTACK_CORE_VERSION` (monorepo) or `PLATFORM_VERSION` (standalone).

---

## G35 — GitHub template repository (open)

**Goal:** “Use this template” → working repo with kit already installed.

### Checklist

1. Create empty template repo (private until smoke-tested).
2. Run install in template root:
   ```bash
   node scripts/install.mjs --target . --profile standard --project-name "{{REPO_NAME}}" --domain app --strict
   ```
3. Include minimal `src/README.md` placeholder and `.github/workflows/genetic-ai-validate.yml` from `payload/.github/workflows/genetic-ai-validate.yml.sample` (adjust paths to fetch kit or vendor scripts).
4. Template README: link to [INSTALL.md](INSTALL.md), not monorepo-only paths.
5. Tag template release with platform version (e.g. `platform-0.4.11`).

### Acceptance

- Clone template → `doctor.mjs` passes with kit path documented in README.

---

## G35 — npm package (ready to publish)

**OSS launch artifacts:** `LICENSE`, `NOTICE`, `bin/genetic-ai-init.js`, `.github/workflows/release.yml` (trusted publishing + provenance). Operator steps: [RELEASE_RUNBOOK.md](RELEASE_RUNBOOK.md).

## G35 — npm package (historical sketch)

**Goal:** `npx @agentstack/genetic-ai-starter init --target ./my-app`

### Proposed `package.json` (sketch)

```json
{
  "name": "@agentstack/genetic-ai-starter",
  "version": "0.4.11",
  "bin": { "genetic-ai-init": "bin/init.js" },
  "files": ["payload", "profiles", "extensions", "scripts", "PLATFORM_VERSION", "KIT_MANIFEST.json"]
}
```

`bin/init.js` resolves kit root from package directory and spawns `install.mjs` with forwarded argv.

### Checklist

1. Publish dry-run with `npm pack` / private registry test.
2. Document env overrides (`AGENTSTACK_CORE_VERSION`).
3. Do **not** introduce a second semver line — npm version tracks platform patch.

---

## G36 — Init wizard (open)

- Prompt: target directory, profile, project name, domain, AgentStack extension.
- Show resolved file list (dry-run) before write.
- Call existing `install.mjs` — no duplicate install logic.

---

## Consumer CI (available today)

Copy and adapt:

`payload/.github/workflows/genetic-ai-validate.yml.sample`

Point `validate-installed.mjs` at vendored kit path or monorepo submodule.

---

## Versioning (maintainers)

- Do **not** invent independent kit semver.
- On platform bump: `sync-kit-version.mjs` → `validate-kit.mjs` → changelog.
- Procedure: [`docs/VERSIONING.md`](../../../docs/VERSIONING.md).
