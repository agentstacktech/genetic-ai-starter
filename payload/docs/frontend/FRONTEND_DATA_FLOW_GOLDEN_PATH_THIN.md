# Frontend data flow — golden path (thin)

**Genetic tag:** `frontend.spa.server_state.gen1`

> React reads via `useSDKQuery`; writes via SDK mutations + write contours or `invalidateAfterWrite`. Never mirror API fields into `useState`.

## Stack

```
Component → useSDK() + useSDKQuery / useSDKMutation
         → module *QueryKeys.ts
         → *WriteContour or cacheInvalidation.ts
         → @agentstack/sdk HTTPClient (SDKProvider)
```

## Read (template)

```typescript
const sdk = useSDK();
return useSDKQuery(
  crmQueryKeys.board(projectId),
  (signal) => sdk.crm.listBoard(projectId!, { signal }).then((r) => r.data),
  { enabled: Boolean(projectId) },
);
```

## Write (pick one tier)

| Tier | When |
|------|------|
| Write contour | List hub + optimistic upsert/delete |
| `invalidateAfterWrite` | Registered entity type |
| `invalidateQueriesByPrefixes` | Inside contour only — not in components |

## EDITFLOW hosted vertical

Use `tenantRest` / `tenantActions` — **never** `tenantMcp` in UI.

## Agent bootstrap

```typescript
import { createAgentSession } from '@agentstack/sdk/ai-preflight';
```

Full doc: platform repo `docs/frontend/FRONTEND_DATA_FLOW_GOLDEN_PATH.md`.
