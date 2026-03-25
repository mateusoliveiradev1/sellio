import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getAuthUrl, exchangeCodeForTokens } from '../auth'
import { MLClient, MLApiError } from '../client'
import { ItemsApi } from '../items'
import type { MLAppConfig, MLClientConfig } from '../types'

// ─── Test Helpers ────────────────────────────────────────

const APP_CONFIG: MLAppConfig = {
    clientId: 'test-client-id',
    clientSecret: 'test-client-secret',
    redirectUri: 'https://sellio.com/api/auth/callback/ml',
}

function createMockClientConfig(overrides?: Partial<MLClientConfig>): MLClientConfig {
    return {
        sellerId: 'seller-123',
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        onTokenRefreshed: vi.fn(),
        ...overrides,
    }
}

// ─── Auth Tests ──────────────────────────────────────────

describe('getAuthUrl', () => {
    it('generates correct ML authorization URL', () => {
        const url = getAuthUrl(APP_CONFIG)
        expect(url).toContain('https://auth.mercadolibre.com.ar/authorization')
        expect(url).toContain('client_id=test-client-id')
        expect(url).toContain('response_type=code')
        expect(url).toContain(encodeURIComponent(APP_CONFIG.redirectUri))
    })
})

describe('exchangeCodeForTokens', () => {
    it('exchanges code for tokens successfully', async () => {
        const mockTokens = {
            access_token: 'new-access',
            token_type: 'Bearer',
            expires_in: 21600,
            scope: 'read write',
            user_id: 12345,
            refresh_token: 'new-refresh',
        }

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockTokens),
        })

        const result = await exchangeCodeForTokens('auth-code-123', APP_CONFIG)
        expect(result.access_token).toBe('new-access')
        expect(result.user_id).toBe(12345)
        expect(result.refresh_token).toBe('new-refresh')
    })

    it('throws on failed exchange', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 400,
            text: () => Promise.resolve('invalid_grant'),
        })

        await expect(exchangeCodeForTokens('bad-code', APP_CONFIG)).rejects.toThrow(
            'ML OAuth token exchange failed',
        )
    })
})

// ─── Client Tests ────────────────────────────────────────

describe('MLClient', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    it('makes authenticated GET request', async () => {
        const mockResponse = { id: 'MLB123', title: 'Test Item' }

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockResponse),
            headers: new Headers(),
        })

        const client = new MLClient(createMockClientConfig(), APP_CONFIG)
        const result = await client.get<typeof mockResponse>('/items/MLB123')

        expect(result.id).toBe('MLB123')
        expect(global.fetch).toHaveBeenCalledWith(
            'https://api.mercadolibre.com/items/MLB123',
            expect.objectContaining({
                method: 'GET',
                headers: expect.objectContaining({
                    Authorization: 'Bearer test-access-token',
                }),
            }),
        )
    })

    it('auto-refreshes token on 401', async () => {
        const onTokenRefreshed = vi.fn()

        // First call returns 401, then refresh succeeds, then retry succeeds
        global.fetch = vi
            .fn()
            // Original request → 401
            .mockResolvedValueOnce({
                ok: false,
                status: 401,
                headers: new Headers(),
            })
            // Token refresh → success
            .mockResolvedValueOnce({
                ok: true,
                json: () =>
                    Promise.resolve({
                        access_token: 'refreshed-token',
                        refresh_token: 'new-refresh',
                        expires_in: 21600,
                    }),
            })
            // Retry original → success
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: () => Promise.resolve({ id: 'MLB123' }),
                headers: new Headers(),
            })

        const client = new MLClient(createMockClientConfig({ onTokenRefreshed }), APP_CONFIG)
        const result = await client.get<{ id: string }>('/items/MLB123')

        expect(result.id).toBe('MLB123')
        expect(onTokenRefreshed).toHaveBeenCalledWith(
            expect.objectContaining({
                accessToken: 'refreshed-token',
                refreshToken: 'new-refresh',
            }),
        )
        expect(global.fetch).toHaveBeenCalledTimes(3) // original + refresh + retry
    })

    it('throws MLApiError on non-retryable errors', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            status: 404,
            text: () => Promise.resolve('Not found'),
            headers: new Headers(),
        })

        const client = new MLClient(createMockClientConfig(), APP_CONFIG)

        try {
            await client.get('/items/INVALID')
            expect.unreachable()
        } catch (error) {
            expect(error).toBeInstanceOf(MLApiError)
            expect((error as MLApiError).statusCode).toBe(404)
        }
    })
})

// ─── Items API Tests ─────────────────────────────────────

describe('ItemsApi', () => {
    it('creates item with correct payload', async () => {
        const mockItem = { id: 'MLB456', title: 'New Item', status: 'active' }

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockItem),
            headers: new Headers(),
        })

        const client = new MLClient(createMockClientConfig(), APP_CONFIG)
        const items = new ItemsApi(client)

        const result = await items.create({
            title: 'Fone Bluetooth',
            category_id: 'MLB1055',
            price: 149.9,
            currency_id: 'BRL',
            available_quantity: 10,
            buying_mode: 'buy_it_now',
            condition: 'new',
            listing_type_id: 'gold_special',
        })

        expect(result.id).toBe('MLB456')
        expect(global.fetch).toHaveBeenCalledWith(
            'https://api.mercadolibre.com/items',
            expect.objectContaining({
                method: 'POST',
            }),
        )
    })

    it('updates price only', async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ id: 'MLB123', price: 199.9 }),
            headers: new Headers(),
        })

        const client = new MLClient(createMockClientConfig(), APP_CONFIG)
        const items = new ItemsApi(client)
        const result = await items.updatePrice('MLB123', 199.9)

        expect(result.price).toBe(199.9)
    })
})
