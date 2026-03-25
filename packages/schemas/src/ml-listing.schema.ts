import { z } from 'zod'

// ─── ML Listing Schema ───────────────────────────────────
// Mirror of the listing on Mercado Livre (derived from Product)

export const mlListingStatusSchema = z.enum([
    'active',
    'paused',
    'closed',
    'under_review',
    'inactive',
])

export const listingTypeSchema = z.enum([
    'gold_special',
    'gold_pro',
    'gold',
    'silver',
    'bronze',
    'free',
])

export const mlListingSchema = z.object({
    id: z.string().uuid(),
    productId: z.string().uuid(),
    sellerId: z.string().uuid(),
    mlId: z.string(), // ID returned by ML API
    mlCategoryId: z.string(),
    listingType: listingTypeSchema.default('gold_special'),
    mlStatus: mlListingStatusSchema.default('active'),
    permalink: z.string().url().optional(),
    mlPrice: z.number().positive(),
    lastSyncedAt: z.date().optional(),
    mlRawData: z.record(z.unknown()).optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type MlListing = z.infer<typeof mlListingSchema>
export type MlListingStatus = z.infer<typeof mlListingStatusSchema>
export type ListingType = z.infer<typeof listingTypeSchema>
