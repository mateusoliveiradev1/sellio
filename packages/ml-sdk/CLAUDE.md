# @sellio/ml-sdk — Client Mercado Livre API

## Arquitetura
Client per-seller: recebe `sellerId` → busca tokens no DB → faz request.

## Auto-refresh
Interceptor detecta 401 → chama `/oauth/token` com refresh_token → retry original.

## Rate limiting
Queue por seller, max 1 request/segundo. Exponential backoff em 429.

## Base URL
`https://api.mercadolibre.com`

## Endpoints principais
- `POST /items` — criar anúncio
- `PUT /items/{id}` — atualizar preço/estoque
- `GET /orders/{id}` — detalhes pedido
- `POST /answers` — responder pergunta
- `GET /shipment_labels` — etiqueta envio

## Testes
MSW (Mock Service Worker) para todos os endpoints. Nunca chamar API real em testes.
