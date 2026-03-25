import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
sql(`INSERT INTO sellers (id, name, email, plan) VALUES ('11111111-1111-1111-1111-111111111111', 'Desenvolvedor', 'dev@sellio.com', 'free') ON CONFLICT (id) DO NOTHING;`).then(() => {
    console.log('Dummy seller seeded successfully!');
    process.exit(0);
});
