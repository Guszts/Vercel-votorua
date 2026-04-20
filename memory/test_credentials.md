# Test Credentials — Vitória

## Admins (allowlist dupla no backend)
- `gustavomonteiro09g@gmail.com`
- `gustavomonte10g@gmail.com`

Ambos são promovidos automaticamente a `role='admin'` na primeira entrada via Emergent Google Auth.
O backend também reconhece esses emails como admin mesmo que a coluna `role` ainda esteja como `user`.

## Auth
- **Método A — Google (Emergent Managed):** zero config. Cookie `session_token` httpOnly (7d) + `public.user_sessions`.
- **Método B — Email/Senha (Supabase Auth):** usa o SDK Supabase no frontend; backend valida o JWT chamando `/auth/v1/user`. Upsert automático de profile por email. Ambos os métodos reconhecem os admins da allowlist.

## Integrações
- **Supabase URL:** `https://uuovdyvfoufjmlnmhzse.supabase.co`
- **Supabase Anon Key:** `/app/frontend/.env` → `VITE_SUPABASE_ANON_KEY`
- **Supabase Service Role Key:** ⚠️ **OBRIGATÓRIO** em `/app/backend/.env` → `SUPABASE_SERVICE_ROLE_KEY`  
  Onde pegar: Supabase Studio → Settings → API → `service_role` (copiar o JWT, NUNCA comitar em git público).
- **Supabase Anon Key (backend):** também em `/app/backend/.env` → `SUPABASE_ANON_KEY` (mesma chave `anon` usada no frontend; necessária para validar JWTs de email/senha).
- **Emergent LLM Key:** `/app/backend/.env` → `EMERGENT_LLM_KEY` (já preenchida)
- **SMTP (opcional, para envio real de emails):** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` em `/app/backend/.env`. Sem SMTP os emails são logados em dry-run.

## Como testar o fluxo de auth
1. Apicar `/app/supabase_schema.sql` no Supabase SQL Editor
2. Preencher `SUPABASE_SERVICE_ROLE_KEY` em `/app/backend/.env` e `sudo supervisorctl restart backend`
3. Abrir o app → Perfil → **Continuar com Google**
4. Autorizar com uma conta Google → é redirecionado de volta logado
5. Para os dois emails admin acima, o botão **Painel Admin** aparece
