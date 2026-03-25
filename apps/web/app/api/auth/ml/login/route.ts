import { NextResponse } from 'next/server'
import { getAuthUrl } from '@sellio/ml-sdk'

export async function GET() {
    const clientId = process.env.ML_CLIENT_ID
    const redirectUri = process.env.ML_REDIRECT_URI

    if (!clientId || !redirectUri) {
        return NextResponse.json(
            { error: 'Variáveis de ambiente do Mercado Livre (Client ID ou Redirect URI) não configuradas.' },
            { status: 500 }
        )
    }

    // Gera a URL do Mercado Livre perguntando: "Você permite que o Sellio acesse sua conta?"
    const url = getAuthUrl({
        clientId,
        clientSecret: '', // Not strictly needed for building the URL string
        redirectUri
    })

    // Redireciona o navegador do usuário para o ML
    return NextResponse.redirect(url)
}
