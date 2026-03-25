'use client'

import { useState } from 'react'
import { Search, Filter, Loader2, PackageOpen } from 'lucide-react'
import { StatusBadge } from '../../components/status-badge'
import { trpc } from '../../../trpc/client'

const FILTERS = ['Todos', 'Pagos', 'Enviados', 'Entregues', 'Cancelados']

const STATUS_MAP: Record<string, string> = {
    'Todos': 'all',
    'Pagos': 'paid',
    'Enviados': 'shipped',
    'Entregues': 'delivered',
    'Cancelados': 'cancelled',
}

export default function PedidosPage() {
    const [search, setSearch] = useState('')
    const [activeFilter, setActiveFilter] = useState('Todos') // 'Todos' | 'Pagos' | 'Enviados' | 'Entregues' | 'Cancelados'

    const { data: orders, isLoading, error } = trpc.order.list.useQuery({ limit: 50 })

    const filteredOrders = (orders || []).filter(order => {
        const matchesSearch = order.id.toString().includes(search) || (order.buyerNickname?.toLowerCase() ?? '').includes(search.toLowerCase())
        const matchesFilter = activeFilter === 'Todos' || order.status === STATUS_MAP[activeFilter]
        return matchesSearch && matchesFilter
    })

    return (
        <div className="space-y-6" data-testid="orders-page">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.05] pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary drop-shadow-sm">Pedidos</h1>
                    <p className="mt-1 text-sm text-text-secondary">
                        Acompanhe suas vendas e atualize os status de envio.
                    </p>
                </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-2">
                    {FILTERS.map((filter) => {
                        const isActive = activeFilter === filter
                        return (
                            <button
                                key={filter}
                                type="button"
                                onClick={() => setActiveFilter(filter)}
                                className={`select-none rounded-lg px-4 py-2 text-sm font-semibold border ${isActive
                                    ? 'border-accent bg-accent/20 text-accent'
                                    : 'border-white/[0.08] bg-black/40 text-text-secondary hover:bg-white/[0.05] hover:text-white'
                                    }`}
                                style={{ minWidth: '90px' }}
                            >
                                {filter}
                            </button>
                        )
                    })}
                </div>

                {/* Search */}
                <div className="relative w-full lg:max-w-xs">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Buscar pedido ou comprador..."
                        className="w-full rounded-lg border border-white/[0.08] bg-black/40 py-2 pl-9 pr-3 text-sm text-white placeholder:text-text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
                <div className="overflow-x-auto">
                    {isLoading ? (
                        <div className="flex h-64 flex-col items-center justify-center text-text-muted">
                            <Loader2 className="h-8 w-8 animate-spin mb-4" />
                            <p>Carregando pedidos...</p>
                        </div>
                    ) : error ? (
                        <div className="flex h-64 flex-col items-center justify-center text-danger">
                            <p>Erro ao carregar pedidos.</p>
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <div className="flex h-64 flex-col items-center justify-center text-text-muted">
                            <PackageOpen className="h-12 w-12 mb-4 opacity-50" strokeWidth={1} />
                            <p>Nenhum pedido encontrado.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left text-sm text-text-secondary">
                            <thead className="border-b border-white/[0.05] bg-white/[0.02] text-xs font-bold uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">ID do Pedido</th>
                                    <th className="px-6 py-4">Comprador</th>
                                    <th className="px-6 py-4">Data</th>
                                    <th className="px-6 py-4 text-right">Total</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.05]">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="group transition-colors hover:bg-white/[0.02]">
                                        <td className="px-6 py-4 font-mono text-sm text-white drop-shadow-sm">
                                            #{order.id.toString().padStart(5, '0')}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-white drop-shadow-sm">{order.buyerNickname || 'Desconhecido'}</div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-sm">
                                            {new Date(order.createdAt).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono text-sm font-semibold text-white drop-shadow-sm">
                                            R$ {Number(order.totalAmount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}
