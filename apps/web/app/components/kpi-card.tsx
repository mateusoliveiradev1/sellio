import type { LucideIcon } from 'lucide-react'

interface KpiCardProps {
    label: string
    value: string | number
    icon: LucideIcon
    trend?: { value: string; positive: boolean }
    prefix?: string
}

export function KpiCard({ label, value, icon: Icon, trend, prefix = '' }: KpiCardProps) {
    return (
        <div className="glass-card group relative overflow-hidden" data-testid={`kpi-${label.toLowerCase().replace(/\s/g, '-')}`}>
            {/* Animated Gradient Glow on Hover */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-accent/0 via-accent/20 to-info/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative flex items-start justify-between">
                <div className="space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text-secondary group-hover:text-text-primary transition-colors">
                        {label}
                    </p>
                    <div className="flex items-baseline gap-1">
                        {prefix && <span className="font-mono text-xl font-medium text-text-muted">{prefix}</span>}
                        <p className="font-mono text-3xl font-bold tracking-tight text-white drop-shadow-sm">
                            {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
                        </p>
                    </div>
                    {trend && (
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className={`flex h-4 items-center justify-center rounded bg-black/20 px-1.5 text-[10px] font-bold tracking-wide ${trend.positive ? 'text-success ring-1 ring-success/20' : 'text-danger ring-1 ring-danger/20'}`}>
                                {trend.positive ? '↑' : '↓'} {trend.value}
                            </span>
                        </div>
                    )}
                </div>

                {/* Icon Container with subtle radial glow */}
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.04] ring-1 ring-white/[0.05] transition-colors duration-300 group-hover:bg-white/[0.08]">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-accent/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <Icon className="relative h-5 w-5 text-text-secondary transition-colors duration-300 group-hover:text-white" strokeWidth={1.5} />
                </div>
            </div>
        </div>
    )
}
