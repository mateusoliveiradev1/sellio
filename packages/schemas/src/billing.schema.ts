import { z } from 'zod'

// ─── Billing Schema ──────────────────────────────────────

export const billingTypeSchema = z.enum(['commission', 'shipping_fee', 'fixed_fee', 'refund'])

export const billingSchema = z.object({
    id: z.string().uuid(),
    sellerId: z.string().uuid(),
    orderId: z.string().uuid().optional(),
    type: billingTypeSchema,
    amount: z.number(),
    description: z.string().optional(),
    mlBillingId: z.string().optional(),
    createdAt: z.date(),
})

export type Billing = z.infer<typeof billingSchema>
export type BillingType = z.infer<typeof billingTypeSchema>
