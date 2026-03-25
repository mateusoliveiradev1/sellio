import { NextResponse } from 'next/server'
import { exchangeCodeForTokens } from '@sellio/ml-sdk'
import { createDb, eq } from '@sellio/db'
import { mlTokens, sellers } from '@sellio/db/schema'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    console.log('🔑 [ML OAuth] Callback received, code exists:', !!code)

    if (!code) {
        return NextResponse.redirect(new URL('/?error=auth_failed', request.url))
    }

    const clientId = process.env.ML_CLIENT_ID
    const clientSecret = process.env.ML_CLIENT_SECRET
    const redirectUri = process.env.ML_REDIRECT_URI
    const databaseUrl = process.env.DATABASE_URL

    if (!clientId || !clientSecret || !redirectUri || !databaseUrl) {
        console.error('❌ [ML OAuth] Missing env vars!')
        return NextResponse.json({ error: 'Configuração do Sistema Incompleta (.env)' }, { status: 500 })
    }

    try {
        // 1. Troca o código temporário por Access Token
        console.log('🔑 [ML OAuth] Step 1: Exchanging code for tokens...')
        const tokens = await exchangeCodeForTokens(code, { clientId, clientSecret, redirectUri })
        console.log('✅ [ML OAuth] Step 1 OK: Got tokens, mlUserId:', tokens.user_id)

        // 2. Busca informações do usuário na API do ML
        console.log('🔑 [ML OAuth] Step 2: Fetching ML user info...')
        const mlUserRes = await fetch(`https://api.mercadolibre.com/users/${tokens.user_id}`, {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        })
        const mlUser = await mlUserRes.json() as {
            id: number
            nickname: string
            email: string
            first_name: string
            last_name: string
        }
        console.log('✅ [ML OAuth] Step 2 OK: ML user nickname:', mlUser.nickname, 'email:', mlUser.email)

        // 3. Conecta no DB
        const db = createDb(databaseUrl)

        // 4. Find-or-create: busca seller pelo mlUserId nos tokens
        console.log('🔑 [ML OAuth] Step 3: Finding or creating seller...')
        const existingTokenRow = await db
            .select()
            .from(mlTokens)
            .where(eq(mlTokens.mlUserId, tokens.user_id))
            .then((rows) => rows[0] ?? null)

        let sellerId: string

        if (existingTokenRow) {
            // Seller já existe — atualiza tokens
            sellerId = existingTokenRow.sellerId
            console.log('🔑 [ML OAuth] Existing seller found:', sellerId)

            await db.update(mlTokens)
                .set({
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token ?? null,
                    expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
                    mlNickname: mlUser.nickname,
                    updatedAt: new Date(),
                })
                .where(eq(mlTokens.mlUserId, tokens.user_id))
        } else {
            // Seller novo — cria seller + tokens
            console.log('🔑 [ML OAuth] New seller — creating account...')

            const sellerName = mlUser.first_name && mlUser.last_name
                ? `${mlUser.first_name} ${mlUser.last_name}`
                : mlUser.nickname

            const [newSeller] = await db.insert(sellers).values({
                email: mlUser.email || `${mlUser.nickname}@ml.sellio.app`,
                name: sellerName,
                plan: 'free',
            }).returning()

            if (!newSeller) throw new Error('Falha ao criar seller no banco.')

            sellerId = newSeller.id
            console.log('✅ [ML OAuth] New seller created:', sellerId)

            await db.insert(mlTokens).values({
                sellerId,
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token ?? null,
                mlUserId: tokens.user_id,
                mlNickname: mlUser.nickname,
                expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
            })
        }
        console.log('✅ [ML OAuth] Step 3 OK: Tokens saved for seller:', sellerId)

        // 5. Redireciona para o dashboard com cookie de sessão real
        const response = NextResponse.redirect(new URL('/dashboard', request.url))

        response.cookies.set('sellio_session', sellerId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 semana
        })

        console.log('✅ [ML OAuth] Done! Redirecting to /dashboard, seller:', sellerId)
        return response

    } catch (error: any) {
        console.error("❌ [ML OAuth] FULL ERROR:", JSON.stringify({
            message: error.message,
            stack: error.stack?.split('\n').slice(0, 5),
        }, null, 2))
        return NextResponse.redirect(new URL('/?error=auth_exchange_failed', request.url))
    }
}
