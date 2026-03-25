'use client'

import { useState } from 'react'
import { Package, Plus, Search, Loader2 } from 'lucide-react'
import { StatusBadge } from '../../components/status-badge'
import Link from 'next/link'
import { trpc } from '../../../trpc/client'

export default function ProductsPage() {
    const [search, setSearch] = useState('')

    const { data: products, isLoading } = trpc.product.list.useQuery()

    const activeProducts = products || []
    const filteredProducts = activeProducts.filter((p: any) =>
        p.title.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-6" data-testid="products-page">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.05] pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary drop-shadow-sm">Produtos</h1>
                    <p className="mt-1 text-sm text-text-secondary">
                        Gerencie seu catálogo integrado ao Mercado Livre.
                    </p>
                </div>
                <Link
                    href="/dashboard/produtos/novo"
                    className="flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                >
                    <Plus className="h-4 w-4" />
                    Novo produto
                </Link>
            </div>

            {/* Search */}
            <div className="relative group">
                <div className="absolute -inset-px rounded-xl bg-gradient-to-r from-accent/0 via-accent/20 to-transparent opacity-0 transition-opacity duration-500 group-focus-within:opacity-100" />
                <div className="relative flex items-center">
                    <Search className="absolute left-4 h-4 w-4 text-text-muted group-focus-within:text-accent transition-colors" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar produtos pelo título..."
                        className="w-full rounded-xl border border-white/[0.08] bg-black/40 py-3 pl-11 pr-4 text-sm text-white placeholder:text-text-muted focus:border-accent/50 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors"
                    />
                </div>
            </div>

            {/* Products Table */}
            <div className="glass-card overflow-hidden !p-0">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/[0.08] bg-white/[0.01]">
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-secondary">Produto</th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-secondary">Preço</th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-secondary">Estoque</th>
                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-widest text-text-secondary">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-widest text-text-secondary">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <Loader2 className="h-6 w-6 text-accent animate-spin" />
                                        <p className="text-sm text-text-muted font-medium">Buscando produtos no banco Neon...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredProducts.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-24 text-center">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <Package className="h-8 w-8 text-white/10" />
                                        <p className="text-sm text-text-muted font-medium">Nenhum produto cadastrado no banco.</p>
                                        <p className="text-xs text-white/20">Acesse "Novo produto" para começar a preencher o banco Neon com TRPC.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map((product: any) => (
                                <tr
                                    key={product.id}
                                    className="transition-colors hover:bg-white/[0.02] group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 shrink-0 rounded-lg bg-white/[0.05] ring-1 ring-white/10 flex items-center justify-center">
                                                <Package className="h-5 w-5 text-text-muted" />
                                            </div>
                                            <span className="text-sm font-medium text-text-primary group-hover:text-white transition-colors">
                                                {product.title}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-sm text-white drop-shadow-sm">
                                        R$ {Number(product.price || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`font-mono text-sm font-semibold ${product.stock === 0 ? 'text-danger' : product.stock < 10 ? 'text-warning' : 'text-text-primary'
                                                }`}
                                        >
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={product.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {product.status === 'draft' && (
                                                <button
                                                    onClick={() => alert('Em breve! Para que essa publicação real aconteça, precisamos criar a tela "Ajustes > Conectar Mercado Livre" para termos acesso à API deles!')}
                                                    className="rounded-lg bg-accent/15 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-accent hover:bg-accent hover:text-white transition-colors shadow-[0_0_10px_rgba(79,70,229,0.15)]"
                                                >
                                                    Publicar no ML
                                                </button>
                                            )}
                                            {product.status === 'published' && (
                                                <button
                                                    className="rounded-lg border border-white/5 bg-white/[0.02] px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-text-muted hover:bg-white/10 hover:text-white transition-colors"
                                                >
                                                    Ver Anúncio
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
