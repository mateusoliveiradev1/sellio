'use client'

import Link from 'next/link'
import { ArrowRight, Bot, Zap, LineChart, MessageSquare, ShieldCheck, ShoppingCart, Target, Clock, Sparkles, CheckCircle2 } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#000000] selection:bg-accent/30 selection:text-white overflow-hidden font-sans">
      {/* ─── BACKGROUND EFFECTS ────────────────────────────────────────────── */}
      <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
        <div className="absolute top-[-20%] w-[1000px] h-[500px] rounded-full bg-accent/20 blur-[120px] opacity-50 mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-info/10 blur-[150px] opacity-40 mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.015] mix-blend-overlay" />
      </div>

      {/* ─── NAVBAR ────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04] bg-black/40 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-b from-white/20 to-white/5 p-[1px] shadow-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/40 to-info/40 opacity-50" />
              <div className="flex h-full w-full items-center justify-center rounded-[9px] bg-[#0a0a0a]">
                <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">S</span>
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight text-white/90">Sellio</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/50">
            <a href="#recursos" className="hover:text-white transition-colors duration-300">Recursos</a>
            <a href="#como-funciona" className="hover:text-white transition-colors duration-300">Automação</a>
            <a href="#precos" className="hover:text-white transition-colors duration-300">Preços</a>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/api/auth/ml/login"
              className="group relative flex h-9 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-black transition-all hover:scale-105 hover:bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
            >
              <span>Conectar Conta</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION ──────────────────────────────────────────────────── */}
      <main className="relative z-10 flex flex-col items-center pt-32 pb-20 md:pt-40 md:pb-24">
        <div className="mx-auto max-w-5xl px-6 text-center">

          <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-1.5 text-xs font-semibold text-white/70 backdrop-blur-md mb-8 shadow-2xl">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Integrado à API Oficial do Mercado Livre</span>
          </div>

          <h1 className="animate-fade-in-up animation-delay-100 text-5xl md:text-7xl lg:text-[80px] font-extrabold tracking-[-0.03em] text-white leading-[1.05] mb-8 text-balance">
            Escale suas vendas no <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFE600] to-[#FFB800] drop-shadow-[0_0_30px_rgba(255,230,0,0.2)]">Mercado Livre.</span> Sem limites.
          </h1>

          <p className="animate-fade-in-up animation-delay-200 mx-auto max-w-2xl text-lg md:text-xl text-white/50 leading-relaxed mb-10 text-balance">
            A primeira plataforma SaaS projetada para automatizar anúncios, controlar suas finanças na ponta do lápis e transformar seu atendimento com Inteligência Artificial.
          </p>

          <div className="animate-fade-in-up animation-delay-300 flex flex-col items-center justify-center gap-4">
            <a
              href="/api/auth/ml/login"
              className="group relative flex h-14 w-full sm:w-[320px] items-center justify-center gap-3 rounded-full bg-accent px-8 text-base font-bold text-white transition-all hover:bg-accent-hover hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              Entrar com Mercado Livre
            </a>
            <div className="flex items-center gap-2 mt-4 opacity-60">
              <ShieldCheck className="w-4 h-4 text-success" />
              <p className="text-xs font-medium text-white/80"> Autenticação 100% segura via OAuth 2.0</p>
            </div>

            <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/10">
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full border-2 border-black bg-gradient-to-br from-blue-400 to-blue-600" />
                <div className="w-8 h-8 rounded-full border-2 border-black bg-gradient-to-br from-purple-400 to-indigo-600" />
                <div className="w-8 h-8 rounded-full border-2 border-black bg-gradient-to-br from-pink-400 to-rose-600" />
                <div className="w-8 h-8 rounded-full border-2 border-black bg-white/[0.05] flex items-center justify-center text-[10px] font-bold text-white/70">+2k</div>
              </div>
              <div className="flex flex-col items-start px-2">
                <div className="flex gap-1 text-warning text-sm">
                  ★★★★★
                </div>
                <span className="text-xs font-medium text-white/40">Sellers ativos este mês</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── BENTO GRID FEATURES ───────────────────────────────────────────── */}
      <section id="recursos" className="relative z-10 py-24 bg-[#0a0a0a] border-y border-white/[0.05]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Menos cliques. <br className="hidden sm:block text-white/50" /> Mais faturamento.</h2>
            <p className="text-white/50 text-lg">Substitua abas infinitas, planilhas e processos manuais por um ecossistema projetado para o Seller profissional.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[340px]">
            <div className="md:col-span-4 relative rounded-3xl border border-white/[0.05] bg-gradient-to-b from-white/[0.03] to-transparent p-1 overflow-hidden group">
              <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="h-full w-full rounded-[20px] bg-[#0a0a0a] p-8 flex flex-col justify-between relative z-10">
                <div className="flex justify-between items-start">
                  <div className="h-12 w-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-accent/90 backdrop-blur-md">
                    <Clock className="w-3 h-3" /> Em breve
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Super Copywriter
                    <span className="ml-2 inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#FBBC05]">
                      (Google Gemini 2.5 Flash)
                    </span>
                  </h3>
                  <p className="text-white/50 leading-relaxed max-w-lg mb-6">
                    Derrube o bloqueio criativo. A Inteligência Artificial do Google analisa seu produto, otimiza o título para o algoritmo do ML e escreve descrições com gatilhos de conversão em tempo real.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 relative rounded-3xl border border-white/[0.05] bg-gradient-to-b from-white/[0.03] to-transparent p-1 overflow-hidden group">
              <div className="absolute inset-0 bg-warning/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="h-full w-full rounded-[20px] bg-[#0a0a0a] p-8 flex flex-col justify-between relative z-10">
                <div className="flex justify-between items-start">
                  <div className="h-12 w-12 rounded-full bg-warning/10 border border-warning/20 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-warning" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-warning/80 backdrop-blur-md">
                    <Clock className="w-3 h-3" /> Em breve
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Auto-Chat IA</h3>
                  <p className="text-white/50 leading-relaxed text-sm">
                    A IA lê a pergunta e sugere a resposta perfeita em milissegundos. Feche a venda mais rápido.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 relative rounded-3xl border border-white/[0.05] bg-gradient-to-b from-white/[0.03] to-transparent p-1 overflow-hidden group">
              <div className="absolute inset-0 bg-info/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="h-full w-full rounded-[20px] bg-[#0a0a0a] p-8 flex flex-col justify-between relative z-10">
                <div className="h-12 w-12 rounded-full bg-info/10 border border-info/20 flex items-center justify-center">
                  <Target className="h-5 w-5 text-info" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Dashboard Preciso</h3>
                  <p className="text-white/50 leading-relaxed text-sm">
                    Margem de lucro, receita bruta e ticket médio. Métricas cruciais atualizadas do Neon BD em tempo real.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-4 relative rounded-3xl border border-white/[0.05] bg-gradient-to-b from-white/[0.03] to-transparent p-1 overflow-hidden group">
              <div className="absolute inset-0 bg-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="h-full w-full rounded-[20px] bg-[#0a0a0a] p-8 flex flex-col justify-between relative z-10">
                <div className="h-12 w-12 rounded-full bg-success/10 border border-success/20 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Sincronização Bidirecional</h3>
                  <p className="text-white/50 leading-relaxed max-w-md">
                    Sem formulários malucos. Conecte sua conta com 1 clique e nós importamos imediatamente seu catálogo, estoque e histórico de vendas para o Sellio via OAuth 2.0 seguro.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (AUTOMAÇÃO) ─────────────────────────────────────── */}
      <section id="como-funciona" className="relative z-10 py-32 bg-[#000000]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">O Fim do Trabalho Manual</h2>
            <p className="text-white/50 text-lg">Um pipeline desenhado para operar a sua loja 24 horas por dia.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-2xl font-black text-white/40">1</div>
              <h4 className="text-xl font-bold text-white mb-3">Conecte via ML</h4>
              <p className="text-white/50 text-sm leading-relaxed">Em 1 clique, importe todos os seus produtos e métricas históricas de forma segura via OAuth.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-6 text-2xl font-black text-accent">2</div>
              <h4 className="text-xl font-bold text-white mb-3">Crie com IA</h4>
              <p className="text-white/50 text-sm leading-relaxed">Passe fotos cruas para o sistema e deixe a IA gerar descrições atrativas instantâneas.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-16 h-16 rounded-2xl bg-success/10 border border-success/20 flex items-center justify-center mb-6 text-2xl font-black text-success">3</div>
              <h4 className="text-xl font-bold text-white mb-3">Publique Imediato</h4>
              <p className="text-white/50 text-sm leading-relaxed">Lance os anúncios diretamente no Mercado Livre sem sair do painel do Sellio.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRICING ───────────────────────────────────────────────────────── */}
      <section id="precos" className="relative z-10 py-32 bg-[#0a0a0a] border-y border-white/[0.05]">
        <div className="mx-auto max-w-4xl px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Preços Simples</h2>
            <p className="text-white/50 text-lg">Cresça a sua operação no Mercado Livre gastando menos do que 1 venda perdida.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* MVP Plan */}
            <div className="rounded-3xl border border-white/10 bg-[#000000] p-8 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="inline-block rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/50 border border-white/10">MVP (Acesso Antecipado)</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Plano Beta</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-white">Grátis</span>
              </div>
              <p className="text-white/50 text-sm mb-8">Tudo o que você precisa para estruturar sua base operacional no ML hoje.</p>
              <div className="space-y-4 mb-8 flex-1">
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-success" /><span className="text-white/80 text-sm">Integração OAuth 1-Click</span></div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-success" /><span className="text-white/80 text-sm">Dashboard de Métricas e Faturamento</span></div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-success" /><span className="text-white/80 text-sm">Central de Pedidos e Mensagens</span></div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-success" /><span className="text-white/80 text-sm">Publicação Ilimitada Manual</span></div>
              </div>
              <a href="/api/auth/ml/login" className="flex h-12 items-center justify-center rounded-xl bg-white/10 text-sm font-bold text-white transition-colors hover:bg-white/20">
                Começar Grátis
              </a>
            </div>

            {/* PRO Plan */}
            <div className="rounded-3xl border border-accent bg-[#0a0a0a] p-8 flex flex-col relative overflow-hidden ring-1 ring-accent/20 shadow-[0_0_40px_rgba(79,70,229,0.15)]">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent to-info" />
              <h3 className="text-2xl font-bold text-white mb-2">Automator Pro</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-xl text-white/50 font-medium">R$</span>
                <span className="text-4xl font-black text-white">149</span>
                <span className="text-white/40 text-sm">/mês</span>
              </div>
              <p className="text-accent text-sm font-medium mb-8">Acesso total à Inteligência Artificial (Em Breve).</p>
              <div className="space-y-4 mb-8 flex-1">
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-white" /><span className="text-white/80 text-sm">Todas as features do plano Beta</span></div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-white" /><span className="text-white/80 text-sm">100 Anúncios otimizados por IA/dia</span></div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-white" /><span className="text-white/80 text-sm">Auto-respostas Instantâneas (IA)</span></div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-white" /><span className="text-white/80 text-sm">Pricing Advisor Inteligente</span></div>
                <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-white" /><span className="text-white/80 text-sm">Suporte Prioritário</span></div>
              </div>
              <button disabled className="flex h-12 items-center justify-center rounded-xl bg-accent/50 text-sm font-bold text-white/50 cursor-not-allowed">
                Lista de Espera (Em Breve)
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA FOOTER ────────────────────────────────────────────────────── */}
      <footer className="relative z-10 pt-32 pb-10 bg-[#000000] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[300px] bg-accent/5 blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-4xl px-6 text-center space-y-8">
          <div className="inline-block p-4 rounded-3xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-md">
            <ShoppingCart className="h-10 w-10 text-white" strokeWidth={1.5} />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight text-balance">
            Sua operação mais rápida e <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">inteligente.</span>
          </h2>

          <div className="pt-8">
            <a
              href="/api/auth/ml/login"
              className="group relative inline-flex h-14 items-center justify-center gap-3 rounded-full bg-white text-base font-bold text-black px-10 transition-all hover:scale-105 hover:bg-white/90 shadow-[0_0_40px_rgba(255,255,255,0.2)] overflow-hidden"
            >
              Comece gratuitamente via Mercado Livre
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <div className="mt-20 text-xs font-medium text-white/30 flex flex-col md:flex-row items-center justify-center gap-4 pt-10 border-t border-white/5">
            <span>© 2026 Sellio Inc. Todos os direitos reservados.</span>
            <span className="hidden md:inline">•</span>
            <div className="flex gap-4">
              <Link href="/termos" className="hover:text-white/70 transition-colors">Termos de Uso</Link>
              <Link href="/privacidade" className="hover:text-white/70 transition-colors">Privacidade</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
