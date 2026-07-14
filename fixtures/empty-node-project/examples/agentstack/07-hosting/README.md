# 07 — Hosting

Publish minimal HTML with `sdk.hosting.quickStart` (`sdk.hosting.gen2`).

## Env

- `AGENTSTACK_EMAIL` / `AGENTSTACK_PASSWORD`
- `AGENTSTACK_PROJECT_ID`
- `HOSTING_BUCKET` — path segment (default `sdk-recipe-demo`)
- `HOSTING_DRY_RUN=1` — skip publish, verify auth/scope only
- `HOSTING_PUBLISH=0` — create without publish

## Run

```bash
npm run recipe:07-hosting
```
