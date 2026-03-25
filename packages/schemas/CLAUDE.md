# @sellio/schemas — Schema-Driven Development

## Regra de ouro
TODO campo novo começa AQUI → depois propaga para DB → API → UI.

## Naming
- Schema: `productSchema`, `sellerSchema`
- Create input: `productCreateInput`
- Update input: `productUpdateInput`
- Sempre exportar: `schema` + `type` (z.infer<>)

## Propagação SDD
```
Zod schema → Drizzle table (db) → tRPC input (api) → Form (web)
```

## Testes (TDD)
Cada schema tem `[entity].schema.test.ts`:
- Dados válidos passam
- Dados inválidos rejeitam com mensagem clara
- Transforms e refines testados

## Entidades
product, seller, mlToken, mlListing, order, question, shipment, billing

## Comandos
- `pnpm --filter @sellio/schemas test` — rodar testes
- `pnpm --filter @sellio/schemas typecheck` — checar tipos
