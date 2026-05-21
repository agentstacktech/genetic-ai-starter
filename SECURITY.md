# Security policy

## Supported versions

Only the **latest platform-tagged release** of Genetic AI Starter Kit is supported (e.g. `platform-0.4.11`). Older tags receive best-effort fixes only if they affect install integrity or secret leakage.

## Reporting a vulnerability

1. **Preferred:** [GitHub Security Advisories](https://github.com/AgentStack/genetic-ai-starter/security/advisories) on the public mirror repository.
2. **Alternative:** Open a private report via repository maintainers listed in [MAINTAINERS.md](MAINTAINERS.md).

Please do not open public issues for undisclosed security problems.

## Disclosure timeline

- Acknowledgment within **7 days**
- Fix or mitigation plan within **90 days** for confirmed issues
- Coordinated disclosure after a patch release when applicable

## Scope

In scope:

- `scripts/install.mjs`, `init.mjs`, and related kit scripts (path traversal, arbitrary file write)
- Published npm package `@agentstack/genetic-ai-starter`
- CI workflows in this repository

Out of scope:

- Vulnerabilities in consumer applications created with the kit
- AgentStack platform runtime (report to the main AgentStack monorepo)

## npm integrity

Install from the official package name `@agentstack/genetic-ai-starter` on the public npm registry. Verify release tags match [CHANGELOG.md](CHANGELOG.md).
