'use client'

import { DollarSign, TrendingDown, TrendingUp, Truck, Loader2 } from 'lucide-react'
import { KpiCard } from '../../components/kpi-card'
import { trpc } from '../../../trpc/client'

export default function FinancialPage() {
    const { data, isLoading, error } = trpc.dashboard.getOverview.useQuery({ timeRange: '30d' })

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-text-muted">
                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                <p>Calculando panorama financeiro...</p>
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-danger">
                <p>Falha ao carregar os dados financeiros.</p>
            </div>
        )
    }

    const { metrics } = data

    // Calcular valores aproximados (provisório até termos os cálculos reais na API)
    const comissoes = metrics.revenue * 0.14; // Simulando 14% de comissão
    const fretes = metrics.revenue > 0 ? (metrics.salesCount * 35) : 0; // Simulando R$ 35 de frete médio por venda
    const lucroLiquido = metrics.revenue - comissoes - fretes;

    return (
        <div className="space-y-6 animate-fade-in" data-testid="financial-page">
            <div>
                <h1 className="text-2xl font-bold text-text-primary">Quanto você lucrou?</h1>
                <p className="mt-1 text-sm text-text-secondary">Resumo financeiro do período</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard
                    label="Faturamento bruto"
                    value={metrics.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    icon={DollarSign}
                    prefix="R$ "
                />
                <KpiCard
                    label="Comissões ML"
                    value={comissoes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    icon={TrendingDown}
                    prefix="R$ "
                />
                <KpiCard
                    label="Frete (Aprox)"
                    value={fretes.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    icon={Truck}
                    prefix="R$ "
                />
                <KpiCard
                    label="Lucro líquido"
                    value={lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    icon={TrendingUp}
                    prefix="R$ "
                />
            </div>

            <div className="glass-card">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-secondary">
                    Detalhamento por tipo
                </h2>
                <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border">
                    <p className="text-sm text-text-muted">Gráfico de comissões será ativado com histórico consolidado</p>
                </div>
            </div>
        </div>
    )
}
