import type { MLClient } from './client'
import type { MLOrder, MLSearchResponse } from './types'

// ─── Orders API ──────────────────────────────────────────

export class OrdersApi {
    constructor(private readonly client: MLClient) { }

    /** Get order details by ML order ID */
    async getById(orderId: number): Promise<MLOrder> {
        return this.client.get<MLOrder>(`/orders/${orderId}`)
    }

    /** List recent orders for the seller */
    async listRecent(sellerId: number, offset = 0, limit = 50): Promise<MLSearchResponse<MLOrder>> {
        return this.client.get<MLSearchResponse<MLOrder>>(
            `/orders/search?seller=${sellerId}&sort=date_desc&offset=${offset}&limit=${limit}`,
        )
    }
}
