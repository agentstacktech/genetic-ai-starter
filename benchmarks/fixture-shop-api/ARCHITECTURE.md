# Architecture (outdated draft)

> **Warning:** This document was written for v0.1 and may be wrong.

## Entry point

Production HTTP server starts from **`src/index.ts`** (see `npm start`).

## Modules

- Auth — `src/auth/`
- Catalog — `src/catalog/`
- Billing — `src/billing/` (includes legacy checkout experiments)
- Webhooks — `src/webhooks/`
