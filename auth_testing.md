# Vitória — Auth testing (Emergent Google Auth)

## Setup dependency
- Supabase schema aplicado (ver `/app/supabase_schema.sql`)
- `SUPABASE_SERVICE_ROLE_KEY` preenchida em `/app/backend/.env`
- Backend rodando: `curl $BACKEND_URL/api/health` deve retornar `supabase_configured: true`

## Flow to validate
1. Usuário não logado abre home → vê produtos
2. Clica em "Perfil" → "Entrar ou cadastrar" → "Continuar com Google"
3. Redirecionamento para `https://auth.emergentagent.com/?redirect=...`
4. Após aprovação, volta para `{origin}/#session_id=<id>`
5. `AuthCallback` troca o session_id via `POST /api/auth/session`, cookie `session_token` é setado, URL limpa e frontend recarrega `/`
6. `AuthProvider` chama `GET /api/auth/me`, recebe user + is_admin
7. Se admin (`gustavomonteiro09g@gmail.com` ou `gustavomonte10g@gmail.com`): botão "Painel Admin" visível em Perfil
8. Admin pode: criar/editar/excluir produto, responder depoimento, mudar status de pedido, promover usuário
9. Logout: `POST /api/auth/logout` limpa cookie + sessão Supabase

## Manual backend test
```bash
# 1. Health
curl $BACKEND_URL/api/health

# 2. Exchange (precisa de um session_id real do Emergent — não dá para mockar)
curl -X POST $BACKEND_URL/api/auth/session -H "Content-Type: application/json" -d '{"session_id":"abc..."}'

# 3. Me (precisa do cookie setado na etapa anterior)
curl $BACKEND_URL/api/auth/me -H "Cookie: session_token=..."
```

## Seed admin manualmente (contorno, caso trigger não esteja rodando)
```sql
insert into public.profiles (email, full_name, nickname, role)
values ('gustavomonteiro09g@gmail.com','Gustavo','Gustavo','admin'),
       ('gustavomonte10g@gmail.com','Gustavo','Gustavo','admin')
on conflict (email) do update set role='admin';
```

## Acceptance
- ✅ `/api/auth/me` retorna 200 após login
- ✅ `is_admin = true` para os dois emails allowlisted
- ✅ Pedido aparece no `/historico` + email `order_confirmation.html` é disparado
- ✅ Admin responde depoimento → cliente recebe `testimonial_reply.html`
- ✅ Logout zera cookie e `GET /api/auth/me` passa a retornar 401
