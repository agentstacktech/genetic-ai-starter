# AI index — auth (`shop.auth.gen1`)

## Hot files

| File | Role |
|------|------|
| `src/auth/sessionMiddleware.ts` | JWT validation on each request |
| `src/auth/jwt.ts` | Token verify helper |

## Sideways

- Catalog routes assume `req.userId` from middleware
