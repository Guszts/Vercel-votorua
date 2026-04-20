# Vitória — PRD

## Problem statement
App completo do **Restaurante e Marmitaria Vitória** (Campo Novo do Parecis/MT) com:
- Auth exclusivamente via Emergent Managed Google Auth
- 2 admins hardcoded (`gustavomonteiro09g@gmail.com` + `gustavomonte10g@gmail.com`)
- Catálogo profissional (20+ produtos com ingredientes, descrições longas, badges)
- Admin panel (produtos, imagens, usuários, depoimentos, pedidos, métricas, ajustes)
- Perfil (avatar, apelido, loyalty Bronze/Prata/Ouro)
- Carrinho + histórico de pedidos
- Depoimentos (estrelas + comentário opcional + resposta admin)
- Templates de email profissionais (welcome, order confirmation, order status, testimonial reply)
- PWA instalável
- Deploy Vercel (frontend) + FastAPI backend separado

## Stack
- **Frontend:** Vite + React 19 + TS + Tailwind 4 + Motion (framer-motion)
- **Backend:** FastAPI — **gatekeeper** de todas as escritas (service role → Supabase)
- **Data:** Supabase Postgres + Storage (3 buckets públicos)
- **Auth:** Emergent Managed Google Auth, sessão 7d em `public.user_sessions` + cookie httpOnly
- **AI:** Emergent LLM Key (GPT-4o-mini) para descrições, badges e respostas de depoimento
- **Emails:** SMTP opcional, templates HTML em `/app/emails/`

## Arquitetura resumida
```
Frontend (read-only direto no Supabase com anon key)
   │  → reads: produtos, ingredientes, settings, depoimentos, profiles, site_images
   │
   ├─── Emergent Auth (redirect) ──→ /#session_id=...
   │                                    │
   └─── POST /api/auth/session ─────────┘
            ↓
   Backend FastAPI (Service Role)
      - Cria/atualiza profile
      - Emite cookie session_token
      - Proxy de TODAS as escritas (orders, testimonials, products, settings, users)
      - AI helpers (Emergent LLM)
      - Envio de emails (SMTP opcional)
            ↓
   Supabase Postgres + Storage
```

## Status (20/04/2026)
### ✅ Concluído
- Auth migrada para Emergent Google Auth (email/senha e OAuth próprio Supabase removidos)
- 2 admins hardcoded + allowlist no backend
- Backend reescrito: 30+ endpoints REST, gatekeeper completo
- Schema Supabase refeito: sem FK a `auth.users`, 20+ produtos seedados com ingredientes
- Frontend: AuthContext, AuthModal e AuthCallback Emergent; api.ts centraliza chamadas
- Admin panel: nova aba **Pedidos** (muda status + dispara email)
- Respostas de depoimento agora aparecem no card público + disparam email ao cliente
- 4 templates de email HTML profissionais (`/app/emails/`)
- Build de produção validado (`yarn build` 6.5s)
- Vercel configurada (vercel.json + .vercelignore)

### ⏳ Pendências do usuário (para ir ao ar)
1. **Aplicar `/app/supabase_schema.sql`** no Supabase SQL Editor (reset do schema)
2. **Preencher `SUPABASE_SERVICE_ROLE_KEY`** em `/app/backend/.env` e `supervisorctl restart backend`
3. (Opcional) Preencher SMTP para emails reais — sem isso, emails ficam em DRY-RUN

## Backlog
- [P1] Realtime subscriptions para atualizar pedidos ao vivo
- [P1] Push notifications PWA (mudança de status)
- [P2] Checkout com Pix/Stripe/Mercado Pago
- [P2] Cupons, campanhas e banner promocional por período
- [P3] Exportar métricas CSV/PDF
- [P3] Integração WhatsApp (envio automático de confirmação)

## Arquivos-chave
- Backend: `/app/backend/server.py`, `/app/backend/.env`, `/app/backend/requirements.txt`
- Frontend: `/app/frontend/src/context/AuthContext.tsx`, `/app/frontend/src/lib/api.ts`, `/app/frontend/src/pages/admin/AdminPanel.tsx`
- Schema: `/app/supabase_schema.sql` (reaplicar no Supabase)
- Emails: `/app/emails/{welcome,order_confirmation,order_status_update,testimonial_reply}.html`
- Docs: `/app/SETUP.md`, `/app/DEPLOY.md`, `/app/auth_testing.md`
