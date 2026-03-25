import type { MLAppConfig, MLTokenResponse } from './types'

const ML_AUTH_URL = 'https://auth.mercadolivre.com.br/authorization'
const ML_TOKEN_URL = 'https://api.mercadolibre.com/oauth/token'

// ─── OAuth 2.0 Flow ──────────────────────────────────────

/**
 * Step 1: Generate the ML authorization URL.
 * Redirect the seller to this URL to connect their ML account.
 */
export function getAuthUrl(config: MLAppConfig): string {
    const params = new URLSearchParams({
        response_type: 'code',
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
    })
    return `${ML_AUTH_URL}?${params.toString()}`
}

/**
 * Step 2: Exchange authorization code for tokens.
 * Called from the OAuth callback route after seller authorizes.
 */
export async function exchangeCodeForTokens(
    code: string,
    config: MLAppConfig,
): Promise<MLTokenResponse> {
    const response = await fetch(ML_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: config.clientId,
            client_secret: config.clientSecret,
            code,
            redirect_uri: config.redirectUri,
        }),
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`ML OAuth token exchange failed: ${response.status} ${error}`)
    }

    return response.json() as Promise<MLTokenResponse>
}

/**
 * Step 3: Refresh an expired access token.
 * Called automatically by the client interceptor when a 401 is received.
 */
export async function refreshAccessToken(
    refreshToken: string,
    config: MLAppConfig,
): Promise<MLTokenResponse> {
    const response = await fetch(ML_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: config.clientId,
            client_secret: config.clientSecret,
            refresh_token: refreshToken,
        }),
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`ML token refresh failed: ${response.status} ${error}`)
    }

    return response.json() as Promise<MLTokenResponse>
}
