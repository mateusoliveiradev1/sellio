import { pgTable, uuid, text, timestamp, bigint } from 'drizzle-orm/pg-core'
import { sellers } from './sellers'

// ─── ML Tokens ───────────────────────────────────────────
// OAuth tokens per seller (encrypted at app level)

export const mlTokens = pgTable('ml_tokens', {
    id: uuid('id').defaultRandom().primaryKey(),
    sellerId: uuid('seller_id')
        .references(() => sellers.id, { onDelete: 'cascade' })
        .notNull(),
    mlUserId: bigint('ml_user_id', { mode: 'number' }).notNull(),
    accessToken: text('access_token').notNull(),
    refreshToken: text('refresh_token'),
    expiresAt: timestamp('expires_at').notNull(),
    mlNickname: text('ml_nickname'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
