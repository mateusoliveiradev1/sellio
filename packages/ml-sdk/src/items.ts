import type { MLClient } from './client'
import type { MLItem, MLItemCreateInput, MLSearchResponse } from './types'

// ─── Items API ───────────────────────────────────────────
// CRUD operations for ML listings

export class ItemsApi {
    constructor(private readonly client: MLClient) { }

    /** Create a new listing on Mercado Livre */
    async create(item: MLItemCreateInput): Promise<MLItem> {
        return this.client.post<MLItem>('/items', item)
    }

    /** Get item details by ML ID */
    async getById(mlId: string): Promise<MLItem> {
        return this.client.get<MLItem>(`/items/${mlId}`)
    }

    /** Update item fields (price, stock, status, etc.) */
    async update(mlId: string, data: Partial<MLItemCreateInput>): Promise<MLItem> {
        return this.client.put<MLItem>(`/items/${mlId}`, data)
    }

    /** Update price only */
    async updatePrice(mlId: string, price: number): Promise<MLItem> {
        return this.client.put<MLItem>(`/items/${mlId}`, { price })
    }

    /** Update available quantity */
    async updateStock(mlId: string, quantity: number): Promise<MLItem> {
        return this.client.put<MLItem>(`/items/${mlId}`, { available_quantity: quantity })
    }

    /** Pause listing */
    async pause(mlId: string): Promise<MLItem> {
        return this.client.put<MLItem>(`/items/${mlId}`, { status: 'paused' })
    }

    /** Activate listing */
    async activate(mlId: string): Promise<MLItem> {
        return this.client.put<MLItem>(`/items/${mlId}`, { status: 'active' })
    }

    /** Close listing permanently */
    async close(mlId: string): Promise<MLItem> {
        return this.client.put<MLItem>(`/items/${mlId}`, { status: 'closed' })
    }

    /** List all items for the authenticated seller */
    async listBySeller(mlUserId: number, offset = 0, limit = 50): Promise<MLSearchResponse<MLItem>> {
        return this.client.get<MLSearchResponse<MLItem>>(
            `/users/${mlUserId}/items/search?offset=${offset}&limit=${limit}`,
        )
    }
}
