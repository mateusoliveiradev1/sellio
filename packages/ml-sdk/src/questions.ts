import type { MLClient } from './client'
import type { MLQuestion } from './types'

// ─── Questions API ───────────────────────────────────────

export class QuestionsApi {
    constructor(private readonly client: MLClient) { }

    /** Get unanswered questions for a specific item */
    async listByItem(itemId: string, offset = 0, limit = 50): Promise<{ questions: MLQuestion[]; total: number }> {
        return this.client.get<{ questions: MLQuestion[]; total: number }>(
            `/questions/search?item=${itemId}&status=UNANSWERED&offset=${offset}&limit=${limit}`,
        )
    }

    /** Get all pending questions for the seller */
    async listPending(sellerId: number, offset = 0, limit = 50): Promise<{ questions: MLQuestion[]; total: number }> {
        return this.client.get<{ questions: MLQuestion[]; total: number }>(
            `/my/received_questions/search?seller_id=${sellerId}&status=UNANSWERED&offset=${offset}&limit=${limit}`,
        )
    }

    /** Answer a question */
    async answer(questionId: number, text: string): Promise<MLQuestion> {
        return this.client.post<MLQuestion>(`/answers`, {
            question_id: questionId,
            text,
        })
    }
}
