# Sistema de Gestão de Microsserviços (E-commerce)

Projeto scaffold focado em arquitetura de microserviços demonstrando:
- APIs REST (Fastify + TypeScript)
- Bancos SQL (Postgres) e NoSQL (Redis)
- Mensageria (RabbitMQ)
- Contêineres (Docker + docker-compose)

Serviços:
- `catalog` - catálogo de produtos (Postgres)
- `cart` - carrinho do usuário (Redis)
- `payment` - processamento de pagamento (Postgres)

Como rodar (desenvolvimento):

1. Copie arquivos `.env` a partir de `.env.example` em cada serviço e ajuste se necessário.
2. No root: `docker-compose up --build`
3. Acesse os serviços:
   - Catalog: `http://localhost:3001`
   - Cart: `http://localhost:3002`
   - Payment: `http://localhost:3003`

Testes rápidos (ex.):

- Criar produto:
  curl -X POST http://localhost:3001/products -H "Content-Type: application/json" -d '{"name":"Livro A","price":29.9,"stock":10}'

- Adicionar ao carrinho:
  curl -X POST http://localhost:3002/cart/user123/items -H "Content-Type: application/json" -d '{"productId":1,"qty":2}'

- Criar pagamento (fluxo demo):
  curl -X POST http://localhost:3003/payments -H "Content-Type: application/json" -d '{"orderId":"order-1","amount":59.8,"userId":"user123"}'

Docs e futuras melhorias:
- Adicionar OpenAPI (Swagger)
- Migrations automáticas e scripts de seed
- Tests de integração usando docker-compose
