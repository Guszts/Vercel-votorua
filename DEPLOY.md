# Vitória — Deploy na Vercel + Google OAuth

Guia passo a passo completo para colocar o app no ar na Vercel com seu próprio domínio e habilitar login com Google.

---

## 1) Admin já configurado

O email `gustavomonteiro09g@gmail.com` é promovido automaticamente a administrador pelo trigger `handle_new_user()` do Supabase (veja `supabase_schema.sql`). Basta o usuário se cadastrar pela primeira vez e ele já aparece como **admin** no app.

No painel `/ajustes` existe a aba **Depoimentos**, onde o admin pode:
- Listar todos os depoimentos (com filtro por estrelas)
- Excluir qualquer depoimento
- Responder (manualmente ou gerar resposta com IA)
- Copiar a resposta para colar no WhatsApp/Instagram

---

## 2) Passo a passo — Credenciais Google OAuth

> Você precisa de 2 coisas: **Client ID** e **Client Secret**, ambos criados no Google Cloud Console e colados no Supabase.

### 2.1. Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Crie (ou selecione) um **Project**. Ex.: `Vitoria Marmitaria`.
3. Menu lateral → **APIs & Services → OAuth consent screen**
   - User type: **External**
   - Preencha: nome do app (`Vitória`), email de suporte, logo (sua logo), email do desenvolvedor
   - Scopes: deixe os padrão (`email`, `profile`, `openid`)
   - Test users: adicione seu email enquanto o app estiver em modo de teste
   - Publish app (quando quiser deixar público)

4. Menu lateral → **APIs & Services → Credentials → + Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Name: `Vitoria Web`

5. **Authorized JavaScript origins** (origens JS autorizadas) — adicione **TODAS** que você for usar:
   ```
   http://localhost:3000
   http://localhost:5173
   https://uuovdyvfoufjmlnmhzse.supabase.co
   https://SEU-PROJETO.vercel.app
   https://SEU-DOMINIO-PROPRIO.com
   https://www.SEU-DOMINIO-PROPRIO.com
   ```
   > **Dica:** coloque `http://localhost:3000` para testar localmente, a URL do Supabase, a URL de preview da Vercel (`*.vercel.app`) e o seu domínio próprio (com e sem `www`). Se ainda não lembrou do domínio, pode adicionar depois sem problema — basta editar as credenciais.

6. **Authorized redirect URIs** (URIs de redirecionamento autorizadas):
   ```
   https://uuovdyvfoufjmlnmhzse.supabase.co/auth/v1/callback
   ```
   > **Somente essa URL é necessária aqui**, pois o Supabase é quem recebe o callback do Google e depois devolve ao seu domínio. Você **NÃO** precisa adicionar seu domínio próprio como redirect URI — o Supabase cuida disso.

7. Clique em **Create**. Copie o **Client ID** e o **Client Secret** que aparecem.

### 2.2. Supabase Authentication → Providers → Google

1. Abra o Supabase Studio do seu projeto.
2. Menu lateral → **Authentication → Providers → Google** → **Enable**.
3. Cole o **Client ID** e **Client Secret**.
4. **Authorized Client IDs**: cole o mesmo Client ID novamente.
5. Salve.

### 2.3. URLs adicionais no Supabase

1. **Authentication → URL Configuration**:
   - **Site URL:** `https://SEU-DOMINIO-PROPRIO.com` (ou sua URL principal em produção)
   - **Redirect URLs (whitelist):** adicione cada URL permitida, uma por linha:
     ```
     http://localhost:3000/**
     https://SEU-PROJETO.vercel.app/**
     https://SEU-DOMINIO-PROPRIO.com/**
     https://www.SEU-DOMINIO-PROPRIO.com/**
     ```

> Sem isso o Supabase bloqueia o retorno do Google com erro `redirect_url not allowed`.

### 2.4. Testar

Abra o app → **Perfil → Entrar ou cadastrar → Continuar com Google**. Deve abrir o popup da Google, pedir consentimento e retornar logado.

---

## 3) Deploy na Vercel

### 3.1. Estrutura

O app frontend fica em `/app/frontend`. O backend FastAPI (apenas os endpoints de IA) vive em `/app/backend` — ele pode continuar rodando no Emergent OU você o hospeda em outro lugar (Railway, Fly.io, Render). A Vercel só fará deploy do **frontend**.

Arquivos já prontos no repositório:
- `/app/vercel.json` — raiz, aponta `rootDirectory: frontend` (caso você conecte o repo inteiro)
- `/app/frontend/vercel.json` — config da SPA (rewrites, cache dos assets, service worker)
- `/app/frontend/.vercelignore`

### 3.2. Importar o projeto

1. Acesse https://vercel.com/new
2. Conecte seu GitHub (use o botão **Save to GitHub** no chat do Emergent primeiro).
3. Selecione o repositório.
4. Na tela de configuração do projeto:

   | Campo | Valor |
   |---|---|
   | **Framework Preset** | `Vite` (detecta automaticamente) |
   | **Root Directory** | `frontend` |
   | **Build Command** | `yarn build` |
   | **Output Directory** | `dist` |
   | **Install Command** | `yarn install --frozen-lockfile` |
   | **Node.js Version** | `20.x` (default) |

### 3.3. Environment Variables (obrigatórias)

Na aba **Environment Variables** da Vercel, adicione para **Production**, **Preview** e **Development**:

```
VITE_SUPABASE_URL=https://uuovdyvfoufjmlnmhzse.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1b3ZkeXZmb3Vmam1sbm1oenNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY0NDI4NTYsImV4cCI6MjA5MjAxODg1Nn0.zxKGR3qgeLy719zO8f4MQb13dyNG9e-KU2PAPS-x9w0
VITE_ADMIN_EMAIL=gustavomonteiro09g@gmail.com
VITE_BACKEND_URL=https://SEU-BACKEND-EM-PRODUCAO.com
```

> **Observação sobre `VITE_BACKEND_URL`:** é a URL do FastAPI (endpoints `/api/ai/describe`, `/api/ai/badge`, `/api/ai/reply-testimonial`). Enquanto você não publicar o backend em produção pode deixar apontando para a URL pública do Emergent (é só não desligar o preview). Se quiser que as funções de IA parem de funcionar silenciosamente, deixe em branco.

### 3.4. Deploy

Clique em **Deploy**. Em ~1 minuto estará no ar em `https://SEU-PROJETO.vercel.app`.

### 3.5. Domínio próprio

1. Vercel → Project → **Settings → Domains** → **Add**.
2. Digite seu domínio (ex.: `vitoriamarmitaria.com.br`).
3. A Vercel mostra os registros DNS que você precisa configurar no seu provedor (Registro.br, GoDaddy, Cloudflare, etc.):
   - Apex (`vitoriamarmitaria.com.br`): **A** para `76.76.21.21`
   - Subdomínio `www`: **CNAME** para `cname.vercel-dns.com`
4. Após DNS propagar (minutos a algumas horas) o SSL é emitido automaticamente.

> **Importante:** depois que o domínio estiver no ar, volte ao Google Cloud Console e ao Supabase e inclua esse domínio nas listas de origens/redirects (passos 2.1.5 e 2.3) — senão o login Google não vai funcionar nele.

---

## 4) Checklist final

- [ ] Schema aplicado no Supabase (`supabase_schema.sql`)
- [ ] Admin `gustavomonteiro09g@gmail.com` cadastrado e promovido
- [ ] Google Cloud OAuth criado (Client ID + Secret)
- [ ] Origens JS e Redirect URI configurados no Google Cloud
- [ ] Provider Google habilitado no Supabase com Client ID/Secret
- [ ] URL Configuration do Supabase com Site URL + Redirect URLs
- [ ] Projeto importado na Vercel com **Root Directory = frontend**
- [ ] Variáveis de ambiente `VITE_*` adicionadas em Production/Preview
- [ ] Domínio próprio adicionado e DNS propagado
- [ ] Domínio próprio incluído nas listas do Google e do Supabase
