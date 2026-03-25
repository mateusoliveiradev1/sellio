import { NextResponse } from 'next/server'
import { exchangeCodeForTokens } from '@sellio/ml-sdk'
import { createDb, eq } from '@sellio/db'
import { mlTokens } from '@sellio/db/schema'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    console.log('🔑 [ML OAuth] Callback received, code exists:', !!code)

    // O ML falhou ou o usuário recusou
    if (!code) {
        return NextResponse.redirect(new URL('/?error=auth_failed', request.url))
    }

    const clientId = process.env.ML_CLIENT_ID
    const clientSecret = process.env.ML_CLIENT_SECRET
    const redirectUri = process.env.ML_REDIRECT_URI
    const databaseUrl = process.env.DATABASE_URL

    console.log('🔑 [ML OAuth] Env check:', {
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
        redirectUri: redirectUri || 'MISSING',
        hasDbUrl: !!databaseUrl,
    })

    if (!clientId || !clientSecret || !redirectUri || !databaseUrl) {
        console.error('❌ [ML OAuth] Missing env vars!')
        return NextResponse.json({ error: 'Configuração do Sistema Incompleta (.env)' }, { status: 500 })
    }

    try {
        // 1. Troca o código temporário por Access Token de Produção
        console.log('🔑 [ML OAuth] Step 1: Exchanging code for tokens...')
        const tokens = await exchangeCodeForTokens(code, {
            clientId,
            clientSecret,
            redirectUri,
        })
        console.log('✅ [ML OAuth] Step 1 OK: Got tokens, mlUserId:', tokens.user_id)

        // 2. Conecta no DB Neon
        console.log('🔑 [ML OAuth] Step 2: Connecting to DB...')
        const db = createDb(databaseUrl)

        // No MVP, amarramos esse login ao nosso usuário de testes (Dev Seller)
        const devSellerId = '11111111-1111-1111-1111-111111111111'

        // 3. Salva o Token de forma segura na tabela mlTokens
        console.log('🔑 [ML OAuth] Step 3: Checking existing tokens...')
        const existingTokens = await db.select().from(mlTokens).where(eq(mlTokens.sellerId, devSellerId));
        console.log('🔑 [ML OAuth] Step 3: Found existing tokens:', existingTokens.length)

        if (existingTokens.length > 0) {
            await db.update(mlTokens)
                .set({
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token,
                    mlUserId: tokens.user_id,
                    expiresAt: new Date(Date.now() + tokens.expires_in * 1000),
                    updatedAt: new Date()
                })
                .where(eq(mlTokens.sellerId, devSellerId))
        } else {
            await db.insert(mlTokens).values({
                sellerId: devSellerId,
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                mlUserId: tokens.user_id,
                expiresAt: new Date(Date.now() + tokens.expires_in * 1000)
            })
        }
        console.log('✅ [ML OAuth] Step 3 OK: Tokens saved to DB')

        // 4. Redirecionamento mágico e criação de sessão simulada (Cookie)
        const response = NextResponse.redirect(new URL('/dashboard', request.url))

        response.cookies.set('sellio_session', devSellerId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 1 semana ativo
        })

        console.log('✅ [ML OAuth] Step 4 OK: Redirecting to /dashboard')
        return response

    } catch (error: any) {
        console.error("❌ [ML OAuth] FULL ERROR:", JSON.stringify({
            message: error.message,
            stack: error.stack?.split('\n').slice(0, 5),
            responseData: error.response?.data,
        }, null, 2))
        return NextResponse.redirect(new URL('/?error=auth_exchange_failed', request.url))
    }
}
