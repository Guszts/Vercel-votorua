# Vitória — Deploy Vercel + Credenciais

## Arquitetura de deploy
- **Frontend (Vite/React)** → Vercel
- **Backend (FastAPI)** → Railway / Render / Fly.io (Vercel não roda FastAPI de forma adequada)
- **Supabase** → já está em produção

---

## 1) Frontend na Vercel

### Build settings (tela de importação do projeto)
| Campo | Valor |
|---|---|
| **Framework Preset** | `Vite` (detectado automaticamente) |
| **Root Directory** | `frontend` |
| **Build Command** | `yarn build` |
| **Output Directory** | `dist` |
| **Install Command** | `yarn install --frozen-lockfile` |
| **Node.js Version** | `20.x` |

Os arquivos `/app/vercel.json` (raiz) e `/app/frontend/vercel.json` já configuram isso automaticamente — Vercel vai respeitá-los.

### Variáveis de ambiente do frontend
Adicione em **Settings → Environment Variables** para Production, Preview e Development:

| Nome | Valor | Obs |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://uuovdyvfoufjmlnmhzse.supabase.co` | URL do seu projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | (copie de `/app/frontend/.env`) | chave pública `anon` — pode ir em client |
| `VITE_BACKEND_URL` | `https://sua-api-vitoria.up.railway.app` | URL do backend FastAPI em produção (ver seção 2) |
| `VITE_ADMIN_EMAIL` | `gustavomonteiro09g@gmail.com` | opcional, usado só como fallback |

> Não precisa de nenhuma variável de Google OAuth aqui. A auth via Google usa **Emergent** (URL hardcoded) e a auth via email usa o SDK Supabase (que lê VITE_SUPABASE_URL/ANON).

---

## 2) Backend na Railway (recomendado) / Render / Fly

### Variáveis de ambiente do backend

| Nome | Obrigatório? | Valor / Onde pegar |
|---|---|---|
| `SUPABASE_URL` | ✅ | `https://uuovdyvfoufjmlnmhzse.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase → Settings → API → `service_role` (JWT longo, SECRET) |
| `SUPABASE_ANON_KEY` | ✅ (para login email) | Supabase → Settings → API → `anon` / `public` |
| `EMERGENT_LLM_KEY` | ✅ | `sk-emergent-7Ea75A099F5FfEc8fE` (já disponível) |
| `CORS_ORIGINS` | ✅ | `https://SEU-DOMINIO.com,https://SEU-PROJETO.vercel.app` (vírgula separa; use `*` só em testes) |
| `MONGO_URL` | opcional | não usado atualmente (legado) |
| `DB_NAME` | opcional | idem |
| `SMTP_HOST` | opcional | `smtp.resend.com` / `smtp.sendgrid.net` / `smtp.gmail.com` |
| `SMTP_PORT` | opcional | `587` (TLS) |
| `SMTP_USER` | opcional | usuário SMTP |
| `SMTP_PASS` | opcional | senha/API key SMTP |
| `SMTP_FROM` | opcional | `Vitória <no-reply@seu-dominio.com>` |

### Build / Start Commands (Railway)
- **Install:** `pip install -r backend/requirements.txt`
- **Start:** `uvicorn backend.server:app --host 0.0.0.0 --port ${PORT:-8001}`
- **Root Directory (Railway):** raiz do repositório (`/`) — **não** `backend`, porque `emails/` fica na raiz

---

## 3) Passos de configuração obrigatórios após o deploy

### Supabase
1. **SQL Editor** → rodar `/app/supabase_schema.sql`
2. **Authentication → Providers → Email** → **Enable** (normalmente já vem ligado)
3. **Authentication → URL Configuration** → adicionar em **Redirect URLs**:
   ```
   https://SEU-DOMINIO.com/**
   https://SEU-PROJETO.vercel.app/**
   http://localhost:3000/**
   ```
4. **Authentication → Email Templates** (opcional): customize o template de confirmação para combinar com a marca. Os templates HTML em `/app/emails/` são usados apenas pelos emails do **backend** (order confirmation etc), não pelos emails do Supabase Auth (confirmação, reset de senha).

### Google (Emergent)
Nada a configurar. Emergent gerencia todo o OAuth.

### Admin
- `gustavomonteiro09g@gmail.com` e `gustavomonte10g@gmail.com` são **sempre** admin pela allowlist no backend, independentemente de terem entrado via email ou Google.
- Se um desses emails se cadastrar via email/senha no Supabase, pode ser necessário clicar no link de confirmação enviado por email (a menos que você desative "Confirm email" em Supabase → Authentication → Providers → Email).

---

## 4) Fluxo de auth unificado (dual method)

```
Usuário clica "Entrar"
├── "Continuar com Google"
│    → redirect para https://auth.emergentagent.com
│    → volta com #session_id=...
│    → backend troca por cookie session_token (7d)
│
└── Email + senha
     → Supabase SDK faz login
     → JWT fica em localStorage do browser
     → api.ts adiciona "Authorization: Bearer <jwt>" em toda requisição
     → backend valida chamando Supabase /auth/v1/user

Backend current_user():
1° tenta cookie session_token (Emergent)
2° tenta Authorization Bearer (Supabase JWT)
→ em qualquer caso, upsert profile by email
→ admin allowlist vale pros 2 caminhos
```

---

## 5) Checklist final

- [ ] Schema `/app/supabase_schema.sql` aplicado no Supabase
- [ ] Backend publicado (Railway/Render) com as 5 env vars obrigatórias
- [ ] Frontend publicado na Vercel com 3 env vars (URL, ANON, BACKEND)
- [ ] `VITE_BACKEND_URL` aponta para a URL pública do backend
- [ ] `CORS_ORIGINS` do backend inclui o domínio do frontend
- [ ] Supabase → URL Configuration com domínio Vercel + domínio próprio
- [ ] Testado: login via Google funciona
- [ ] Testado: cadastro via email/senha funciona (ver email de confirmação se ativado)
- [ ] Testado: admin login → botão "Painel Admin" aparece
