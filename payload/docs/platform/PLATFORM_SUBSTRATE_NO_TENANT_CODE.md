# Platform substrate — no tenant runtime code

**Gene:** `repo.engineering.platform_substrate_no_tenant_code.gen1`

Platform server code (`shared/`, Core services, `@agentstack/sdk`) stays generic — parameterized by `project_id` + 8DNA. Tenant brands and flagship PIDs belong in hosted-vertical, ops scripts, or tenant DNA — not `if project_id == …` in runtime.

**Full doc (canonical monorepo):** `docs/platform/PLATFORM_SUBSTRATE_NO_TENANT_CODE.md` on the AgentStack platform repository.
