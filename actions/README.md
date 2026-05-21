# Composite action (v1.1)

Post-launch: publish `validate-genetic-ai` composite action on the public mirror.

**Consumer usage (planned):**

```yaml
- uses: AgentStack/genetic-ai-starter/actions/validate@v1
  with:
    target: .
    kit-version: '0.4.11'
```

Draft composite: [validate/action.yml](validate/action.yml) — tag as `@v1` on public mirror post-launch.

Until published, copy [payload/.github/workflows/genetic-ai-validate.yml.sample](../payload/.github/workflows/genetic-ai-validate.yml.sample) or [template-repo/.github/workflows/genetic-ai-validate.yml](../template-repo/.github/workflows/genetic-ai-validate.yml).
