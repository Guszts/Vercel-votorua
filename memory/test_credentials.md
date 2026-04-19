# Test Credentials — Vitória

## Admin (bootstrap)
- **Email:** `gustavomonteiro09g@gmail.com`
- **Senha:** defina no primeiro cadastro via tela "Entrar ou cadastrar" → "Cadastre-se"
- O trigger SQL `handle_new_user()` promove automaticamente este email a `role = 'admin'` assim que a conta é criada.

## Usuário comum (sugestão para testes)
- **Email:** `cliente@vitoria.test`
- **Senha:** `Teste123!`
- Basta se cadastrar pela mesma tela.

## Integrações
- **Supabase URL:** `https://uuovdyvfoufjmlnmhzse.supabase.co`
- **Supabase Anon Key:** configurada em `/app/frontend/.env` (`VITE_SUPABASE_ANON_KEY`)
- **Supabase Service Role:** NÃO ficou salva no repositório; mantenha no cofre do usuário.
- **Emergent LLM Key (backend):** configurada em `/app/backend/.env` (`EMERGENT_LLM_KEY`)

## Google OAuth
- Depende de configuração manual em Supabase > Authentication > Providers > Google.
- Enquanto não habilitado, o botão mostra o erro retornado pelo Supabase.
