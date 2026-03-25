import { pgTable, uuid, text, timestamp, numeric } from 'drizzle-orm/pg-core'
import { sellers } from './sellers'
import { orders } from './orders'

// ─── Billing ─────────────────────────────────────────────

export const billing = pgTable('billing', {
    id: uuid('id').defaultRandom().primaryKey(),
    sellerId: uuid('seller_id')
        .references(() => sellers.id, { onDelete: 'cascade' })
        .notNull(),
    orderId: uuid('order_id')
        .references(() => orders.id, { onDelete: 'set null' }),
    type: text('type').notNull(), // commission|shipping_fee|fixed_fee|refund
    amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
    description: text('description'),
    mlBillingId: text('ml_billing_id'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})
