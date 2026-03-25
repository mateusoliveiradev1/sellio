import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'

// ─── Sellers ─────────────────────────────────────────────
// Multi-tenant root: every other table references this

export const sellers = pgTable('sellers', {
    id: uuid('id').defaultRandom().primaryKey(),
    email: text('email').unique().notNull(),
    name: text('name').notNull(),
    plan: text('plan').notNull().default('free'), // free | starter | pro | enterprise
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
