# @sellio/db — Drizzle ORM + Neon

## Multi-tenant
TODA tabela tem `seller_id` FK. TODA query filtra por `sellerId`. Sem exceção.

## Schema derivado
Campos mapeiam 1:1 com @sellio/schemas Zod types.
- Colunas: snake_case
- TypeScript: camelCase

## Segurança
ml_tokens: `access_token` e `refresh_token` encriptados AES-256-GCM.

## Comandos
- `pnpm --filter @sellio/db push` — push schema para Neon
- `pnpm --filter @sellio/db generate` — gerar migration SQL
- `pnpm --filter @sellio/db studio` — Drizzle Studio (visual)

## RLS (Row Level Security)
Postgres RLS não funciona com Neon serverless (HTTP stateless).
Usamos RLS na camada de aplicação via `createTenantDb(db, sellerId)`.
- TODA query em tRPC deve usar `TenantDb`, NUNCA `db` direto
- `createTenantDb` injeta `where sellerId = ?` automaticamente
- Garante isolamento total entre sellers

## Tabelas
sellers, ml_tokens, products, ml_listings, orders, questions, billing
