import { pgTable, uuid, text, timestamp, numeric, bigint } from 'drizzle-orm/pg-core'
import { sellers } from './sellers'
import { mlListings } from './ml-listings'

// ─── Orders ──────────────────────────────────────────────

export const orders = pgTable('orders', {
    id: uuid('id').defaultRandom().primaryKey(),
    sellerId: uuid('seller_id')
        .references(() => sellers.id, { onDelete: 'cascade' })
        .notNull(),
    listingId: uuid('listing_id')
        .references(() => mlListings.id, { onDelete: 'set null' }),
    mlOrderId: bigint('ml_order_id', { mode: 'number' }).unique().notNull(),
    status: text('status').notNull().default('paid'), // paid|shipped|delivered|cancelled
    totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
    commission: numeric('commission', { precision: 12, scale: 2 }).notNull().default('0'),
    shippingCost: numeric('shipping_cost', { precision: 12, scale: 2 }).notNull().default('0'),
    netProfit: numeric('net_profit', { precision: 12, scale: 2 }),
    buyerNickname: text('buyer_nickname'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
