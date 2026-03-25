# Sellio — Monorepo

## Stack
Turborepo + pnpm | TypeScript 5.9 strict | Zod | Drizzle ORM | tRPC v11 | Next.js 15 | shadcn/ui + Tailwind v4

## Comandos
- `pnpm dev` — dev server (all apps)
- `pnpm turbo build` — build all packages
- `pnpm turbo test` — unit + integration tests
- `pnpm turbo test:e2e` — Playwright E2E
- `pnpm turbo lint` — ESLint all
- `pnpm turbo typecheck` — tsc --noEmit all

## Convenções
- Commits: conventional (feat/fix/chore/test/refactor)
- Branches: feat/nome, fix/nome, chore/nome
- Todo campo novo: começa no Zod schema (@sellio/schemas), depois propaga
- TDD obrigatório: RED → GREEN → REFACTOR
- Multi-tenant: TODA query filtra por sellerId
- Cores: usar CSS tokens (--bg-primary, --accent) — NUNCA hardcodar

## Packages
- `@sellio/schemas` — Zod schemas (source of truth, SDD)
- `@sellio/db` — Drizzle ORM + Neon Postgres
- `@sellio/api` — tRPC v11 routers
- `@sellio/ml-sdk` — HTTP client Mercado Livre API
- `@sellio/ai` — IA (Gemini 2.5 Flash free)
- `@sellio/ui` — shadcn/ui components customizados
- `@sellio/eslint-config` — ESLint rules
- `@sellio/typescript-config` — TSConfig base

## Apps
- `apps/web` — Next.js 15 Dashboard (SSR + API routes)
