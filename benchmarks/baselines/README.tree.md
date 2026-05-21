# shop-api

Fictional shop HTTP API (benchmark fixture).

## Repository layout

```
src/
  server.ts          # (listed in old ARCHITECTURE as index — verify before editing)
  auth/              # JWT, session middleware
  catalog/           # /api/products, list filters
  billing/           # invoices; legacy/ has old experiments
  webhooks/          # delivery + signing
  lib/httpClient.ts  # shared HTTP for webhooks
  tools/devServer.ts # local dev only
```

## Where to start

- **HTTP routing:** `src/catalog/routes.ts`, `src/webhooks/delivery.ts`
- **Auth:** `src/auth/` folder
- **Billing checkout:** see `src/billing/`

See also outdated `ARCHITECTURE.md` (may be wrong).
