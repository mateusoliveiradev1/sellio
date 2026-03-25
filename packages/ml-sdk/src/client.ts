import type { MLClientConfig, MLAppConfig } from './types'
import { refreshAccessToken } from './auth'

const ML_BASE_URL = 'https://api.mercadolibre.com'

// ─── ML HTTP Client ──────────────────────────────────────
// Per-seller client with auto-refresh and rate limiting

export class MLClient {
    private accessToken: string
    private refreshToken: string
    private readonly sellerId: string
    private readonly appConfig: MLAppConfig
    private readonly onTokenRefreshed: MLClientConfig['onTokenRefreshed']
    private isRefreshing = false
    private lastRequestTime = 0

    constructor(clientConfig: MLClientConfig, appConfig: MLAppConfig) {
        this.accessToken = clientConfig.accessToken
        this.refreshToken = clientConfig.refreshToken
        this.sellerId = clientConfig.sellerId
        this.appConfig = appConfig
        this.onTokenRefreshed = clientConfig.onTokenRefreshed
    }

    // ─── Core request method ─────────────────────────────
    async request<T>(path: string, options: RequestInit = {}): Promise<T> {
        // Rate limiting: 1 request per second per seller
        await this.rateLimit()

        const url = `${ML_BASE_URL}${path}`
        const headers: Record<string, string> = {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        }

        let response = await fetch(url, { ...options, headers })

        // Auto-refresh on 401
        if (response.status === 401 && !this.isRefreshing) {
            await this.handleTokenRefresh()
            headers['Authorization'] = `Bearer ${this.accessToken}`
            response = await fetch(url, { ...options, headers })
        }

        // Retry on 429 (rate limit) with exponential backoff
        if (response.status === 429) {
            const retryAfter = Number(response.headers.get('retry-after') || '2')
            await this.sleep(retryAfter * 1000)
            response = await fetch(url, { ...options, headers })
        }

        if (!response.ok) {
            const errorBody = await response.text()
            throw new MLApiError(
                `ML API error: ${response.status}`,
                response.status,
                errorBody,
                path,
            )
        }

        return response.json() as Promise<T>
    }

    // ─── Token refresh ───────────────────────────────────
    private async handleTokenRefresh(): Promise<void> {
        this.isRefreshing = true
        try {
            const tokens = await refreshAccessToken(this.refreshToken, this.appConfig)
            this.accessToken = tokens.access_token
            this.refreshToken = tokens.refresh_token

            const expiresAt = new Date(Date.now() + tokens.expires_in * 1000)
            await this.onTokenRefreshed({
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                expiresAt,
            })
        } finally {
            this.isRefreshing = false
        }
    }

    // ─── Rate limiter (1 req/sec per seller) ─────────────
    private async rateLimit(): Promise<void> {
        const now = Date.now()
        const elapsed = now - this.lastRequestTime
        if (elapsed < 1000) {
            await this.sleep(1000 - elapsed)
        }
        this.lastRequestTime = Date.now()
    }

    private sleep(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    // ─── Convenience methods ─────────────────────────────
    get<T>(path: string): Promise<T> {
        return this.request<T>(path, { method: 'GET' })
    }

    post<T>(path: string, body: unknown): Promise<T> {
        return this.request<T>(path, { method: 'POST', body: JSON.stringify(body) })
    }

    put<T>(path: string, body: unknown): Promise<T> {
        return this.request<T>(path, { method: 'PUT', body: JSON.stringify(body) })
    }

    delete<T>(path: string): Promise<T> {
        return this.request<T>(path, { method: 'DELETE' })
    }
}

// ─── ML API Error ──────────────────────────────────────
export class MLApiError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number,
        public readonly responseBody: string,
        public readonly path: string,
    ) {
        super(message)
        this.name = 'MLApiError'
    }
}
