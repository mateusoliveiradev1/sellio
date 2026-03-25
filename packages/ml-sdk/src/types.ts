// ─── ML SDK Types ────────────────────────────────────────
// Typed responses from the Mercado Livre API

export interface MLTokenResponse {
    access_token: string
    token_type: string
    expires_in: number
    scope: string
    user_id: number
    refresh_token: string
}

export interface MLClientConfig {
    sellerId: string
    accessToken: string
    refreshToken: string
    onTokenRefreshed: (tokens: { accessToken: string; refreshToken: string; expiresAt: Date }) => Promise<void>
}

export interface MLAppConfig {
    clientId: string
    clientSecret: string
    redirectUri: string
}

export interface MLItem {
    id: string
    title: string
    category_id: string
    price: number
    currency_id: string
    available_quantity: number
    buying_mode: string
    condition: string
    listing_type_id: string
    status: string
    permalink: string
    thumbnail: string
    date_created: string
    last_updated: string
    [key: string]: unknown
}

export interface MLItemCreateInput {
    title: string
    category_id: string
    price: number
    currency_id: string
    available_quantity: number
    buying_mode: string
    condition: string
    listing_type_id: string
    description?: { plain_text: string }
    pictures?: Array<{ source: string }>
    [key: string]: unknown
}

export interface MLOrder {
    id: number
    status: string
    status_detail: string | null
    date_created: string
    total_amount: number
    currency_id: string
    buyer: { id: number; nickname: string }
    order_items: Array<{
        item: { id: string; title: string }
        quantity: number
        unit_price: number
    }>
    payments: Array<{
        id: number
        status: string
        total_paid_amount: number
    }>
    [key: string]: unknown
}

export interface MLQuestion {
    id: number
    item_id: string
    text: string
    status: string
    date_created: string
    from: { id: number; nickname: string }
    answer: { text: string; date_created: string } | null
}

export interface MLSearchResponse<T> {
    results: T[]
    paging: { total: number; offset: number; limit: number }
}
