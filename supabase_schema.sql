-- ============================================================================
-- Vitória app — Supabase schema + RLS policies
-- Apply this entire SQL in Supabase > SQL Editor > New query > Run.
-- ============================================================================

-- 1. Extensions
create extension if not exists "pgcrypto";

-- 2. Enum for roles
do $$ begin
  create type public.app_role as enum ('admin', 'user');
exception when duplicate_object then null; end $$;

-- 3. Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text unique not null,
  full_name text,
  nickname text,
  username text unique,
  avatar_url text,
  role public.app_role not null default 'user',
  loyalty_points int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  description text,
  long_description text,
  price numeric(10,2) not null check (price >= 0),
  image_url text,
  badge text,
  badge_color text,
  stock int not null default 9999,
  sort_order int not null default 0,
  active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. Ingredients (each product has its own ingredients)
create table if not exists public.product_ingredients (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null,
  price numeric(10,2) not null default 0,
  default_included boolean not null default true,
  removable boolean not null default true,
  stock int not null default 9999,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

-- 6. Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  total numeric(10,2) not null,
  status text not null default 'pending',
  items jsonb not null default '[]'::jsonb,
  note text,
  created_at timestamptz default now()
);

do $$ begin
  alter table public.orders
    add constraint orders_user_id_profiles_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;
exception when duplicate_object then null; end $$;

-- 7. Testimonials
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  rating int not null check (rating between 1 and 5),
  content text,
  created_at timestamptz default now()
);

-- explicit FK to profiles for PostgREST embedded selects (profiles!inner)
do $$ begin
  alter table public.testimonials
    add constraint testimonials_user_id_profiles_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;
exception when duplicate_object then null; end $$;

-- 8. Settings (single row keyed by 'main')
create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

insert into public.app_settings (key, value) values
('main', jsonb_build_object(
  'address', 'Campo Novo do Parecis - MT',
  'hours', 'Seg a Sáb: 11h às 22h. Dom: 11h às 16h',
  'delivery_time', '30-45 min',
  'pickup_time', '15-20 min',
  'payment_methods', jsonb_build_array('Pix','Cartão Crédito','Cartão Débito','Dinheiro')
))
on conflict (key) do nothing;

-- 9. Site images (hero, banner, benefits, etc.)
create table if not exists public.site_images (
  slot text primary key,
  url text not null,
  updated_at timestamptz default now()
);

-- 10. Helper: who is admin?
create or replace function public.is_admin(uid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role = 'admin' from public.profiles where id = uid), false);
$$;

-- 11. Trigger: auto-create profile on signup; promote hardcoded admin email
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  is_bootstrap_admin boolean := new.email = 'gustavomonteiro09g@gmail.com';
begin
  insert into public.profiles (id, email, full_name, nickname, username, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    split_part(new.email, '@', 1),
    new.raw_user_meta_data->>'avatar_url',
    case when is_bootstrap_admin then 'admin'::public.app_role else 'user'::public.app_role end
  )
  on conflict (id) do update set
    email = excluded.email,
    role = case when public.profiles.role = 'admin' or is_bootstrap_admin
                then 'admin'::public.app_role else public.profiles.role end;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- 12. Enable RLS
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_ingredients enable row level security;
alter table public.orders enable row level security;
alter table public.testimonials enable row level security;
alter table public.app_settings enable row level security;
alter table public.site_images enable row level security;

-- 13. Policies
-- profiles: everyone authenticated can read all profile public fields, users edit their own, admins can update roles
drop policy if exists "profiles select" on public.profiles;
create policy "profiles select" on public.profiles for select
  to anon, authenticated using (true);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles for update
  to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles admin update" on public.profiles;
create policy "profiles admin update" on public.profiles for update
  to authenticated using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- products: public read, admin write
drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products for select
  to anon, authenticated using (true);

drop policy if exists "products admin write" on public.products;
create policy "products admin write" on public.products for all
  to authenticated using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- ingredients
drop policy if exists "ingredients public read" on public.product_ingredients;
create policy "ingredients public read" on public.product_ingredients for select
  to anon, authenticated using (true);

drop policy if exists "ingredients admin write" on public.product_ingredients;
create policy "ingredients admin write" on public.product_ingredients for all
  to authenticated using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- orders: user sees own, admin sees all
drop policy if exists "orders own select" on public.orders;
create policy "orders own select" on public.orders for select
  to authenticated using (auth.uid() = user_id or public.is_admin(auth.uid()));

drop policy if exists "orders own insert" on public.orders;
create policy "orders own insert" on public.orders for insert
  to authenticated with check (auth.uid() = user_id);

drop policy if exists "orders admin update" on public.orders;
create policy "orders admin update" on public.orders for update
  to authenticated using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- testimonials
drop policy if exists "testimonials public read" on public.testimonials;
create policy "testimonials public read" on public.testimonials for select
  to anon, authenticated using (true);

drop policy if exists "testimonials insert own" on public.testimonials;
create policy "testimonials insert own" on public.testimonials for insert
  to authenticated with check (auth.uid() = user_id);

drop policy if exists "testimonials update own" on public.testimonials;
create policy "testimonials update own" on public.testimonials for update
  to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "testimonials admin delete" on public.testimonials;
create policy "testimonials admin delete" on public.testimonials for delete
  to authenticated using (public.is_admin(auth.uid()) or auth.uid() = user_id);

-- app_settings: public read, admin write
drop policy if exists "settings public read" on public.app_settings;
create policy "settings public read" on public.app_settings for select
  to anon, authenticated using (true);

drop policy if exists "settings admin write" on public.app_settings;
create policy "settings admin write" on public.app_settings for all
  to authenticated using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- site_images
drop policy if exists "site_images public read" on public.site_images;
create policy "site_images public read" on public.site_images for select
  to anon, authenticated using (true);

drop policy if exists "site_images admin write" on public.site_images;
create policy "site_images admin write" on public.site_images for all
  to authenticated using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

-- 14. Storage buckets (create manually in Storage UI or run these after enabling storage)
-- Use the public 'avatars' and 'product-images' buckets.
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('site-images', 'site-images', true)
  on conflict (id) do nothing;

-- Storage policies
drop policy if exists "avatar public read" on storage.objects;
create policy "avatar public read" on storage.objects for select
  to anon, authenticated using (bucket_id in ('avatars','product-images','site-images'));

drop policy if exists "avatar owner insert" on storage.objects;
create policy "avatar owner insert" on storage.objects for insert
  to authenticated with check (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatar owner update" on storage.objects;
create policy "avatar owner update" on storage.objects for update
  to authenticated using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatar owner delete" on storage.objects;
create policy "avatar owner delete" on storage.objects for delete
  to authenticated using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "admin upload product image" on storage.objects;
create policy "admin upload product image" on storage.objects for insert
  to authenticated with check (
    bucket_id in ('product-images','site-images') and public.is_admin(auth.uid())
  );

drop policy if exists "admin update product image" on storage.objects;
create policy "admin update product image" on storage.objects for update
  to authenticated using (
    bucket_id in ('product-images','site-images') and public.is_admin(auth.uid())
  );

drop policy if exists "admin delete product image" on storage.objects;
create policy "admin delete product image" on storage.objects for delete
  to authenticated using (
    bucket_id in ('product-images','site-images') and public.is_admin(auth.uid())
  );

-- 15. Seed products (run-once idempotent)
insert into public.products (category, name, description, price, image_url, badge, sort_order) values
('marmitas','Marmita P','Arroz, feijão, 1 carne à escolha, macarronada, e salada separada. Ideal para o dia a dia.',20.00,'https://readdy.ai/api/search-image?query=brazilian+marmita+small+portion+rice+beans+meat+salad+overhead&width=600&height=600&seq=1&orientation=squarish','Mais Vendida',1),
('marmitas','Marmita M','A queridinha da galera. Porção generosa com 2 misturas à sua escolha.',28.00,'https://readdy.ai/api/search-image?query=brazilian+marmita+two+meats+generous+portion+appetizing+lighting&width=600&height=600&seq=2&orientation=squarish','Favorita',2),
('marmitas','Marmita G','Para quem tem muita fome. 3 opções de carnes e acompanhamentos caprichados.',35.00,'https://readdy.ai/api/search-image?query=large+brazilian+marmita+three+meats+family+size+abundant+overhead&width=600&height=600&seq=3&orientation=squarish','Tamanho Família',3),
('marmitas','Feijoada Completa','Feijoada rica em carnes servida com arroz branco, couve refogada, farofa e laranja.',30.00,'https://readdy.ai/api/search-image?query=brazilian+feijoada+complete+meal+rice+farofa+greens&width=600&height=600&seq=4&orientation=squarish','Quarta e Sábado',4),
('fitness','Frango com Batata Doce','Filé de peito de frango grelhado e purê rústico de batata doce.',28.00,'https://readdy.ai/api/search-image?query=grilled+chicken+breast+sweet+potato+mash+healthy+plate&width=600&height=600&seq=8&orientation=squarish','Foco',10),
('fitness','Salmão Grelhado Fit','Posta de salmão com crosta de gergelim acompanhada de legumes no vapor.',42.00,'https://readdy.ai/api/search-image?query=grilled+salmon+sesame+steamed+vegetables+fitness+meal&width=600&height=600&seq=9&orientation=squarish','Premium',11),
('carnes','Picanha Grill','Picanha assada na brasa com capa de gordura dourada no ponto perfeito.',90.00,'https://readdy.ai/api/search-image?query=picanha+bbq+grilled+juicy+meat+board&width=600&height=600&seq=15&orientation=squarish','Mais Pedida',20),
('bebidas','Refrigerante Lata','Opções: Coca-Cola, Guaraná, Fanta (Lata 350ml). Bem gelada.',6.00,'https://readdy.ai/api/search-image?query=cold+soda+cans+ice+drops+refreshing&width=600&height=600&seq=22&orientation=squarish',null,30),
('bebidas','Suco Natural de Laranja','Suco espremido na hora, copo de 500ml. Sem adição de açúcar.',9.00,'https://readdy.ai/api/search-image?query=fresh+orange+juice+glass+ice&width=600&height=600&seq=24&orientation=squarish','Natural',31),
('sobremesas','Pudim de Leite Condensado','Fatia generosa de pudim cremoso sem furinhos, com calda de caramelo intenso.',12.00,'https://readdy.ai/api/search-image?query=brazilian+pudim+flan+slice+caramel+sauce&width=600&height=600&seq=29&orientation=squarish','Clássica',40),
('pastel','Pastel Frango com Catupiry','Recheio cremoso e farto de frango desfiado com o verdadeiro requeijão Catupiry.',14.00,'https://readdy.ai/api/search-image?query=fried+pastel+chicken+cream+cheese+catupiry&width=600&height=600&seq=38&orientation=squarish','Destaque',50)
on conflict do nothing;
