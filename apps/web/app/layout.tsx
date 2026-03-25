import type { Metadata } from 'next'
import { TRPCProvider } from '../trpc/provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sellio — Publique no Mercado Livre em 1 clique',
  description:
    'Plataforma que automatiza seus anúncios no Mercado Livre. Cadastre, publique e gerencie tudo em um só lugar.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg-deep text-text-primary antialiased">
        <TRPCProvider>
          {children}
        </TRPCProvider>
      </body>
    </html>
  )
}
