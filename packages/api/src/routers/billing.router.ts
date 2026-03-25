import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

export const billingRouter = router({
    /** Get financial summary for dashboard */
    summary: protectedProcedure
        .input(
            z.object({
                period: z.enum(['7d', '30d', '90d', 'all']).default('30d'),
            }).optional(),
        )
        .query(async ({ ctx }) => {
            const billingRecords = await ctx.tenantDb.billing.findMany({ limit: 1000 })

            const commissions = billingRecords.filter((b) => b.type === 'commission')
            const shippingFees = billingRecords.filter((b) => b.type === 'shipping_fee')
            const fixedFees = billingRecords.filter((b) => b.type === 'fixed_fee')
            const refunds = billingRecords.filter((b) => b.type === 'refund')

            const totalCommissions = commissions.reduce((s, b) => s + Number(b.amount), 0)
            const totalShipping = shippingFees.reduce((s, b) => s + Number(b.amount), 0)
            const totalFixed = fixedFees.reduce((s, b) => s + Number(b.amount), 0)
            const totalRefunds = refunds.reduce((s, b) => s + Number(b.amount), 0)

            return {
                totalCommissions,
                totalShipping,
                totalFixed,
                totalRefunds,
                totalFees: totalCommissions + totalShipping + totalFixed,
            }
        }),

    /** List billing records */
    list: protectedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).default(50),
                offset: z.number().min(0).default(0),
            }).optional(),
        )
        .query(async ({ ctx, input }) => {
            return ctx.tenantDb.billing.findMany({
                limit: input?.limit,
                offset: input?.offset,
            })
        }),
})
