# Gene — `app.{{FEATURE}}.feature.gen1` (template)

**Genetic tag:** `app.{{FEATURE}}.feature.gen1`  
**Status:** DRAFT  

---

## Intent

AgentStack-integrated feature **{{FEATURE}}** for Fixture App.

---

## Scope

Boundary for **{{FEATURE}}** — SDK bootstrap, recipe, and local module stub.

---

## AI instructions

- Read [repo.platform.sdk.onboarding.gen1.md](../repo.platform.sdk.onboarding.gen1.md) before wiring SDK calls.
- Run recipe: `examples/agentstack/{{FEATURE}}/run.ts` after `ensureScope()`.
- Pair with `examples/agentstack/{{FEATURE}}/AI_INDEX.md` and `src/lib/{{FEATURE}}.ts`.

---

## Cross-links

- [repo.platform.sdk.recipes.gen1.md](../repo.platform.sdk.recipes.gen1.md)
- [src/lib/agentstack.ts](../../src/lib/agentstack.ts)
