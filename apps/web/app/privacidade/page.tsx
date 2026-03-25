import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PrivacidadePage() {
    return (
        <div className="min-h-screen bg-[#000000] text-white/80 font-sans selection:bg-accent/30 selection:text-white">
            <nav className="border-b border-white/[0.04] bg-black/40 backdrop-blur-2xl px-6 h-16 flex items-center sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Voltar para Home
                </Link>
            </nav>

            <main className="max-w-3xl mx-auto px-6 py-24">
                <h1 className="text-4xl font-bold text-white mb-8">Política de Privacidade</h1>
                <p className="text-sm text-white/40 mb-12">Última atualização: Março de 2026</p>

                <div className="space-y-8 text-white/60 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">1. Coleta de Dados</h2>
                        <p>
                            Nós coletamos as informações necessárias para operar sua integração com o Mercado Livre via protocolo OAuth 2.0 seguro. Isso inclui seu NICKNAME, USER_ID, ACCESS_TOKENS e REFRESH_TOKENS. Tais chaves são armazenadas com criptografia em banco de dados isolado hospedado no Neon (PostgreSQL).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">2. Uso das Informações</h2>
                        <p>
                            Os dados coletados da sua conta do Mercado Livre (Pedidos, Anúncios, Mensagens e Dados Financeiros) são consumidos estritamente para preencher seu Dashboard pessoal. **Nunca** compartilhamos ou vendemos seu faturamento ou produtos com terceiros.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">3. Integração com Inteligência Artificial</h2>
                        <p>
                            Quando ativadas, partes do seu inventário podem ser analisadas pela IA do Google (Gemini) para estruturação textual e melhora semântica de descrições e títulos. Nenhuma transação financeira pessoal será indexada pelas IAs.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">4. Direito ao Esquecimento (Revogação)</h2>
                        <p>
                            Você pode desvincular o aplicativo Sellio a qualquer momento acessando o painel de "Aplicações Conectadas" no Mercado Livre. Uma vez desvinculado, nosso acesso é imediatamente cortado do seu catálogo e você pode solicitar a exclusão em massa das suas estatísticas via suporte.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    )
}
