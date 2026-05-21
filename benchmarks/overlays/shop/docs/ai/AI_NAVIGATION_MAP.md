# AI navigation map — shop-api (benchmark)

**Purpose:** Registry for shop-api benchmark arms with kit installed.

---

## Tier 0

| Genetic tag | Path | When to read |
|-------------|------|--------------|
| `shop.app.root.gen1` | `src/server.ts` | Production HTTP entry |
| `shop.app.dev.gen1` | `src/tools/devServer.ts` | Dev-only server (not production) |
| `repo.navigation.map.gen1` | `docs/ai/AI_NAVIGATION_MAP.md` | This registry |

---

## Tier 1

| Genetic tag | Path | When to read |
|-------------|------|--------------|
| `shop.auth.gen1` | `src/auth/AI_INDEX.md` | JWT, session middleware |
| `shop.catalog.gen1` | `src/catalog/AI_INDEX.md` | Products API, list filter |
| `shop.billing.gen1` | `src/billing/AI_INDEX.md` | Invoices (not legacy checkout) |
| `shop.webhooks.gen1` | `src/webhooks/AI_INDEX.md` | Delivery, signing, http client |

---

## Traps (do not use as SoT)

- `ARCHITECTURE.md` cites wrong entry `src/index.ts`
- `src/billing/legacy/oldCheckout.ts` is deprecated
