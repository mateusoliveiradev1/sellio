import { pgTable, uuid, text, timestamp, numeric, jsonb } from 'drizzle-orm/pg-core'
import { sellers } from './sellers'
import { products } from './products'

// ─── ML Listings ─────────────────────────────────────────
// Mirror of the listing on Mercado Livre (derived from Product)

export const mlListings = pgTable('ml_listings', {
    id: uuid('id').defaultRandom().primaryKey(),
    productId: uuid('product_id')
        .references(() => products.id, { onDelete: 'cascade' })
        .notNull(),
    sellerId: uuid('seller_id')
        .references(() => sellers.id, { onDelete: 'cascade' })
        .notNull(),
    mlId: text('ml_id').unique().notNull(),
    mlCategoryId: text('ml_category_id').notNull(),
    listingType: text('listing_type').notNull().default('gold_special'),
    mlStatus: text('ml_status').notNull().default('active'),
    permalink: text('permalink'),
    mlPrice: numeric('ml_price', { precision: 12, scale: 2 }).notNull(),
    lastSyncedAt: timestamp('last_synced_at'),
    mlRawData: jsonb('ml_raw_data'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
