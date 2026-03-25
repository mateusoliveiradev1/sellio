import { pgTable, uuid, text, timestamp, bigint } from 'drizzle-orm/pg-core'
import { sellers } from './sellers'
import { mlListings } from './ml-listings'

// ─── Questions ───────────────────────────────────────────

export const questions = pgTable('questions', {
    id: uuid('id').defaultRandom().primaryKey(),
    sellerId: uuid('seller_id')
        .references(() => sellers.id, { onDelete: 'cascade' })
        .notNull(),
    listingId: uuid('listing_id')
        .references(() => mlListings.id, { onDelete: 'set null' }),
    mlQuestionId: bigint('ml_question_id', { mode: 'number' }).unique().notNull(),
    text: text('text').notNull(),
    answer: text('answer'),
    status: text('status').notNull().default('pending'), // pending|answered|deleted
    buyerNickname: text('buyer_nickname'),
    answeredAt: timestamp('answered_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
})
