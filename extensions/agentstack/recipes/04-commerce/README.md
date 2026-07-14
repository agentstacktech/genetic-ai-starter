# 04 — Commerce

Discover headless commerce via `sdk.commerce` (`@agentstack/sdk/commerce` facade).

## Env

- `AGENTSTACK_EMAIL` / `AGENTSTACK_PASSWORD`
- `AGENTSTACK_PROJECT_ID`

## Run

```bash
npm run recipe:04-commerce
```

## Surface

- `sdk.commerce.guidance.getCatalogHints`
- `sdk.commerce.discovery.listOffers`

Gate with `getCapabilityMatrix()` before calling in production.
