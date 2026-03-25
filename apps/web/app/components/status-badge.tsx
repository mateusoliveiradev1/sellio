interface StatusBadgeProps {
    status: string
    size?: 'sm' | 'md'
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
    // Product statuses
    draft: { bg: 'bg-text-muted/10', text: 'text-text-muted', label: 'Rascunho' },
    ready: { bg: 'bg-info/10', text: 'text-info', label: 'Pronto' },
    publishing: { bg: 'bg-warning/10', text: 'text-warning', label: 'Publicando...' },
    published: { bg: 'bg-success/10', text: 'text-success', label: 'Publicado' },
    error: { bg: 'bg-danger/10', text: 'text-danger', label: 'Erro' },
    paused: { bg: 'bg-warning/10', text: 'text-warning', label: 'Pausado' },
    // Order statuses
    paid: { bg: 'bg-success/10', text: 'text-success', label: 'Pago' },
    shipped: { bg: 'bg-info/10', text: 'text-info', label: 'Enviado' },
    delivered: { bg: 'bg-success/10', text: 'text-success', label: 'Entregue' },
    cancelled: { bg: 'bg-danger/10', text: 'text-danger', label: 'Cancelado' },
    // Question statuses
    pending: { bg: 'bg-warning/10', text: 'text-warning', label: 'Pendente' },
    answered: { bg: 'bg-success/10', text: 'text-success', label: 'Respondida' },
    deleted: { bg: 'bg-danger/10', text: 'text-danger', label: 'Excluída' },
    // ML listing statuses
    active: { bg: 'bg-success/10', text: 'text-success', label: 'Ativo' },
    closed: { bg: 'bg-danger/10', text: 'text-danger', label: 'Fechado' },
    under_review: { bg: 'bg-warning/10', text: 'text-warning', label: 'Em revisão' },
    inactive: { bg: 'bg-text-muted/10', text: 'text-text-muted', label: 'Inativo' },
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
    const style = STATUS_STYLES[status] ?? {
        bg: 'bg-text-muted/10',
        text: 'text-text-muted',
        label: status,
    }

    return (
        <span
            className={`inline-flex items-center rounded-full font-medium ${style.bg} ${style.text} ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
                }`}
        >
            {style.label}
        </span>
    )
}
