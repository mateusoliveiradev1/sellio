import { z } from 'zod'

// ─── Product Schema ──────────────────────────────────────
// Source of truth — platform-first, then auto-publishes to ML

export const productStatusSchema = z.enum([
    'draft',
    'ready',
    'publishing',
    'published',
    'error',
    'paused',
])

export const productSchema = z.object({
    id: z.string().uuid(),
    sellerId: z.string().uuid(),
    title: z.string().min(1).max(60),
    description: z.string().min(1).max(5000),
    images: z.array(z.string().url()).min(1).max(12),
    price: z.number().positive(),
    cost: z.number().nonnegative().optional(),
    stock: z.number().int().nonnegative(),
    sku: z.string().max(50).optional(),
    categoryId: z.string().optional(),
    categorySuggestion: z.string().optional(),
    status: productStatusSchema.default('draft'),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export const productCreateInput = productSchema.pick({
    title: true,
    description: true,
    images: true,
    price: true,
    cost: true,
    stock: true,
    sku: true,
})

export const productUpdateInput = productCreateInput.partial()

export type Product = z.infer<typeof productSchema>
export type ProductStatus = z.infer<typeof productStatusSchema>
export type ProductCreateInput = z.infer<typeof productCreateInput>
export type ProductUpdateInput = z.infer<typeof productUpdateInput>
