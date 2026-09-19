# Frontend helper inventory (thin)

**Genetic tag:** `docs.frontend.helper_inventory.gen1`

Route reads/writes through these helpers — do not invent `fetch`, keys, or invalidation. Full inventory: platform repo `docs/frontend/FRONTEND_HELPER_INVENTORY.md`.

## Read

| Helper | When |
|--------|------|
| `useSDK()` | All React components |
| `useSDKQuery` | Server reads |
| `*QueryKeys.ts` | Stable keys per module |

## Write decision tree

```
1. List hub + optimistic patch?  → *WriteContour (CRM is reference)
2. Entity in registry?          → invalidateAfterWrite({ entity })
3. Protein / wallet / session?  → proteinEntityWriteContour
4. Project metadata?            → projectListWriteContour
5. Commerce?                    → invalidateOnMerchantWrite
```

## Top contours (copy pattern from CRM)

| Domain | File pattern |
|--------|--------------|
| CRM (reference) | `crmListWriteContour.ts` |
| Agents | `agentListWriteContour.ts` |
| Bots | `botListWriteContour.ts` |
| Generations | `generationListWriteContour.ts` |
| Scheduler | `schedulerListWriteContour.ts` |

**Factory:** `createWriteContour.ts` for new modules.

## Project stats key

Use `projectStatsQueryKey()` — never mix `projectStats` vs `project-stats` strings.

## CI (platform monorepo)

`npm run audit:server-state-contours` · `npm run audit:unified-contours`
