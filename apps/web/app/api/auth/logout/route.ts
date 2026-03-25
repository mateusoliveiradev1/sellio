import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
    const cookieStore = await cookies()
    // Limpa o cookie de sessão
    cookieStore.delete('sellio_session')

    return NextResponse.json({ success: true })
}
