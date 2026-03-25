import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { productCreateInput, productUpdateInput } from '@sellio/schemas'
import { products, mlListings, mlTokens } from '@sellio/db'
import { eq, and, desc } from 'drizzle-orm'
import { createMLSdk } from '@sellio/ml-sdk'
import type { MLAppConfig } from '@sellio/ml-sdk'

export const productRouter = router({
    /** List all products for this seller */
    list: protectedProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).default(50),
                offset: z.number().min(0).default(0),
            }).optional(),
        )
        .query(async ({ ctx, input }) => {
            return ctx.tenantDb.products.findMany({
                limit: input?.limit,
                offset: input?.offset,
            })
        }),

    /** Get product by ID (with ML listing info if published) */
    getById: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .query(async ({ ctx, input }) => {
            const product = await ctx.tenantDb.products.findById(input.id)
            if (!product) return null

            // Get ML listing if exists
            const listing = await ctx.db
                .select()
                .from(mlListings)
                .where(
                    and(
                        eq(mlListings.productId, input.id),
                        eq(mlListings.sellerId, ctx.sellerId),
                    ),
                )
                .then((rows) => rows[0] ?? null)

            return { ...product, mlListing: listing }
        }),

    /** Create a new product (draft) */
    create: protectedProcedure
        .input(productCreateInput)
        .mutation(async ({ ctx, input }) => {
            const [product] = await ctx.db
                .insert(products)
                .values({
                    ...input,
                    price: String(input.price),
                    cost: input.cost ? String(input.cost) : null,
                    sellerId: ctx.sellerId,
                    status: 'draft',
                })
                .returning()

            return product
        }),

    /** Update product fields */
    update: protectedProcedure
        .input(
            z.object({
                id: z.string().uuid(),
                data: productUpdateInput,
            }),
        )
        .mutation(async ({ ctx, input }) => {
            // Verify ownership via tenantDb
            const existing = await ctx.tenantDb.products.findById(input.id)
            if (!existing) {
                throw new Error('Produto não encontrado.')
            }

            const [updated] = await ctx.db
                .update(products)
                .set({
                    ...input.data,
                    price: input.data.price ? String(input.data.price) : undefined,
                    cost: input.data.cost ? String(input.data.cost) : undefined,
                    updatedAt: new Date(),
                })
                .where(and(eq(products.id, input.id), eq(products.sellerId, ctx.sellerId)))
                .returning()

            return updated
        }),

    /** Publish product to Mercado Livre */
    publish: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            // 1. Get product
            const product = await ctx.tenantDb.products.findById(input.id)
            if (!product) throw new Error('Produto não encontrado.')
            if (!product.title || !product.description) {
                throw new Error('Produto precisa de título e descrição para publicar.')
            }

            // 2. Get ML tokens
            const token = await ctx.tenantDb.mlTokens.findFirst()
            if (!token) throw new Error('Conecte sua conta do Mercado Livre primeiro.')

            // 3. Update status to publishing
            await ctx.db
                .update(products)
                .set({ status: 'publishing', updatedAt: new Date() })
                .where(eq(products.id, input.id))

            try {
                // 4. Create ML SDK client
                const sdk = createMLSdk(
                    {
                        sellerId: ctx.sellerId,
                        accessToken: token.accessToken,
                        refreshToken: token.refreshToken,
                        onTokenRefreshed: async (newTokens) => {
                            await ctx.db
                                .update(mlTokens)
                                .set({
                                    accessToken: newTokens.accessToken,
                                    refreshToken: newTokens.refreshToken,
                                    expiresAt: newTokens.expiresAt,
                                    updatedAt: new Date(),
                                })
                                .where(eq(mlTokens.sellerId, ctx.sellerId))
                        },
                    },
                    ctx.mlAppConfig!,
                )

                // 5. Publish to ML
                const mlItem = await sdk.items.create({
                    title: product.title,
                    category_id: product.categoryId || 'MLB1055',
                    price: Number(product.price),
                    currency_id: 'BRL',
                    available_quantity: product.stock,
                    buying_mode: 'buy_it_now',
                    condition: 'new',
                    listing_type_id: 'gold_special',
                    description: { plain_text: product.description },
                    pictures: (product.images as string[]).map((url) => ({ source: url })),
                })

                // 6. Save ML listing reference
                await ctx.db.insert(mlListings).values({
                    productId: product.id,
                    sellerId: ctx.sellerId,
                    mlId: mlItem.id,
                    mlCategoryId: mlItem.category_id,
                    listingType: mlItem.listing_type_id,
                    mlStatus: mlItem.status,
                    permalink: mlItem.permalink,
                    mlPrice: String(mlItem.price),
                    lastSyncedAt: new Date(),
                })

                // 7. Update product status to published
                await ctx.db
                    .update(products)
                    .set({ status: 'published', updatedAt: new Date() })
                    .where(eq(products.id, input.id))

                return { success: true, mlId: mlItem.id, permalink: mlItem.permalink }
            } catch (error) {
                // On failure, set status to error
                await ctx.db
                    .update(products)
                    .set({ status: 'error', updatedAt: new Date() })
                    .where(eq(products.id, input.id))

                throw error
            }
        }),

    /** Delete product (only if not published) */
    delete: protectedProcedure
        .input(z.object({ id: z.string().uuid() }))
        .mutation(async ({ ctx, input }) => {
            const product = await ctx.tenantDb.products.findById(input.id)
            if (!product) throw new Error('Produto não encontrado.')
            if (product.status === 'published') {
                throw new Error('Pause o anúncio no ML antes de excluir.')
            }

            await ctx.db
                .delete(products)
                .where(and(eq(products.id, input.id), eq(products.sellerId, ctx.sellerId)))

            return { success: true }
        }),
})
