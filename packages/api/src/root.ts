import { router } from './trpc'
import { authRouter } from './routers/auth.router'
import { productRouter } from './routers/product.router'
import { orderRouter } from './routers/order.router'
import { questionRouter } from './routers/question.router'
import { billingRouter } from './routers/billing.router'
import { webhookRouter } from './routers/webhook.router'
import { dashboardRouter } from './routers/dashboard.router'

// ─── App Router ──────────────────────────────────────────
// All routers grouped under one typed root

export const appRouter = router({
    auth: authRouter,
    product: productRouter,
    order: orderRouter,
    question: questionRouter,
    billing: billingRouter,
    webhook: webhookRouter,
    dashboard: dashboardRouter,
})

export type AppRouter = typeof appRouter
