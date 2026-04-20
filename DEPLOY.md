# Vitória — Deploy Vercel (modo multi-serviço experimental)

## 📁 Arquivos de configuração

### `/app/vercel.json` (raiz — **este é o importante**)
```json
{
  "experimentalServices": {
    "frontend": {
      "entrypoint": "frontend",
      "routePrefix": "/",
      "framework": "vite"
    },
    "backend": {
      "entrypoint": "backend",
      "routePrefix": "/_/backend"
    }
  }
}
```

Com isso:
- **Frontend** (Vite/React) é servido em `https://SEU-APP.vercel.app/`
- **Backend** (FastAPI) é servido em `https://SEU-APP.vercel.app/_/backend/api/...`
- Mesma origem → **não precisa** configurar CORS no backend
- **Não precisa** de `VITE_BACKEND_URL` no Vercel — o frontend detecta o caminho `/_/backend` automaticamente em produção

### `/app/frontend/vercel.json`
Configurações específicas do Vite (rewrites SPA, headers de cache, manifest PWA). Atualizado para ignorar `/_/` (backend) nos rewrites.

### `/app/backend/vercel.json`
```json
{
  "builds": [{ "src": "server.py", "use": "@vercel/python" }],
  "routes": [{ "src": "/(.*)", "dest": "server.py" }]
}
```
Faz a Vercel usar o runtime Python com `server.py` como ponto de entrada (FastAPI app).

---

## 🌱 Variáveis de ambiente

### Frontend (Vercel → Settings → Environment Variables)
Marque as 3 caixas **Production / Preview / Development** para cada uma:

| Nome | Valor |
|---|---|
| `VITE_SUPABASE_URL` | `https://uuovdyvfoufjmlnmhzse.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOi...x9w0` (copie de `/app/frontend/.env`) |
| `VITE_ADMIN_EMAIL` | `gustavomonteiro09g@gmail.com` |

> **Não adicione `VITE_BACKEND_URL`**. Sem essa variável o frontend usa `/_/backend` automaticamente (caminho relativo, mesma origem).
>
> Se for rodar o backend separado (Railway/Render), aí sim: `VITE_BACKEND_URL=https://sua-api.railway.app`.

### Backend (Vercel → Settings → Environment Variables)
Como os dois serviços dividem as env vars do projeto, coloque todas juntas:

| Nome | Valor |
|---|---|
| `EMERGENT_LLM_KEY` | `sk-emergent-7Ea75A099F5FfEc8fE` |
| `SUPABASE_URL` | `https://uuovdyvfoufjmlnmhzse.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJhbGci...x9w0` (mesma do frontend) |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...9eMo` (**SECRET**, só em Production/Preview) |
| `CORS_ORIGINS` | `*` (mesma origem, não é crítico) |

**Opcionais** (emails SMTP reais):
| Nome | Valor |
|---|---|
| `SMTP_HOST` | ex: `smtp.resend.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | usuário/API key |
| `SMTP_PASS` | senha/API secret |
| `SMTP_FROM` | `Vitória <no-reply@seu-dominio.com>` |

---

## 🚀 Como importar na Vercel

1. Acesse https://vercel.com/new
2. Conecte seu GitHub (use **Save to GitHub** no chat do Emergent antes)
3. Selecione o repo
4. **Root Directory:** `./` (raiz — NÃO aponte para `frontend`, porque o `vercel.json` da raiz controla tudo)
5. Aba **Environment Variables**: cole todas as variáveis acima
6. Clique **Deploy**. Vercel detecta `experimentalServices` e sobe 2 serviços em ~1 min.

---

## ✅ Validação pós-deploy

```bash
# 1. Frontend
curl https://SEU-APP.vercel.app/
# deve retornar HTML do Vite

# 2. Backend
curl https://SEU-APP.vercel.app/_/backend/api/health
# deve retornar {"status":"ok","supabase_configured":true,"auth_methods":["google_emergent","email_supabase"]}

# 3. Produtos do Supabase via frontend
curl "https://uuovdyvfoufjmlnmhzse.supabase.co/rest/v1/products?select=id,name&limit=3" \
  -H "apikey: <VITE_SUPABASE_ANON_KEY>"
```

---

## 🧭 Domínio próprio

1. Vercel → Project → **Settings → Domains → Add**
2. Digite `vitoriamarmitaria.com.br`
3. DNS no seu provedor:
   - Apex (`vitoria...br`): **A** `76.76.21.21`
   - `www`: **CNAME** `cname.vercel-dns.com`
4. SSL automático após propagação

## 🔐 Supabase URL Configuration (pós-deploy)
**Authentication → URL Configuration → Redirect URLs** — adicione:
```
https://SEU-APP.vercel.app/**
https://SEU-DOMINIO.com.br/**
https://www.SEU-DOMINIO.com.br/**
http://localhost:3000/**
```

---

## 🗂️ Estrutura final
```
/app
├── vercel.json                  ← experimentalServices (raiz)
├── frontend/
│   ├── vercel.json              ← Vite SPA config
│   ├── package.json
│   └── src/...
└── backend/
    ├── vercel.json              ← @vercel/python runtime
    ├── requirements.txt
    └── server.py                ← FastAPI app
```
