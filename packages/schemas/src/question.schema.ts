import { z } from 'zod'

// ─── Question Schema ─────────────────────────────────────

export const questionStatusSchema = z.enum(['pending', 'answered', 'deleted'])

export const questionSchema = z.object({
    id: z.string().uuid(),
    sellerId: z.string().uuid(),
    listingId: z.string().uuid(),
    mlQuestionId: z.number().int().positive(),
    text: z.string(),
    answer: z.string().optional(),
    status: questionStatusSchema.default('pending'),
    buyerNickname: z.string().optional(),
    answeredAt: z.date().optional(),
    createdAt: z.date(),
})

export type Question = z.infer<typeof questionSchema>
export type QuestionStatus = z.infer<typeof questionStatusSchema>
