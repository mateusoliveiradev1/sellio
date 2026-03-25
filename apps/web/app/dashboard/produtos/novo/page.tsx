'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, UploadCloud, Info, CheckCircle2, Box, Tag, DollarSign, LayoutList, Sparkles, Image as ImageIcon, Camera, X } from 'lucide-react'
import Link from 'next/link'
import { trpc } from '../../../../trpc/client'

export default function NewProductPage() {
    const router = useRouter()

    // States
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedPhotos, setSelectedPhotos] = useState<{ name: string, url: string }[]>([])

    // Forms
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        condition: 'new',
        sku: '',
        price: '',
        cost: '',
        stock: ''
    })

    // Dynamic preview handling
    const displayTitle = formData.title || 'Título do seu anúncio'
    const displayPrice = formData.price ? parseFloat(formData.price).toFixed(2) : '0.00'

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files).map(f => ({
                name: f.name,
                url: URL.createObjectURL(f)
            }))
            setSelectedPhotos(prev => [...prev, ...newFiles])
        }
    }

    const handleGenerateSKU = () => {
        const prefix = formData.title
            ? formData.title.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'SEL')
            : 'SEL'
        const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase()
        setFormData(prev => ({ ...prev, sku: `${prefix}-${randomCode}` }))
    }

    // Cleanup Object URLs when component unmounts or photos change
    useEffect(() => {
        return () => {
            selectedPhotos.forEach(photo => URL.revokeObjectURL(photo.url))
        }
    }, [selectedPhotos])

    const handleRemovePhoto = (index: number) => {
        setSelectedPhotos(prev => {
            const newPhotos = [...prev]
            const urlToRevoke = newPhotos[index]?.url
            if (urlToRevoke) URL.revokeObjectURL(urlToRevoke)
            newPhotos.splice(index, 1)
            return newPhotos
        })
    }

    const createProduct = trpc.product.create.useMutation()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            await createProduct.mutateAsync({
                title: formData.title,
                description: formData.description,
                price: parseFloat(formData.price || '0'),
                stock: parseInt(formData.stock || '0', 10),
                sku: formData.sku || undefined,
                images: selectedPhotos.length > 0
                    ? selectedPhotos.map((_, i) => `https://via.placeholder.com/800?text=Foto+${i + 1}`)
                    : []
            })

            setIsSubmitting(false)
            alert('Sucesso! Anúncio processado e sincronizado com o Neon DB.')
            router.push('/dashboard/produtos')
        } catch (error) {
            console.error(error)
            alert('Falha interna ao publicar no servidor Neon: ' + String(error))
            setIsSubmitting(false)
        }
    }

    return (
        <div className="mx-auto max-w-7xl space-y-8 pb-32 animate-fade-in" data-testid="new-product-page">

            {/* ─── HEADER ────────────────────────────────────────────────────────── */}
            <header className="flex flex-col sm:flex-row gap-4 border-b border-white/[0.05] pb-6">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <Link href="/dashboard/produtos" className="group flex-1 sm:flex-none text-center rounded-2xl bg-black/40 px-6 py-3 shadow-inner ring-1 ring-white/[0.05] hover:bg-white/[0.05] hover:ring-white/10 transition-colors text-sm font-semibold text-text-muted hover:text-white">
                        Cancelar
                    </Link>
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">Criar Anúncio</h1>
                        <p className="mt-1 text-sm text-text-secondary">Preencha os dados e publicaremos automaticamente no Mercado Livre.</p>
                    </div>
                </div>
            </header>

            {/* ─── TWO-COLUMN LAYOUT ───────────────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px] items-start">

                {/* LEFT COLUMN: THE FORM */}
                <form id="new-product-form" onSubmit={handleSubmit} className="space-y-8">

                    {/* Section 1: Fotos */}
                    <section className="glass-card relative overflow-hidden p-8 group">
                        <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-info/0 via-info/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none" />
                        <div className="relative">
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-xl bg-info/10 p-2.5 ring-1 ring-info/20">
                                        <Camera className="h-5 w-5 text-info" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">Fotos do Produto</h2>
                                </div>
                                <span className="text-xs font-medium text-text-muted bg-white/5 rounded-lg px-2.5 py-1">Até 10 fotos</span>
                            </div>

                            <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/[0.1] bg-black/20 py-16 transition-colors hover:border-info/40 hover:bg-info/5 cursor-pointer relative overflow-hidden group/upload">
                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                                <UploadCloud className="h-12 w-12 text-text-muted mb-4 group-hover/upload:text-info transition-colors group-hover/upload:scale-110 duration-500" />
                                <p className="text-base font-medium text-white mb-1">Arraste fotos ou clique para buscar</p>
                                <p className="text-sm text-text-muted max-w-sm text-center">Recomendado: 1200x1200px, fundo branco puro. O ML exige clareza na primeira foto.</p>
                            </label>

                            {selectedPhotos.length > 0 && (
                                <div className="mt-6 flex flex-wrap gap-4 rounded-2xl border border-white/[0.05] bg-black/30 p-4">
                                    {selectedPhotos.map((photo, i) => (
                                        <div key={i} className="flex flex-col items-center gap-2">
                                            <div className="h-20 w-20 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative group/img cursor-pointer">
                                                <img src={photo.url} alt={photo.name} className="h-full w-full object-cover transition-transform duration-500 group-hover/img:scale-110" />
                                                <div
                                                    className="absolute inset-0 bg-danger/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]"
                                                    onClick={() => handleRemovePhoto(i)}
                                                >
                                                    <X className="h-6 w-6 text-danger drop-shadow-md" />
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-medium text-text-muted truncate w-20 text-center">{photo.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Section 2: Info Básica */}
                    <section className="glass-card relative overflow-hidden p-8 group">
                        <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-accent/0 via-accent/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none" />
                        <div className="relative space-y-6">
                            <div className="mb-8 flex items-center gap-3">
                                <div className="rounded-xl bg-accent/10 p-2.5 ring-1 ring-accent/20">
                                    <Box className="h-5 w-5 text-accent" />
                                </div>
                                <h2 className="text-xl font-bold text-white tracking-tight">Ficha Técnica</h2>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-secondary">Título do Anúncio</label>
                                    <input
                                        required
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Ex: iPhone 15 Pro Max 256GB Titânio Preto"
                                        className="w-full rounded-xl border border-white/[0.06] bg-black/50 px-4 py-3.5 text-base text-white placeholder:text-text-muted/50 focus:border-accent/40 focus:bg-black/80 focus:outline-none focus:ring-4 focus:ring-accent/10 transition-all"
                                    />
                                    <div className="mt-2 flex items-center justify-between">
                                        <p className="text-[11px] text-accent flex items-center gap-1">
                                            <Sparkles className="h-3 w-3" /> IA otimizará o título na Fase 5
                                        </p>
                                        <p className={`text-[11px] font-mono ${formData.title.length > 60 ? 'text-danger' : 'text-text-muted'}`}>
                                            {formData.title.length}/60
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-secondary">Categoria ML</label>
                                        <div className="relative">
                                            <LayoutList className="absolute left-4 top-4 h-4 w-4 text-text-muted" />
                                            <select
                                                required
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className="w-full appearance-none rounded-xl border border-white/[0.06] bg-black/50 py-3.5 pl-11 pr-4 text-sm text-white focus:border-accent/40 focus:bg-black/80 focus:outline-none focus:ring-4 focus:ring-accent/10 transition-colors"
                                            >
                                                <option value="" disabled>Selecione...</option>
                                                <option value="CELULARES">Celulares e Eletrônicos</option>
                                                <option value="INFORMATICA">Informática</option>
                                                <option value="CASA">Casa, Móveis e MLL</option>
                                                <option value="AUTOMOTIVO">Acessórios Auto</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-secondary">Condição</label>
                                        <div className="flex bg-black/50 rounded-xl p-1.5 border border-white/[0.06]">
                                            <button type="button" onClick={() => setFormData(p => ({ ...p, condition: 'new' }))} className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${formData.condition === 'new' ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10' : 'text-text-muted hover:text-white'}`}>Novo</button>
                                            <button type="button" onClick={() => setFormData(p => ({ ...p, condition: 'used' }))} className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${formData.condition === 'used' ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/10' : 'text-text-muted hover:text-white'}`}>Usado</button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-secondary">Descrição Longa</label>
                                    <textarea
                                        required
                                        name="description"
                                        rows={6}
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Descreva o produto, benefícios, compatibilidade, o que vem na caixa... Não inclua dados de contato."
                                        className="w-full rounded-xl border border-white/[0.06] bg-black/50 px-4 py-3.5 text-sm text-white placeholder:text-text-muted/50 focus:border-accent/40 focus:bg-black/80 focus:outline-none focus:ring-4 focus:ring-accent/10 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Pricing & Stock */}
                    <section className="glass-card relative overflow-hidden p-8 group">
                        <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-success/0 via-success/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100 pointer-events-none" />
                        <div className="relative">
                            <div className="mb-8 flex items-center gap-3">
                                <div className="rounded-xl bg-success/10 p-2.5 ring-1 ring-success/20">
                                    <DollarSign className="h-5 w-5 text-success" />
                                </div>
                                <h2 className="text-xl font-bold text-white tracking-tight">Finanças & Estoque</h2>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-secondary">SKU Interno</label>
                                    <div className="relative flex items-center">
                                        <Tag className="absolute left-4 h-4 w-4 text-text-muted" />
                                        <input
                                            name="sku"
                                            value={formData.sku}
                                            onChange={handleChange}
                                            placeholder="Ex: IPH-15-256"
                                            className="font-mono uppercase w-full rounded-xl border border-white/[0.06] bg-black/50 py-3.5 pl-11 pr-24 text-sm text-white placeholder:text-text-muted/50 focus:border-success/40 focus:bg-black/80 focus:outline-none focus:ring-4 focus:ring-success/10 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleGenerateSKU}
                                            className="absolute right-2 rounded-lg bg-white/5 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-text-secondary hover:bg-white/10 hover:text-white transition-colors"
                                        >
                                            Gerar
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-secondary">Preço Venda (R$)</label>
                                    <input
                                        required
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="font-mono w-full rounded-xl border border-white/[0.06] bg-black/50 px-4 py-3.5 text-base text-white placeholder:text-text-muted/50 focus:border-success/40 focus:bg-black/80 focus:outline-none focus:ring-4 focus:ring-success/10 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-secondary">Estoque</label>
                                    <input
                                        required
                                        name="stock"
                                        type="number"
                                        min="1"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        placeholder="10"
                                        className="font-mono w-full rounded-xl border border-white/[0.06] bg-black/50 px-4 py-3.5 text-base text-white placeholder:text-text-muted/50 focus:border-success/40 focus:bg-black/80 focus:outline-none focus:ring-4 focus:ring-success/10 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </form>

                {/* RIGHT COLUMN: PREVIEW & TIPS */}
                <aside className="sticky top-8 space-y-6">

                    {/* Live Preview Card */}
                    <div className="rounded-3xl border border-white/[0.08] bg-[#0A0A0A] p-6 shadow-2xl">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-text-secondary mb-4 flex items-center gap-2">
                            Preview do ML <Sparkles className="h-3 w-3 text-warning" />
                        </h3>

                        <div className="rounded-2xl border border-white/[0.04] bg-white/[0.02] p-4 flex flex-col items-center">
                            <div className="h-32 w-32 rounded-xl bg-white/[0.05] mb-4 flex items-center justify-center overflow-hidden border border-white/5 relative">
                                {selectedPhotos.length > 0 ? (
                                    <img src={selectedPhotos[0]?.url} alt="Capa" className="h-full w-full object-cover" />
                                ) : (
                                    <span className="text-xs text-text-muted font-medium">Sem foto</span>
                                )}
                            </div>
                            <p className="text-sm font-medium text-white text-center line-clamp-2 leading-tight">
                                {displayTitle}
                            </p>
                            <p className="font-mono text-xl font-bold text-white mt-3 drop-shadow-md">
                                R$ {displayPrice}
                            </p>
                            <div className="mt-3 w-full rounded-lg bg-[#2968C8] py-2 text-center text-[11px] font-bold text-white uppercase tracking-wider cursor-not-allowed opacity-80">
                                Comprar Agora
                            </div>
                        </div>
                    </div>

                    {/* Sellio AI Tips */}
                    <div className="rounded-3xl border border-accent/20 bg-accent/5 p-6 backdrop-blur-sm">
                        <h3 className="text-sm font-bold text-accent mb-3 flex items-center gap-2">
                            <Sparkles className="h-4 w-4" /> Dicas da IA
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-sm text-text-secondary">
                                <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                                <span>O Mercado Livre penaliza anúncios com contatos na descrição.</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm text-text-secondary">
                                <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                                <span>O título possui limite de 60 chars. Evite adjetivos como "Lindo" ou "Melhor".</span>
                            </li>
                        </ul>
                    </div>
                </aside>

            </div>

            {/* ─── STICKY FOOTER ACTION BAR ────────────────────────────────────── */}
            <div className="fixed bottom-0 left-64 right-0 p-6 bg-gradient-to-t from-black via-[#000000]/90 to-transparent pointer-events-none z-50">
                <div className="mx-auto max-w-7xl flex items-center justify-between pointer-events-auto rounded-3xl border border-white/[0.08] bg-[#0A0A0A]/80 p-4 backdrop-blur-xl shadow-2xl">
                    <div className="flex items-center gap-3 px-2">
                        <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                        <p className="text-sm font-medium text-text-muted">Pronto para sincronizar via API</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/dashboard/produtos" className="rounded-xl px-6 py-3 text-sm font-bold text-text-muted hover:text-white transition-colors">
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting || selectedPhotos.length === 0 || !formData.title || !formData.price || !formData.category}
                            className="flex items-center justify-center gap-2 rounded-xl bg-accent px-8 py-3 text-sm font-bold text-white transition-colors hover:bg-accent-hover disabled:opacity-70 disabled:pointer-events-none shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                        >
                            {isSubmitting ? 'Validando...' : 'Publicar Anúncio MLL'}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}
