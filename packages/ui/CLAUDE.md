# @sellio/ui — Design System Components

## Base
shadcn/ui + Tailwind v4, customizado com tokens Sellio.

## Paleta (OBRIGATÓRIO usar tokens)
```css
--bg-deep: #06090F       --accent: #3A82FF
--bg-primary: #0C1120    --success: #22C55E
--bg-elevated: #131B2E   --warning: #F59E0B
--bg-surface: #1A2340    --danger: #EF4444
--text-primary: #F1F5F9  --text-secondary: #94A3B8
```
NUNCA hardcodar cores. NUNCA usar classes genéricas do Tailwind para cores de marca.

## Fonts
- Text: Inter (400, 600, 700, 800)
- Dados/Números: JetBrains Mono (500)

## Componentes exportados
KpiCard, GlassCard, Sidebar, DataTable, StatusBadge,
ChartCard, ProductForm, OrderTimeline, QuestionCard

## Acessibilidade
WCAG 2.1 AA. Contraste 4.5:1. Focus ring visível. Framer Motion 200-300ms ease-out.
