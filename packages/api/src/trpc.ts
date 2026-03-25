import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import type { Database } from '@sellio/db'
import { createTenantDb, type TenantDb } from '@sellio/db'

// ─── Context ─────────────────────────────────────────────

export interface CreateContextOptions {
    db: Database
    sellerId?: string | null
    mlAppConfig?: {
        clientId: string
        clientSecret: string
        redirectUri: string
    }
}

export interface Context {
    db: Database
    sellerId: string | null
    tenantDb: TenantDb | null
    mlAppConfig: CreateContextOptions['mlAppConfig']
}

export function createContext(opts: CreateContextOptions): Context {
    const sellerId = opts.sellerId ?? null
    return {
        db: opts.db,
        sellerId,
        tenantDb: sellerId ? createTenantDb(opts.db, sellerId) : null,
        mlAppConfig: opts.mlAppConfig,
    }
}

// ─── tRPC Init ───────────────────────────────────────────

const t = initTRPC.context<Context>().create({
    transformer: superjson,
})

export const router = t.router
export const publicProcedure = t.procedure
export const middleware = t.middleware

// ─── Auth Middleware ─────────────────────────────────────
// Ensures sellerId exists in context + provides tenantDb

const enforceAuth = middleware(async ({ ctx, next }) => {
    if (!ctx.sellerId || !ctx.tenantDb) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Você precisa estar logado para acessar este recurso.',
        })
    }
    return next({
        ctx: {
            ...ctx,
            sellerId: ctx.sellerId,
            tenantDb: ctx.tenantDb,
        },
    })
})

export const protectedProcedure = t.procedure.use(enforceAuth)
