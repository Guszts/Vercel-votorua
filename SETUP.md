# Vitória — Setup guide (Emergent Auth edition)

## 1. Aplicar o schema no Supabase
1. Supabase Studio → SQL Editor → New query
2. Cole TODO o conteúdo de `/app/supabase_schema.sql` e rode
3. Isso cria tabelas (sem mais depender de `auth.users`), semeia 20+ produtos e promove os dois admins.

## 2. Preencher o Service Role Key no backend
1. Supabase → Settings → API → **`service_role`** → copie o JWT
2. Abra `/app/backend/.env` e preencha:
   ```
   SUPABASE_SERVICE_ROLE_KEY=<cole-aqui>
   ```
3. Reinicie: `sudo supervisorctl restart backend`
4. Teste: `curl $BACKEND_URL/api/health` deve retornar `"supabase_configured": true`

## 3. Login Google
- **NÃO precisa** criar credenciais no Google Cloud, NEM configurar OAuth no Supabase.  
  Auth é 100% gerenciado pelo Emergent.
- Perfil → **Continuar com Google** → pronto.

## 4. SMTP para emails (opcional)
Para disparar emails reais (welcome / order_confirmation / order_status_update / testimonial_reply), preencha em `/app/backend/.env`:
```
SMTP_HOST=smtp.seu-provedor.com
SMTP_PORT=587
SMTP_USER=usuario
SMTP_PASS=senha
SMTP_FROM=Vitória <no-reply@seu-dominio.com>
```
Providers sugeridos: SendGrid, Resend, Amazon SES, Mailgun, Gmail (App Password).  
Sem SMTP, os emails são apenas logados como `[email:DRY-RUN]`.

## 5. Deploy Vercel
Ver `/app/DEPLOY.md` (atualizado). Env vars do frontend continuam iguais (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_BACKEND_URL).  
Backend FastAPI precisa ser hospedado separadamente (Railway/Render/Fly).

## 6. Admins hardcoded
`gustavomonteiro09g@gmail.com` e `gustavomonte10g@gmail.com` — ambos tratados como admin por:
- Allowlist no backend (`/app/backend/server.py → ADMIN_EMAILS`)
- Seed no schema (`public.profiles.role = 'admin'`)

## 7. Endpoints
Auth: `/api/auth/session`, `/api/auth/me`, `/api/auth/logout`  
Perfil: `PATCH /api/profile`, `POST /api/profile/avatar`  
Pedidos: `POST /api/orders`, `GET /api/orders`, `PATCH /api/admin/orders/{id}`  
Depoimentos: `POST /api/testimonials`, `DELETE /api/testimonials/{id}`, `POST /api/admin/testimonials/{id}/reply`  
Produtos (admin): `POST/PATCH/DELETE /api/admin/products[/{id}]`, `POST /api/admin/products/{id}/image`, CRUD ingredientes  
Settings/Usuários (admin): `PATCH /api/admin/settings`, `PATCH /api/admin/users/{id}/role`  
IA: `/api/ai/describe`, `/api/ai/badge`, `/api/ai/reply-testimonial`  
Upload site images (admin): `POST /api/admin/site-images?slot=hero|banner|benefits`
