'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Sidebar } from '../components/sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    return (
        <div className="flex min-h-screen selection:bg-accent/30 selection:text-accent">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 border-b border-white/[0.05] bg-background/90 backdrop-blur-xl z-30 flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-info p-0.5">
                        <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-black/50 backdrop-blur-sm">
                            <span className="text-sm font-black text-white">S</span>
                        </div>
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white drop-shadow-sm">Sellio</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 text-text-muted hover:text-white transition-colors"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            <Sidebar mobileOpen={isMobileMenuOpen} setMobileOpen={setIsMobileMenuOpen} />
            <main className="ml-0 lg:ml-[18.5rem] flex-1 translate-z-0 p-4 md:p-8 pb-12 pt-24 lg:pt-10 w-full overflow-x-hidden">
                <div className="mx-auto max-w-6xl">
                    {children}
                </div>
            </main>
        </div>
    )
}
