import { z } from 'zod'

// ─── Order Schema ────────────────────────────────────────

export const orderStatusSchema = z.enum(['paid', 'shipped', 'delivered', 'cancelled'])

export const orderSchema = z.object({
    id: z.string().uuid(),
    sellerId: z.string().uuid(),
    listingId: z.string().uuid(),
    mlOrderId: z.number().int().positive(),
    status: orderStatusSchema,
    totalAmount: z.number().nonnegative(),
    commission: z.number().nonnegative(),
    shippingCost: z.number().nonnegative(),
    netProfit: z.number(), // can be negative
    buyerNickname: z.string().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type Order = z.infer<typeof orderSchema>
export type OrderStatus = z.infer<typeof orderStatusSchema>
