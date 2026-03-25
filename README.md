# Sellio

> Publique no Mercado Livre em 1 clique.

Sistema SaaS multi-seller para vendedores do Mercado Livre. Cadastre produtos, a IA otimiza, e o anúncio vai ao ar automaticamente.

## Stack

| Tech | Uso |
|---|---|
| Turborepo + pnpm | Monorepo |
| TypeScript strict | End-to-end types |
| Zod | Schema-Driven Development |
| Drizzle ORM + Neon | Database |
| tRPC v11 | Type-safe API |
| Next.js 15 | Dashboard |
| shadcn/ui + Tailwind v4 | UI |
| Gemini 2.5 Flash | IA (free) |
| Vitest + Playwright | TDD + E2E |

## Packages

| Package | Responsabilidade |
|---|---|
| `@sellio/schemas` | Zod schemas (source of truth) |
| `@sellio/db` | Drizzle ORM + Neon |
| `@sellio/api` | tRPC routers |
| `@sellio/ml-sdk` | HTTP client Mercado Livre |
| `@sellio/ai` | IA Gemini |
| `@sellio/ui` | Design system |

## Comandos

```bash
pnpm dev            # Dev server
pnpm turbo build    # Build all
pnpm turbo test     # Unit + Integration
pnpm turbo test:e2e # Playwright E2E
pnpm turbo lint     # ESLint
pnpm turbo typecheck # Type check
```

## Desenvolvimento

Este projeto usa **Claude Code** com `CLAUDE.md` por componente para desenvolvimento assistido por IA.
