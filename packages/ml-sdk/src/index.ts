// @sellio/ml-sdk — HTTP client for Mercado Livre API
export { MLClient, MLApiError } from './client'
export { getAuthUrl, exchangeCodeForTokens, refreshAccessToken } from './auth'
export { ItemsApi } from './items'
export { OrdersApi } from './orders'
export { QuestionsApi } from './questions'
export type {
    MLClientConfig,
    MLAppConfig,
    MLTokenResponse,
    MLItem,
    MLItemCreateInput,
    MLOrder,
    MLQuestion,
    MLSearchResponse,
} from './types'

import type { MLClientConfig, MLAppConfig } from './types'
import { MLClient } from './client'
import { ItemsApi } from './items'
import { OrdersApi } from './orders'
import { QuestionsApi } from './questions'

/**
 * Creates a complete ML SDK instance for a specific seller.
 * Groups all API modules under one object.
 */
export function createMLSdk(clientConfig: MLClientConfig, appConfig: MLAppConfig) {
    const client = new MLClient(clientConfig, appConfig)
    return {
        client,
        items: new ItemsApi(client),
        orders: new OrdersApi(client),
        questions: new QuestionsApi(client),
    }
}

export type MLSdk = ReturnType<typeof createMLSdk>
