import { NextResponse } from 'next/server'
import { exchangeCodeForTokens } from '@sellio/ml-sdk'
import { createDb } from '@sellio/db'
import { eq } from 'drizzle-orm'
import { sellers } from '@sellio/db/schema'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    // O ML falhou ou o usuário recusou
    if (!code) {
        return NextResponse.redirect(new URL('/?error=auth_failed', request.url))
    }

    const clientId = process.env.ML_CLIENT_ID
    const clientSecret = process.env.ML_CLIENT_SECRET
    const redirectUri = process.env.ML_REDIRECT_URI
    const databaseUrl = process.env.DATABASE_URL

    if (!clientId || !clientSecret || !redirectUri || !databaseUrl) {
        return NextResponse.json({ error: 'Configuração do Sistema Incompleta (.env)' }, { status: 500 })
    }

    try {
        // 1. Troca o código temporário por Access Token de Produção
        const tokens = await exchangeCodeForTokens(code, {
            clientId,
            clientSecret,
            redirectUri,
        })

        // 2. Conecta no DB Neon
        const db = createDb(databaseUrl)

        // No MVP, amarramos esse login ao nosso usuário de testes (Dev Seller)
        const devSellerId = '11111111-1111-1111-1111-111111111111'

        // 3. Salva o Token de forma segura na tabela do Seller
        await db.update(sellers)
            .set({
                mlAccessToken: tokens.access_token,
                mlRefreshToken: tokens.refresh_token,
                mlUserId: tokens.user_id.toString(),
                mlTokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000)
            })
            .where(eq(sellers.id, devSellerId))

        // 4. Redirecionamento mágico e criação de sessão simulada (Cookie)
        const response = NextResponse.redirect(new URL('/dashboard', request.url))

        response.cookies.set('sellio_session', devSellerId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7 // 1 semana ativo
        })

        return response

    } catch (error: any) {
        console.error("❌ Erro OAuth ML:", error.response?.data || error.message)
        return NextResponse.redirect(new URL('/?error=auth_exchange_failed', request.url))
    }
}
