import { createDb } from './src/client';
import { sql } from 'drizzle-orm';
import * as dotenv from 'dotenv';
dotenv.config({ path: '../../.env' }); // try root env

async function run() {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error('No DB URL');
    const db = createDb(url);
    const res = await db.execute(sql`SELECT id, name, email FROM sellers`);
    console.log('--- SELLERS IN DB ---');
    console.log(res);
    process.exit(0);
}
run();
