# Vitória — PRD

## Original problem statement (summarized)
Atualizar o app do **Restaurante e Marmitaria Vitória** (sem mudar design/tipografias existentes) com:
- Bottom nav: Início | Histórico | Depoimentos | Perfil
- Login/cadastro (Supabase) + Google OAuth; admin `gustavomonteiro09g@gmail.com`
- Painel admin completo (produtos, uploads de imagens, badges, ingredientes, estoque, métricas, usuários, ajustes)
- Página de detalhe do produto com customização de ingredientes
- Programa fidelidade, filtros em produtos/depoimentos
- PWA com nome "Vitória" (favicon/OG/ícone a partir da logo enviada — **nunca dentro do app**)
- Tipografia Outfit (Google Fonts), ícones arredondados/animados
- Animações profissionais, scroll-to-hero ao navegar
- Localização, horários, entrega, retirada, métodos de pagamento configuráveis
- Depoimentos: cards com estrelas/autor/avatar → página detalhada; permite só estrelas sem comentário

## Tech stack
- Frontend: Vite + React 19 + TypeScript, TailwindCSS 4, Motion (framer-motion API)
- Backend: FastAPI em `/app/backend` (apenas endpoints de IA — `/api/ai/describe`, `/api/ai/badge`, `/api/ai/reply-testimonial` via Emergent LLM Key) + `/api/health`
- Dados / Auth / Storage: **Supabase** (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- PWA: manifest + service worker simples (cache shell)

## Arquitetura de pastas
```
/app
├── backend/                  FastAPI (IA helpers + health)
├── frontend/
│   ├── public/logo.png       Favicon/OG/PWA
│   ├── public/manifest.webmanifest
│   ├── public/sw.js
│   └── src/
│       ├── App.tsx           Router + AppShell (BottomNav)
│       ├── context/
│       │   ├── AppContext.tsx   Produtos, carrinho, settings, depoimentos, pedidos
│       │   └── AuthContext.tsx  Supabase auth + profile
│       ├── components/
│       │   ├── layout/       BottomNav, TopBar, ScrollToHero
│       │   ├── auth/         AuthModal (email/senha + Google)
│       │   └── feature/      CartDrawer, OrderModal
│       └── pages/
│           ├── home/         Hero + Categories + FeaturedMenu (filtros) + …
│           ├── product/      ProductDetail (ingredientes customizáveis + estoque)
│           ├── historico/    Carrinho + Pedidos
│           ├── depoimentos/  Lista + filtros + compositor + detalhe
│           ├── perfil/       Avatar upload + apelido/@ + loyalty + settings preview
│           └── admin/        Painel completo
└── supabase_schema.sql       Schema + RLS + triggers + buckets (aplicar no Supabase)
```

## Status de implementação (19/04/2026)
### Concluído ✅
- Infraestrutura (frontend em `/app/frontend`, backend FastAPI mínimo, env vars)
- Tipografia Outfit + design arredondado preservando paleta vermelho/stone existente
- PWA "Vitória" — manifest, service worker, ícones via `/logo.png`; logo NUNCA dentro do app
- Bottom navigation animada com 4 abas + badge de carrinho
- Tela de autenticação (email/senha + botão Google) via Supabase
- Home: hero existente + filtros de categoria + busca + ordenação
- Cards de produto com botões "Detalhes" + "Adicionar" lado a lado
- Página detalhada de produto com customização de ingredientes (cobra preço extra, respeita estoque)
- Histórico com abas Carrinho/Pedidos (cria pedido no Supabase)
- Depoimentos: listagem, filtros por estrelas, busca, compositor (estrelas obrigatórias, texto opcional), página detalhada
- Perfil: upload avatar (Supabase Storage), edição apelido/@username, programa fidelidade (níveis Bronze/Prata/Ouro), atalhos para admin/logout, preview das configurações do estabelecimento
- Admin Panel reformulado:
  - Produtos (CRUD + upload imagem Supabase + badge + cor do badge + estoque + IA de descrição/badge via backend)
  - Imagens do site (upload para bucket `site-images`)
  - Usuários (promover/rebaixar admin)
  - Métricas (totais de usuários, pedidos, receita, depoimentos, avaliação média)
  - Ajustes (localização, horários, tempo entrega/retirada, métodos de pagamento)
  - Ingredientes por produto (adicionar/remover/default/preço/estoque)
- ScrollToHero: cada troca de rota leva ao topo da página
- Animações Motion em entradas, listas, modais e bottom nav
- Endpoints backend: `/api/health`, `/api/ai/describe`, `/api/ai/badge`, `/api/ai/reply-testimonial` (Emergent LLM Key já configurada)

### Pré-requisitos do usuário (obrigatório para o app funcionar 100%)
1. **Aplicar o schema SQL**: abra Supabase > SQL Editor > cole `/app/supabase_schema.sql` > Run. Isto cria tabelas, RLS, triggers, buckets e seed de produtos.
2. **(Opcional) Google OAuth**: Supabase > Authentication > Providers > Google > habilitar com seu Client ID/Secret do Google Cloud. Enquanto não habilitar, o botão Google mostra mensagem explicando.
3. **Criar o admin**: cadastre-se na tela de login com `gustavomonteiro09g@gmail.com` (a trigger promove automaticamente).

## Backlog / Próximas evoluções
- [P1] Realtime subscriptions para atualizar pedidos e depoimentos ao vivo
- [P1] Push notifications PWA quando status do pedido muda
- [P2] Checkout com integração de pagamento (Pix QR + Stripe/Mercado Pago)
- [P2] Sistema de cupons e campanhas no admin
- [P2] Upload múltiplo de imagens por produto (galeria)
- [P3] Exportar relatório de métricas (CSV/PDF)
