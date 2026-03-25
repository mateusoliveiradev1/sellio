# apps/web — Next.js 15 Dashboard

## Design
- Tema: dark navy (#0C1120), accent electric blue (#3A82FF)
- Font: Inter (text) + JetBrains Mono (números)
- Cards: glassmorphism (backdrop-blur, border sutil)
- Componentes: shadcn/ui customizados via @sellio/ui

## Princípios
- Cores via tokens CSS, NUNCA hardcodar
- Microinterações em toda ação (hover, click, loading)
- Feedback imediato: skeleton/toast em toda mutação
- Copy de vendedor: "Publique em 1 clique" não "Crie um anúncio"

## Data Fetching
- tRPC hooks: `api.product.list.useQuery()`
- Loading: skeleton components
- Error: error boundary + retry

## Rotas
```
/(auth)        — login, callback OAuth ML
/(dashboard)   — layout protegido
  /page.tsx    — Dashboard KPIs
  /produtos    — CRUD + auto-publish
  /pedidos     — central de pedidos
  /mensagens   — perguntas ML
  /envios      — rastreio
  /financeiro  — comissões, lucro
  /config      — conta ML, plano
```

## E2E (Playwright)
Dir: `e2e/`. Selectors: `data-testid` sempre. Nunca classes CSS.
