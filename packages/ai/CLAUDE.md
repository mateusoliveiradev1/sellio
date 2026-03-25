# @sellio/ai — Inteligência Artificial

## Provider
Google Gemini 2.5 Flash (free tier: 100 RPD, 1M context).

## Funções
- `enrichTitle(rawTitle)` → título otimizado p/ busca ML
- `enrichDescription(product)` → HTML vendedora
- `suggestCategory(title, desc)` → top 3 categorias ML
- `autoAnswer(question, productData)` → resposta contextual
- `pricingAdvisor(product, competitors)` → sugestão preço

## Regras
- Prompts em português BR, guardados como constantes (não inline)
- Cache respostas por 24h (mesmo input = mesmo output)
- Fallback: se Gemini falhar → retorna dados originais sem enriquecer
- NUNCA bloquear publicação por erro de IA
