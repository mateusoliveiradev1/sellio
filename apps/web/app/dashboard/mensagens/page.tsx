'use client'

import { useState } from 'react'
import { MessageCircle, Send, CheckCircle2, Loader2, MailQuestion } from 'lucide-react'
import { StatusBadge } from '../../components/status-badge'
import { trpc } from '../../../trpc/client'

export default function MensagensPage() {
    const [replyText, setReplyText] = useState<Record<string, string>>({})

    const { data: messages, isLoading, error } = trpc.question.list.useQuery({ limit: 50 })

    const pending = (messages || []).filter((q) => q.status === 'pending')
    const answered = (messages || []).filter((q: any) => q.status === 'answered')

    const handleReply = (id: string) => {
        if (!replyText[id]?.trim()) return

        // Simulando a mutação
        alert("Mensagem enviada com sucesso ao cliente!")

        setReplyText(prev => {
            const next = { ...prev }
            delete next[id]
            return next
        })
    }

    return (
        <div className="space-y-6" data-testid="messages-page">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.05] pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary drop-shadow-sm">Mensagens</h1>
                    <p className="mt-1 text-sm text-text-secondary">
                        {pending.length} perguntas aguardando resposta
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex h-64 flex-col items-center justify-center text-text-muted glass-card">
                    <Loader2 className="h-8 w-8 animate-spin mb-4" />
                    <p>Buscando mensagens...</p>
                </div>
            ) : error ? (
                <div className="flex h-64 flex-col items-center justify-center text-danger glass-card">
                    <p>Erro ao carregar mensagens.</p>
                </div>
            ) : (!messages || messages.length === 0) ? (
                <div className="flex h-64 flex-col items-center justify-center text-text-muted glass-card">
                    <MailQuestion className="h-12 w-12 mb-4 opacity-50" strokeWidth={1} />
                    <p>Nenhuma pergunta encontrada na sua conta.</p>
                </div>
            ) : (
                <>
                    {/* Pending Questions */}
                    {pending.length > 0 && (
                        <div className="space-y-4">
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-warning flex items-center gap-2">
                                Pendentes <span className="flex h-5 w-5 items-center justify-center rounded-full bg-warning/20 text-warning">{pending.length}</span>
                            </h2>
                            {pending.map((q) => (
                                <div key={q.id} className="glass-card relative overflow-hidden border-warning/20 group" data-testid={`question-${q.id}`}>
                                    <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-warning/0 via-warning/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                                    <div className="relative">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                                            <div className="flex items-start gap-4">
                                                <div className="rounded-full bg-warning/10 p-2.5 ring-1 ring-warning/20 shrink-0">
                                                    <MessageCircle className="h-5 w-5 text-warning" />
                                                </div>
                                                <div>
                                                    <p className="text-base font-semibold text-white break-words">{q.text}</p>
                                                    <p className="mt-1 font-mono text-xs text-text-muted tracking-tight">
                                                        <span className="text-text-secondary">{q.buyerNickname || 'Anônimo'}</span> · {new Date(q.createdAt).toLocaleDateString('pt-BR')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-1 shrink-0"><StatusBadge status={q.status} /></div>
                                        </div>

                                        {/* Quick Reply Form */}
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <input
                                                type="text"
                                                value={replyText[q.id] || ''}
                                                onChange={(e) => setReplyText(prev => ({ ...prev, [q.id]: e.target.value }))}
                                                onKeyDown={(e) => e.key === 'Enter' && handleReply(q.id)}
                                                placeholder="Escreva sua resposta (seja educado e direto)..."
                                                className="flex-1 rounded-xl border border-white/[0.08] bg-black/40 px-4 py-3 sm:py-2.5 text-sm text-white placeholder:text-text-muted focus:border-accent/50 focus:bg-black/60 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-colors"
                                            />
                                            <button
                                                onClick={() => handleReply(q.id)}
                                                disabled={!replyText[q.id]?.trim()}
                                                className="flex shrink-0 items-center justify-center rounded-xl bg-accent px-5 py-3 sm:py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover shadow-[0_0_15px_rgba(79,70,229,0.4)] disabled:opacity-50 disabled:pointer-events-none disabled:bg-white/10 disabled:text-text-muted"
                                            >
                                                <Send className="h-4 w-4 sm:mr-2" />
                                                <span className="hidden sm:inline">Enviar</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Answered Questions */}
                    {answered.length > 0 && (
                        <div className="space-y-4 pt-4">
                            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-success flex items-center gap-2">
                                Respondidas <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/20 text-success">{answered.length}</span>
                            </h2>
                            {answered.map((q: any) => (
                                <div key={q.id} className="glass-card opacity-60 hover:opacity-100 transition-opacity duration-300">
                                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="rounded-full bg-success/10 p-2.5 ring-1 ring-success/20 shrink-0">
                                                <CheckCircle2 className="h-5 w-5 text-success" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-text-primary line-through decoration-white/20 break-words">{q.text}</p>
                                                <p className="mt-1 font-mono text-xs text-text-muted tracking-tight">
                                                    <span className="text-text-secondary">{q.buyerNickname || 'Anônimo'}</span> · {new Date(q.createdAt).toLocaleDateString('pt-BR')}  · Repostado: {q.answer || 'Ver no ML'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-1 shrink-0"><StatusBadge status={q.status} /></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
