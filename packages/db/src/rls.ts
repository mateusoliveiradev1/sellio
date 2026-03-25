import { eq } from 'drizzle-orm'
import type { PgTable } from 'drizzle-orm/pg-core'
import type { Database } from './client'
import * as schema from './schema/index'

// ─── Application-Level RLS ──────────────────────────────
// Every query MUST go through this to enforce multi-tenant isolation.
// Postgres RLS is not viable with Neon serverless (stateless HTTP).

/**
 * Creates a tenant-scoped database accessor.
 * ALL queries through this accessor are automatically filtered by sellerId.
 *
 * @example
 * const tenantDb = createTenantDb(db, sellerId)
 * const products = await tenantDb.query.products.findMany() // auto-filtered
 */
export function createTenantDb(db: Database, sellerId: string) {
    return {
        db,
        sellerId,

        // ─── Scoped queries ──────────────────────────────
        products: {
            findMany: (opts?: { limit?: number; offset?: number }) =>
                db
                    .select()
                    .from(schema.products)
                    .where(eq(schema.products.sellerId, sellerId))
                    .limit(opts?.limit ?? 50)
                    .offset(opts?.offset ?? 0),

            findById: (id: string) =>
                db
                    .select()
                    .from(schema.products)
                    .where(eq(schema.products.id, id))
                    .then((rows) => {
                        const row = rows[0]
                        if (row && row.sellerId !== sellerId) return undefined
                        return row
                    }),
        },

        orders: {
            findMany: (opts?: { limit?: number; offset?: number }) =>
                db
                    .select()
                    .from(schema.orders)
                    .where(eq(schema.orders.sellerId, sellerId))
                    .limit(opts?.limit ?? 50)
                    .offset(opts?.offset ?? 0),
        },

        questions: {
            findMany: (opts?: { limit?: number; offset?: number }) =>
                db
                    .select()
                    .from(schema.questions)
                    .where(eq(schema.questions.sellerId, sellerId))
                    .limit(opts?.limit ?? 50)
                    .offset(opts?.offset ?? 0),
        },

        mlListings: {
            findMany: (opts?: { limit?: number; offset?: number }) =>
                db
                    .select()
                    .from(schema.mlListings)
                    .where(eq(schema.mlListings.sellerId, sellerId))
                    .limit(opts?.limit ?? 50)
                    .offset(opts?.offset ?? 0),
        },

        mlTokens: {
            findFirst: () =>
                db
                    .select()
                    .from(schema.mlTokens)
                    .where(eq(schema.mlTokens.sellerId, sellerId))
                    .then((rows) => rows[0]),
        },

        billing: {
            findMany: (opts?: { limit?: number; offset?: number }) =>
                db
                    .select()
                    .from(schema.billing)
                    .where(eq(schema.billing.sellerId, sellerId))
                    .limit(opts?.limit ?? 50)
                    .offset(opts?.offset ?? 0),
        },
    }
}

export type TenantDb = ReturnType<typeof createTenantDb>
