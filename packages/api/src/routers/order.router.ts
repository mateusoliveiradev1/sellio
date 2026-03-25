import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { orders } from '@sellio/db'
import { eq, and, desc } from 'drizzle-orm'

export const orderRouter = router({
    /** List orders for seller with optional status filter */
    list: protectedProcedure
        .input(
            z.object({
                status: z.enum(['paid', 'shipped', 'delivered', 'cancelled']).optional(),
                limit: z.number().min(1).max(100).default(50),
                offset: z.number().min(0).default(0),
            }).optional(),
        )
        .query(async ({ ctx, input }) => {
            const baseQuery = ctx.db
                .select()
                .from(orders)
                .where(eq(orders.sellerId, ctx.sellerId))
                .orderBy(desc(orders.createdAt))
                .limit(input?.limit ?? 50)
                .offset(input?.offset ?? 0)

            return baseQuery
        }),

    /** Get order by ID */
    getById: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const [order] = await ctx.db
                .select()
                .from(orders)
                .where(and(eq(orders.id, input.id), eq(orders.sellerId, ctx.sellerId)))

            return order ?? null
        }),

    /** Get summary stats for dashboard */
    stats: protectedProcedure.query(async ({ ctx }) => {
        const allOrders = await ctx.tenantDb.orders.findMany({ limit: 1000 })
        const paid = allOrders.filter((o) => o.status === 'paid')
        const shipped = allOrders.filter((o) => o.status === 'shipped')
        const delivered = allOrders.filter((o) => o.status === 'delivered')

        const totalRevenue = allOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0)
        const totalCommission = allOrders.reduce((sum, o) => sum + Number(o.commission || 0), 0)
        const totalProfit = allOrders.reduce((sum, o) => sum + Number(o.netProfit || 0), 0)

        return {
            counts: {
                total: allOrders.length,
                paid: paid.length,
                shipped: shipped.length,
                delivered: delivered.length,
            },
            financials: {
                totalRevenue,
                totalCommission,
                totalProfit,
            },
        }
    }),
})
