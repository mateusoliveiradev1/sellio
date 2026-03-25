# @sellio/api — tRPC v11 Routers

## Context
Toda request autenticada tem `ctx.sellerId` via NextAuth session.
Middleware `withSeller` valida e injeta.

## Procedures
- `publicProcedure` — sem auth (health, webhook receiver)
- `protectedProcedure` — precisa session + sellerId

## Input/Output
- Input: SEMPRE Zod schema de `@sellio/schemas`
- Output: inferido pelo Drizzle select type

## Error handling
Usar `TRPCError` com codes: UNAUTHORIZED, NOT_FOUND, BAD_REQUEST, INTERNAL_SERVER_ERROR.

## Routers
auth, seller, product, listing, order, question, shipment, billing, webhook

## Testes
- Unit: mock DB + mock ML SDK
- Integration: real DB (Neon branch) + mock ML SDK
