# Vitória — Setup guide

## 1. Aplicar o schema no Supabase (obrigatório)

1. Abra o Supabase Studio do seu projeto: https://uuovdyvfoufjmlnmhzse.supabase.co
2. Vá em **SQL Editor** → **New query**
3. Copie **todo** o conteúdo de `/app/supabase_schema.sql` e cole
4. Clique em **Run**

Isso cria:
- Tabelas: `profiles`, `products`, `product_ingredients`, `orders`, `testimonials`, `app_settings`, `site_images`
- Enum `app_role` (`admin`/`user`) e helper `public.is_admin(uuid)`
- Trigger `on_auth_user_created` que cria o perfil e promove `gustavomonteiro09g@gmail.com` a admin
- Políticas RLS para leitura pública + escrita restrita a admin onde aplicável
- Buckets de Storage: `avatars`, `product-images`, `site-images`
- Seed de produtos iniciais

## 2. Login com Google (opcional)

1. Crie credenciais OAuth no Google Cloud Console (Web application)
2. Em **Redirect URIs** adicione: `https://uuovdyvfoufjmlnmhzse.supabase.co/auth/v1/callback`
3. No Supabase: **Authentication → Providers → Google** → habilite e cole Client ID/Secret
4. O botão "Continuar com Google" no app passa a funcionar.

## 3. Cadastro do admin

1. Abra o app → aba **Perfil** → **Entrar ou cadastrar** → **Cadastre-se**
2. Use `gustavomonteiro09g@gmail.com` com a senha que quiser
3. Após confirmar o email (se estiver ativado no Supabase), faça login
4. A trigger promove automaticamente para admin. O botão "Painel Admin" aparecerá no Perfil.

## 4. Endpoints úteis
- Backend: `/api/health`, `/api/ai/describe`, `/api/ai/badge`, `/api/ai/reply-testimonial`
- Frontend PWA: abra em mobile > "Adicionar à tela inicial" para instalar como app nativo
