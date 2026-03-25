import { DollarSign, TrendingDown, TrendingUp, Truck } from 'lucide-react'
import { KpiCard } from '../../components/kpi-card'

export default function FinancialPage() {
    return (
        <div className="space-y-6" data-testid="financial-page">
            <div>
                <h1 className="text-2xl font-bold text-text-primary">Quanto você lucrou?</h1>
                <p className="mt-1 text-sm text-text-secondary">Resumo financeiro do período</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                <KpiCard label="Faturamento bruto" value="12.450,00" icon={DollarSign} prefix="R$ " trend={{ value: '+12.5%', positive: true }} />
                <KpiCard label="Comissões ML" value="1.743,00" icon={TrendingDown} prefix="R$ " />
                <KpiCard label="Frete" value="890,00" icon={Truck} prefix="R$ " />
                <KpiCard label="Lucro líquido" value="9.817,00" icon={TrendingUp} prefix="R$ " trend={{ value: '+8.3%', positive: true }} />
            </div>

            <div className="glass-card">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-secondary">
                    Detalhamento por tipo
                </h2>
                <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border">
                    <p className="text-sm text-text-muted">Gráfico de comissões será ativado com dados reais</p>
                </div>
            </div>
        </div>
    )
}
