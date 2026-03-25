'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    MessageSquare,
    Settings,
    LogOut,
    Wallet,
    Sparkles,
    X,
    User
} from 'lucide-react'
import { trpc } from '../../trpc/client'

const PRIMARY_NAV = [
    { href: '/dashboard', label: 'Panorama', icon: LayoutDashboard },
    { href: '/dashboard/produtos', label: 'Produtos', icon: Package },
    { href: '/dashboard/pedidos', label: 'Pedidos', icon: ShoppingCart },
    { href: '/dashboard/mensagens', label: 'Mensagens', icon: MessageSquare },
    { href: '/dashboard/financeiro', label: 'Financeiro', icon: Wallet },
] as const

const SECONDARY_NAV = [
    { href: '/dashboard/config', label: 'Ajustes', icon: Settings },
] as const

interface SidebarProps {
    mobileOpen?: boolean;
    setMobileOpen?: (open: boolean) => void;
}

export function Sidebar({ mobileOpen = false, setMobileOpen }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { data: authData } = trpc.auth.getConnection.useQuery()

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            router.push('/')
            router.refresh()
        } catch (error) {
            console.error('Logout failed', error)
        }
    }

    return (
        <>
            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden hover:cursor-pointer"
                    onClick={() => setMobileOpen?.(false)}
                />
            )}

            <aside className={`fixed bottom-0 left-0 top-0 z-50 w-[18.5rem] border-r border-white/[0.05] bg-[#0a0a0a] lg:bg-black/20 backdrop-blur-2xl flex flex-col transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Brand Header */}
                <div className="flex h-24 items-center justify-between px-8">
                    <div className="flex items-center gap-3">
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-info p-0.5 shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-black/50 backdrop-blur-sm">
                                <span className="text-lg font-black text-white">S</span>
                            </div>
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">Sellio</span>
                    </div>
                    {/* Close button for mobile */}
                    <button
                        className="lg:hidden text-text-muted hover:text-white p-2 transition-colors"
                        onClick={() => setMobileOpen?.(false)}
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex flex-1 flex-col justify-between px-4 pb-8 pt-4 overflow-y-auto custom-scrollbar">
                    <nav className="space-y-1.5">
                        <p className="px-4 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Principal</p>
                        {PRIMARY_NAV.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`group flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium transition-colors duration-300 ${isActive
                                        ? 'bg-accent/10 text-white shadow-[0_0_20px_rgba(79,70,229,0.15)] ring-1 ring-accent/20'
                                        : 'text-text-muted hover:bg-white/[0.04] hover:text-white'
                                        }`}
                                    onClick={() => setMobileOpen?.(false)}
                                >
                                    <item.icon
                                        className={`h-4.5 w-4.5 transition-colors duration-300 ${isActive ? 'text-accent' : 'text-text-muted group-hover:text-text-secondary'}`}
                                        strokeWidth={isActive ? 2.5 : 2}
                                    />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="space-y-6 mt-8">
                        {/* Pro Max Upgrade Banner */}
                        <div className="mx-2 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-5 ring-1 ring-white/10 relative overflow-hidden group">
                            <div className="absolute -inset-10 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="h-4 w-4 text-warning" />
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Pro Max</span>
                            </div>
                            <p className="text-xs text-text-secondary leading-relaxed mb-3">
                                Automatize suas vendas no Mercado Livre com IA.
                            </p>
                            <button className="w-full rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white hover:bg-white/20 transition-colors">
                                Fazer Upgrade
                            </button>
                        </div>

                        <nav className="space-y-1.5 border-t border-white/[0.05] pt-6">
                            {SECONDARY_NAV.map((item) => {
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`group flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium transition-colors duration-300 ${isActive
                                            ? 'bg-accent/10 text-white shadow-[0_0_20px_rgba(79,70,229,0.15)] ring-1 ring-accent/20'
                                            : 'text-text-muted hover:bg-white/[0.04] hover:text-white'
                                            }`}
                                        onClick={() => setMobileOpen?.(false)}
                                    >
                                        <item.icon
                                            className={`h-4.5 w-4.5 transition-colors duration-300 ${isActive ? 'text-accent' : 'text-text-muted group-hover:text-text-secondary'}`}
                                            strokeWidth={isActive ? 2.5 : 2}
                                        />
                                        {item.label}
                                    </Link>
                                )
                            })}

                            <div className="group relative flex w-full flex-col gap-1 rounded-2xl px-4 py-3 bg-white/[0.02] border border-white/[0.05]">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/20">
                                        <User className="h-4 w-4 text-accent" />
                                    </div>
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-xs text-text-muted">Conectado como</span>
                                        <span className="text-sm font-bold text-white truncate max-w-[150px]">
                                            {authData?.mlNickname || 'Carregando...'}
                                        </span>
                                    </div>
                                </div>
                            </div>


                            <button
                                onClick={handleLogout}
                                className="group relative mt-2 flex w-full items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium text-danger/80 transition-colors duration-300 hover:bg-danger/10 hover:text-danger"
                            >
                                <LogOut className="h-4.5 w-4.5" strokeWidth={2} />
                                Sair da conta
                            </button>
                        </nav>
                    </div>
                </div>
            </aside>
        </>
    )
}
