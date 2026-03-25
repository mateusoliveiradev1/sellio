'use client'

import { useState } from 'react'
import { Link2, CheckCircle, Settings, Loader2 } from 'lucide-react'

export default function ConfigPage() {
    const [isUpgrading, setIsUpgrading] = useState(false)

    const handleUpgrade = () => {
        setIsUpgrading(true)
        setTimeout(() => {
            setIsUpgrading(false)
            alert('Integração com Stripe (Fase 5/6) necessária para upgrade.')
        }, 1500)
    }

    return (
        <div className="space-y-6" data-testid="config-page">
            <div>
                <h1 className="text-2xl font-bold text-text-primary drop-shadow-sm">Configurações</h1>
                <p className="mt-1 text-sm text-text-secondary">Sua conta e conexão com o Mercado Livre</p>
            </div>

            {/* ML Connection */}
            <div className="glass-card space-y-4 group">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-success/0 via-success/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="rounded-xl bg-accent/10 p-3 ring-1 ring-accent/20">
                            <Link2 className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-white">Conta Mercado Livre</h2>
                            <p className="text-xs text-text-muted mt-0.5">Conecte sua conta para publicar anúncios e gerenciar pedidos</p>
                        </div>
                    </div>

                    {/* Connected State */}
                    <div className="flex items-center justify-between rounded-xl border border-success/30 bg-success/10 px-5 py-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-success" />
                            <span className="text-sm font-semibold text-success">Conectado</span>
                            <span className="text-xs font-mono tracking-tight text-success/70">· MINHA_LOJA_ML</span>
                        </div>
                        <button className="text-xs font-medium text-text-muted transition-colors hover:text-danger px-3 py-1.5 rounded-lg hover:bg-danger/10">
                            Desconectar
                        </button>
                    </div>
                </div>
            </div>

            {/* Plan */}
            <div className="glass-card space-y-5 group">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-warning/0 via-warning/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="relative">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="rounded-xl bg-warning/10 p-3 ring-1 ring-warning/20">
                            <Settings className="h-5 w-5 text-warning" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-white">Seu plano</h2>
                            <p className="text-xs text-text-muted mt-0.5">Plano Free — Limitado a 10 produtos</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="rounded-xl border border-white/[0.08] bg-black/40 p-5 text-center flex flex-col items-center justify-center">
                            <p className="font-mono text-3xl font-extrabold text-white drop-shadow-sm">5<span className="text-text-muted text-xl font-medium">/10</span></p>
                            <p className="text-[11px] uppercase tracking-widest text-text-secondary mt-2">Produtos usados</p>
                        </div>
                        <div className="rounded-xl border border-white/[0.08] bg-black/40 p-5 text-center flex flex-col items-center justify-center">
                            <p className="font-mono text-3xl font-extrabold text-white drop-shadow-sm">1<span className="text-text-muted text-xl font-medium">/1</span></p>
                            <p className="text-[11px] uppercase tracking-widest text-text-secondary mt-2">Contas ML</p>
                        </div>
                    </div>

                    <button
                        onClick={handleUpgrade}
                        disabled={isUpgrading}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent to-info py-3 text-sm font-bold text-white transition-all hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] active:scale-95 disabled:opacity-70 disabled:pointer-events-none"
                    >
                        {isUpgrading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        {isUpgrading ? 'Processando...' : 'Fazer upgrade (Stripe)'}
                    </button>
                </div>
            </div>
        </div>
    )
}
