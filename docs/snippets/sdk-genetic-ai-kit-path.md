# SDK consumer manifest — `geneticAiKitPath` (optional)

Align custom SDK wrappers with `resolve-kit-root.mjs`:

```json
{
  "geneticAiKitPath": "tools/genetic-ai-starter"
}
```

Resolution order in your app should mirror the kit: env `GENETIC_AI_KIT_ROOT` → lock `kitRootRel` → this manifest field → default `tools/genetic-ai-starter`.
