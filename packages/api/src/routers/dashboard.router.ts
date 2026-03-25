import { z } from "zod";
import { router, publicProcedure } from "../trpc";
import { orders, mlListings, questions } from "@sellio/db/schema";
import { sql, eq, desc } from "drizzle-orm";

export const dashboardRouter = router({
    getOverview: publicProcedure
        .input(z.object({
            timeRange: z.enum(['7d', '30d', '90d']).default('30d')
        }))
        .query(async ({ ctx, input }) => {
            // Hardcoding sellerId for now to match our dev dummy seed
            const devSellerId = "00000000-0000-0000-0000-000000000001";

            // Count active products
            const productsRes = await ctx.db
                .select({ count: sql<number>`count(*)` })
                .from(mlListings)
                .where(eq(mlListings.sellerId, devSellerId));

            const activeProducts = Number(productsRes[0]?.count || 0);

            // Orders Revenue & Count
            const ordersRes = await ctx.db
                .select({
                    totalRevenue: sql<number>`sum(${orders.totalAmount})`,
                    count: sql<number>`count(*)`
                })
                .from(orders)
                .where(eq(orders.sellerId, devSellerId));

            const totalRevenue = Number(ordersRes[0]?.totalRevenue || 0);
            const salesCount = Number(ordersRes[0]?.count || 0);
            const avgTicket = salesCount > 0 ? totalRevenue / salesCount : 0;

            // Latest Orders
            const latestOrders = await ctx.db
                .select()
                .from(orders)
                .where(eq(orders.sellerId, devSellerId))
                .orderBy(desc(orders.createdAt))
                .limit(5);

            // Formatting orders for UI
            const recentOrders = latestOrders.map(o => ({
                id: `#ML-${o.mlOrderId}`,
                rawOrderId: o.id,
                buyer: o.buyerNickname || 'Comprador Anônimo',
                val: `R$ ${Number(o.totalAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                status: o.status
            }));

            // Mocking chart data based on overall revenue (since we don't have historical seeds)
            // Just spreading the revenue randomly over 7 days for visual demonstration
            const avgDay = totalRevenue / 7;
            const chartData = [
                Math.round(avgDay * 0.8),
                Math.round(avgDay * 1.2),
                Math.round(avgDay * 0.5),
                Math.round(avgDay * 1.5),
                Math.round(avgDay * 0.9),
                Math.round(avgDay * 1.1),
                Math.round(avgDay * 1.0),
            ];

            return {
                metrics: {
                    revenue: totalRevenue,
                    salesCount,
                    avgTicket,
                    activeProducts,
                    // Dummy trends for now until we build historical deltas
                    trends: {
                        revenue: totalRevenue > 0 ? 12.5 : 0,
                        sales: salesCount > 0 ? 8.2 : 0,
                        ticket: avgTicket > 0 ? -2.4 : 0
                    }
                },
                recentOrders,
                chartData
            };
        }),
});
