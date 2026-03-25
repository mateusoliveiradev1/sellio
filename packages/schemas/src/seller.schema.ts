import { z } from 'zod'

// ─── Seller Schema ───────────────────────────────────────
// Multi-tenant: every seller is a tenant

export const sellerSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string().min(1).max(100),
    plan: z.enum(['free', 'starter', 'pro', 'enterprise']).default('free'),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const sellerCreateInput = sellerSchema.pick({
    email: true,
    name: true,
})

export type Seller = z.infer<typeof sellerSchema>
export type SellerCreateInput = z.infer<typeof sellerCreateInput>
