import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function TermosPage() {
    return (
        <div className="min-h-screen bg-[#000000] text-white/80 font-sans selection:bg-accent/30 selection:text-white">
            <nav className="border-b border-white/[0.04] bg-black/40 backdrop-blur-2xl px-6 h-16 flex items-center sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-2 text-sm font-medium text-white/50 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Voltar para Home
                </Link>
            </nav>

            <main className="max-w-3xl mx-auto px-6 py-24">
                <h1 className="text-4xl font-bold text-white mb-8">Termos de Uso</h1>
                <p className="text-sm text-white/40 mb-12">Última atualização: Março de 2026</p>

                <div className="space-y-8 text-white/60 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">1. Aceitação dos Termos</h2>
                        <p>
                            Ao acessar e usar a plataforma Sellio, você concorda em cumprir e ficar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, você não tem permissão para acessar o serviço.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">2. Uso da Plataforma</h2>
                        <p>
                            A Sellio fornece ferramentas de automação e integração com o Mercado Livre. Você concorda em usar a plataforma estritamente de acordo com as leis aplicáveis e as políticas do próprio Mercado Livre. Não nos responsabilizamos por bloqueios de conta no Mercado Livre devido ao uso indevido das APIs ou infrações das regras de mercado.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">3. Funcionalidades Beta</h2>
                        <p>
                            Como usuário do Plano Beta MVP, você reconhece que a plataforma está em desenvolvimento contínuo. Recursos estão sob avaliação e podem sofrer downtime, alterações ou remoções sem aviso prévio. Nenhuma indenização será concedida devido à instabilidade do Plano Gratuito.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">4. Limitação de Responsabilidade</h2>
                        <p>
                            A Sellio não se responsabiliza por quaisquer perdas de lucros, dados ou vendas decorrentes de falhas da técnica, problemas de sincronização com o Mercado Livre ou interrupções nos serviços de Inteligência Artificial do Google Genesis.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    )
}
