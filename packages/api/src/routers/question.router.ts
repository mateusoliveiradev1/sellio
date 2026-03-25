import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'
import { questions, mlTokens } from '@sellio/db'
import { eq, and, desc } from 'drizzle-orm'
import { createMLSdk } from '@sellio/ml-sdk'

export const questionRouter = router({
    /** List questions with optional status filter */
    list: protectedProcedure
        .input(
            z.object({
                status: z.enum(['pending', 'answered', 'deleted']).optional(),
                limit: z.number().min(1).max(100).default(50),
                offset: z.number().min(0).default(0),
            }).optional(),
        )
        .query(async ({ ctx, input }) => {
            return ctx.db
                .select()
                .from(questions)
                .where(eq(questions.sellerId, ctx.sellerId))
                .orderBy(desc(questions.createdAt))
                .limit(input?.limit ?? 50)
                .offset(input?.offset ?? 0)
        }),

    /** Count pending questions */
    pendingCount: protectedProcedure.query(async ({ ctx }) => {
        const pending = await ctx.db
            .select()
            .from(questions)
            .where(
                and(eq(questions.sellerId, ctx.sellerId), eq(questions.status, 'pending')),
            )
        return { count: pending.length }
    }),

    /** Answer a question (sends to ML API + saves locally) */
    answer: protectedProcedure
        .input(z.object({ questionId: z.string().uuid(), text: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            // Get question
            const [question] = await ctx.db
                .select()
                .from(questions)
                .where(
                    and(eq(questions.id, input.questionId), eq(questions.sellerId, ctx.sellerId)),
                )

            if (!question) throw new Error('Pergunta não encontrada.')
            if (question.status === 'answered') throw new Error('Pergunta já foi respondida.')

            // Get ML tokens for API call
            const token = await ctx.tenantDb.mlTokens.findFirst()
            if (!token) throw new Error('Conecte sua conta ML.')

            const sdk = createMLSdk(
                {
                    sellerId: ctx.sellerId,
                    accessToken: token.accessToken,
                    refreshToken: token.refreshToken ?? '',
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

            // Send answer to ML
            await sdk.questions.answer(question.mlQuestionId, input.text)

            // Update locally
            const [updated] = await ctx.db
                .update(questions)
                .set({
                    answer: input.text,
                    status: 'answered',
                    answeredAt: new Date(),
                })
                .where(eq(questions.id, input.questionId))
                .returning()

            return updated
        }),
})
