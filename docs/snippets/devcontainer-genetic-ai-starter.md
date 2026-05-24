# Dev Container — genetic-ai-starter

Add to `.devcontainer/devcontainer.json`:

```json
{
  "postCreateCommand": "git submodule update --init --recursive && node tools/genetic-ai-starter/scripts/bootstrap-standard.mjs --target . --yes --skip-submodule --project-name \"Dev\" --domain app"
}
```

Assume `tools/genetic-ai-starter` is committed as a submodule in the template repo.
