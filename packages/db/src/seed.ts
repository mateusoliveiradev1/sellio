import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { sql } from 'drizzle-orm'
import * as schema from './schema/index'

async function main() {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is missing')

    const db = drizzle(neon(process.env.DATABASE_URL), { schema })
    const devSellerId = '11111111-1111-1111-1111-111111111111'

    console.log('Seeding dummy seller...')
    await db.execute(sql`
    INSERT INTO sellers (id, name, email, plan) 
    VALUES (${devSellerId}, 'Desenvolvedor', 'dev@sellio.com', 'free') 
    ON CONFLICT (id) DO NOTHING;
  `)

    console.log('Seed done!')
    process.exit(0)
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})
