import { z } from 'zod'
import { router, publicProcedure } from '../trpc'
import { orders, questions, products, mlListings } from '@sellio/db'
import { eq } from 'drizzle-orm'

// ─── Webhook Router ──────────────────────────────────────
// Receives real-time notifications from Mercado Livre
// These are PUBLIC procedures (ML doesn't send auth headers)

export const webhookRouter = router({
    /** Process ML webhook notification */
    handleNotification: publicProcedure
        .input(
            z.object({
                resource: z.string(),
                topic: z.string(),
                user_id: z.number(),
                application_id: z.number(),
                sent: z.string(),
                attempts: z.number(),
                received: z.string(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { topic, resource } = input

            switch (topic) {
                case 'orders_v2': {
                    // New order or status change
                    // resource format: "/orders/123456789"
                    const mlOrderId = Number(resource.split('/').pop())
                    if (!isNaN(mlOrderId)) {
                        // TODO: Fetch order details from ML API and upsert into DB
                        console.log(`[Webhook] Order notification: ${mlOrderId}`)
                    }
                    break
                }

                case 'questions': {
                    // New question
                    // resource format: "/questions/987654"
                    const mlQuestionId = Number(resource.split('/').pop())
                    if (!isNaN(mlQuestionId)) {
                        // TODO: Fetch question details from ML API and insert into DB
                        console.log(`[Webhook] Question notification: ${mlQuestionId}`)
                    }
                    break
                }

                case 'items': {
                    // Item status change
                    // resource format: "/items/MLB123456"
                    const mlId = resource.split('/').pop()
                    if (mlId) {
                        // TODO: Sync item status from ML
                        console.log(`[Webhook] Item notification: ${mlId}`)
                    }
                    break
                }

                case 'payments': {
                    console.log(`[Webhook] Payment notification: ${resource}`)
                    break
                }

                case 'shipments': {
                    console.log(`[Webhook] Shipment notification: ${resource}`)
                    break
                }

                default:
                    console.log(`[Webhook] Unknown topic: ${topic}, resource: ${resource}`)
            }

            return { received: true }
        }),
})
