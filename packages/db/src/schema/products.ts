import { pgTable, uuid, text, timestamp, integer, numeric, jsonb } from 'drizzle-orm/pg-core'
import { sellers } from './sellers'

// ─── Products ────────────────────────────────────────────
// Source of truth — platform-first, then auto-publishes to ML

export const products = pgTable('products', {
    id: uuid('id').defaultRandom().primaryKey(),
    sellerId: uuid('seller_id')
        .references(() => sellers.id, { onDelete: 'cascade' })
        .notNull(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    images: jsonb('images').$type<string[]>().notNull().default([]),
    price: numeric('price', { precision: 12, scale: 2 }).notNull(),
    cost: numeric('cost', { precision: 12, scale: 2 }),
    stock: integer('stock').notNull().default(0),
    sku: text('sku'),
    categoryId: text('category_id'),
    categorySuggestion: text('category_suggestion'),
    status: text('status').notNull().default('draft'), // draft|ready|publishing|published|error|paused
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
