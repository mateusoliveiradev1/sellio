'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
    DollarSign,
    Package,
    ShoppingCart,
    TrendingUp,
    BarChart3,
    Clock,
    Filter,
    Loader2
} from 'lucide-react'
import { KpiCard } from '../components/kpi-card'
import { StatusBadge } from '../components/status-badge'
import { trpc } from '../../trpc/client'

export default function DashboardPage() {
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

    const { data, isLoading, error } = trpc.dashboard.getOverview.useQuery({ timeRange })

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-text-muted">
                <Loader2 className="h-12 w-12 animate-spin mb-4" />
                <p>Calculando panorama da conta...</p>
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-danger">
                <p>Falha ao carregar os dados do dashboard.</p>
            </div>
        )
    }

    const { metrics, recentOrders, chartData } = data

    return (
        <div className="space-y-8 animate-fade-in" data-testid="dashboard-page">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.05] pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary drop-shadow-sm">Panorama</h1>
                    <p className="mt-1 text-sm text-text-secondary">Seu panorama de vendas e faturamento no ML</p>
                </div>

                <div className="flex gap-2">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value as any)}
                        className="rounded-xl border border-white/[0.08] bg-black/40 px-3 py-2 text-sm font-medium text-text-secondary hover:bg-white/[0.02] focus:border-accent/50 focus:outline-none transition-colors cursor-pointer"
                    >
                        <option value="7d">Últimos 7 dias</option>
                        <option value="30d">Últimos 30 dias</option>
                        <option value="90d">Últimos 90 dias</option>
                    </select>
                    <button className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white/[0.02] px-4 py-2 text-sm font-medium text-white ring-1 ring-white/[0.05] hover:bg-white/[0.06] transition-colors">
                        <Filter className="h-4 w-4 text-text-muted" />
                        <span className="hidden sm:inline">Filtrar</span>
                    </button>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <KpiCard
                    label="Receita no Período"
                    value={metrics.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    prefix="R$"
                    trend={{ value: `${Math.abs(metrics.trends.revenue)}%`, positive: metrics.trends.revenue >= 0 }}
                    icon={DollarSign}
                />
                <KpiCard
                    label="Vendas Recebidas"
                    value={metrics.salesCount}
                    trend={{ value: `${Math.abs(metrics.trends.sales)}%`, positive: metrics.trends.sales >= 0 }}
                    icon={ShoppingCart}
                />
                <KpiCard
                    label="Ticket Médio"
                    value={metrics.avgTicket.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    prefix="R$"
                    trend={{ value: `${Math.abs(metrics.trends.ticket)}%`, positive: metrics.trends.ticket >= 0 }}
                    icon={TrendingUp}
                />
                <KpiCard
                    label="Produtos Sincronizados"
                    value={metrics.activeProducts}
                    icon={Package}
                />
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Main Chart (Takes up 2/3 width) */}
                <div className="glass-card lg:col-span-2 group">
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h2 className="text-sm font-semibold tracking-wide text-white">Faturamento Diário</h2>
                            <p className="mt-1 text-xs text-text-muted">Desempenho projetado ao longo dos dias</p>
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.05] ring-1 ring-white/10 transition-colors group-hover:bg-accent/20 group-hover:ring-accent/30 self-end sm:self-auto">
                            <BarChart3 className="h-4 w-4 text-text-secondary group-hover:text-accent transition-colors" />
                        </div>
                    </div>

                    {/* Live Chart Visualizer */}
                    <div className="flex h-64 items-end justify-between gap-1 sm:gap-2 border-b border-l border-white/[0.05] pb-4 pl-2 sm:pl-4 pt-10">
                        {chartData.map((val, i) => {
                            // Find the max value to calculate CSS percentage dynamically
                            const maxVal = Math.max(...chartData, 100);
                            const heightPct = Math.max(10, (val / maxVal) * 100);

                            return (
                                <div key={i} className="group/bar relative flex w-full flex-col justify-end gap-1 h-full">
                                    <div
                                        style={{ height: `${heightPct * 0.2}%` }}
                                        className="w-full rounded-t-sm bg-danger/50 transition-all duration-500 group-hover/bar:bg-danger/70"
                                    />
                                    <div
                                        style={{ height: `${heightPct}%` }}
                                        className="w-full rounded-t-md bg-accent/80 transition-all duration-500 group-hover/bar:bg-accent shadow-[0_0_10px_rgba(79,70,229,0.2)]"
                                    >
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 transition-opacity group-hover/bar:opacity-100 z-10 pointer-events-none">
                                            <span className="rounded bg-black/90 px-2 py-1 text-xs font-medium text-white backdrop-blur-md ring-1 ring-white/20 whitespace-nowrap">
                                                R$ {val.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-4 flex justify-between px-2 sm:px-4 text-[10px] sm:text-xs font-medium text-text-muted uppercase tracking-wider">
                        <span>Dia 1</span>
                        <span>Dia 2</span>
                        <span>Dia 3</span>
                        <span>Dia 4</span>
                        <span>Dia 5</span>
                        <span>Dia 6</span>
                        <span>Hoje</span>
                    </div>
                </div>

                {/* Recent Activity List */}
                <div className="glass-card">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-sm font-semibold tracking-wide text-white">Atividade Recente</h2>
                        <Clock className="h-4 w-4 text-text-muted" />
                    </div>

                    <div className="space-y-6">
                        {recentOrders.length === 0 ? (
                            <p className="text-sm text-text-muted text-center pt-8">Sem atividades mapeadas ainda.</p>
                        ) : (
                            recentOrders.slice(0, 4).map((order, i) => (
                                <div key={i} className="flex gap-4 group/event">
                                    <div className="relative mt-1 flex flex-col items-center">
                                        <div className={`h-2.5 w-2.5 rounded-full ring-2 ring-background transition-transform duration-300 group-hover/event:scale-125 ${order.status === 'delivered' ? 'bg-success shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                                            : order.status === 'pending' ? 'bg-warning animate-pulse'
                                                : order.status === 'cancelled' ? 'bg-danger'
                                                    : 'bg-info'
                                            }`} />
                                        {i !== Math.min(3, recentOrders.length - 1) && <div className="absolute top-4 h-full w-[1px] bg-gradient-to-b from-white/10 to-transparent" />}
                                    </div>
                                    <div className="flex-1 pb-4 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                            <p className="text-sm font-medium text-white truncate pr-2">Venda #{order.id.split('-')[1]}</p>
                                            <span className="text-[10px] sm:text-xs font-mono text-text-muted shrink-0 mt-0.5 sm:mt-0">Hoje</span>
                                        </div>
                                        <p className="mt-1 text-xs text-text-secondary truncate">{order.buyer} comprou e rendeu {order.val}</p>
                                    </div>
                                </div>
                            ))
                        )}

                    </div>
                    <Link href="/dashboard/pedidos" className="mt-4 w-full flex justify-center items-center rounded-xl border border-white/[0.05] bg-white/[0.02] py-2.5 text-xs font-semibold text-text-secondary hover:bg-white/[0.06] hover:text-white transition-colors">
                        Ver todo o histórico
                    </Link>
                </div>
            </div>

            {/* Bottom Grid: Recent Orders */}
            <div className="glass-card">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-sm font-semibold tracking-wide text-white">Últimos Pedidos</h2>
                        <p className="mt-1 text-xs text-text-muted">Pedidos confirmados mais recentemente</p>
                    </div>
                    <Link href="/dashboard/pedidos" className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors self-start sm:self-auto py-1">
                        Ver todos os Pedidos &rarr;
                    </Link>
                </div>

                <div className="overflow-x-auto w-full custom-scrollbar pb-2">
                    <table className="w-full min-w-[600px] text-left text-sm">
                        <thead>
                            <tr className="border-b border-white/[0.05]">
                                <th className="pb-3 pr-4 font-semibold text-text-muted whitespace-nowrap">ID do Pedido</th>
                                <th className="pb-3 px-4 font-semibold text-text-muted whitespace-nowrap">Comprador</th>
                                <th className="pb-3 px-4 font-semibold text-text-muted whitespace-nowrap">Valor</th>
                                <th className="pb-3 pl-4 font-semibold text-text-muted whitespace-nowrap">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.02]">
                            {recentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-text-muted">Nenhum pedido processado.</td>
                                </tr>
                            ) : (
                                recentOrders.map((row, i) => (
                                    <tr key={i} className="group transition-colors hover:bg-white/[0.02]">
                                        <td className="py-4 pr-4 font-mono text-white/90">{row.id}</td>
                                        <td className="py-4 px-4 text-text-secondary truncate max-w-[150px]">{row.buyer}</td>
                                        <td className="py-4 px-4 font-medium text-white">{row.val}</td>
                                        <td className="py-4 pl-4">
                                            <StatusBadge status={row.status as any} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
