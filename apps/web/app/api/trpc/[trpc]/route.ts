import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { appRouter, createContext } from '@sellio/api'
import { createDb } from '@sellio/db'
import { cookies } from 'next/headers'

// Initialize DB connection globally for serverless functions
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
    throw new Error("DATABASE_URL variable is entirely missing. Provide a Neon connection string in .env")
}
const db = createDb(databaseUrl)

const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: appRouter,
        createContext: async () => {
            // Lê o sellerId real do cookie de sessão (setado no OAuth callback)
            const cookieStore = await cookies()
            const sellerId = cookieStore.get('sellio_session')?.value || ''

            return createContext({
                db,
                sellerId,
                mlAppConfig: {
                    clientId: process.env.ML_CLIENT_ID || '',
                    clientSecret: process.env.ML_CLIENT_SECRET || '',
                    redirectUri: process.env.ML_REDIRECT_URI || '',
                },
            })
        },
    })

export { handler as GET, handler as POST }
