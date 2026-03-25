import { z } from 'zod'
import { router, publicProcedure, protectedProcedure } from '../trpc'
import { getAuthUrl, exchangeCodeForTokens } from '@sellio/ml-sdk'
import { mlTokens } from '@sellio/db'
import { eq } from 'drizzle-orm'

export const authRouter = router({
    /** Generate ML OAuth URL for seller to connect their account */
    getAuthUrl: protectedProcedure.query(({ ctx }) => {
        if (!ctx.mlAppConfig) {
            throw new Error('ML app config not provided')
        }
        return { url: getAuthUrl(ctx.mlAppConfig) }
    }),

    /** Handle OAuth callback — exchange code for tokens and save */
    handleCallback: protectedProcedure
        .input(z.object({ code: z.string() }))
        .mutation(async ({ ctx, input }) => {
            if (!ctx.mlAppConfig) {
                throw new Error('ML app config not provided')
            }

            const tokens = await exchangeCodeForTokens(input.code, ctx.mlAppConfig)
            const expiresAt = new Date(Date.now() + tokens.expires_in * 1000)

            // Upsert: update if seller already has tokens, insert if new
            const existing = await ctx.db
                .select()
                .from(mlTokens)
                .where(eq(mlTokens.sellerId, ctx.sellerId))

            if (existing.length > 0) {
                await ctx.db
                    .update(mlTokens)
                    .set({
                        accessToken: tokens.access_token,
                        refreshToken: tokens.refresh_token,
                        expiresAt,
                        mlUserId: tokens.user_id,
                        updatedAt: new Date(),
                    })
                    .where(eq(mlTokens.sellerId, ctx.sellerId))
            } else {
                await ctx.db.insert(mlTokens).values({
                    sellerId: ctx.sellerId,
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token,
                    expiresAt,
                    mlUserId: tokens.user_id,
                })
            }

            return { success: true, mlUserId: tokens.user_id }
        }),

    /** Check if seller has connected their ML account */
    getConnection: protectedProcedure.query(async ({ ctx }) => {
        const token = await ctx.tenantDb.mlTokens.findFirst()
        if (!token) return { connected: false as const }
        return {
            connected: true as const,
            mlNickname: token.mlNickname,
            mlUserId: token.mlUserId,
        }
    }),
})
