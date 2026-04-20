import { useState } from "react";
import { Copy, Check, ExternalLink, Database } from "lucide-react";

const SQL = String.raw`-- ============================================================================
-- Vitória — Supabase schema (Emergent Auth edition) — Idempotente
-- Cole TUDO isso em Supabase > SQL Editor > New query > Run
-- ============================================================================

create extension if not exists "pgcrypto";

do $$ begin
  create type public.app_role as enum ('admin', 'user');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  nickname text,
  username text unique,
  avatar_url text,
  picture text,
  role public.app_role not null default 'user',
  loyalty_points int not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

do $$ begin
  alter table public.profiles drop constraint if exists profiles_id_fkey;
exception when others then null; end $$;

alter table public.profiles add column if not exists picture text;

create table if not exists public.user_sessions (
  session_token text primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);
create index if not exists user_sessions_user_id_idx on public.user_sessions(user_id);

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

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  total numeric(10,2) not null,
  status text not null default 'pending',
  items jsonb not null default '[]'::jsonb,
  note text,
  created_at timestamptz default now()
);

do $$ begin
  alter table public.orders drop constraint if exists orders_user_id_fkey;
exception when others then null; end $$;

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  content text,
  admin_reply text,
  admin_reply_at timestamptz,
  created_at timestamptz default now()
);

do $$ begin
  alter table public.testimonials drop constraint if exists testimonials_user_id_fkey;
exception when others then null; end $$;

do $$ begin
  alter table public.testimonials
    add constraint testimonials_user_id_profiles_fkey
    foreign key (user_id) references public.profiles(id) on delete cascade;
exception when duplicate_object then null; end $$;

alter table public.testimonials add column if not exists admin_reply text;
alter table public.testimonials add column if not exists admin_reply_at timestamptz;

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
)) on conflict (key) do nothing;

create table if not exists public.site_images (
  slot text primary key,
  url text not null,
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_ingredients enable row level security;
alter table public.orders enable row level security;
alter table public.testimonials enable row level security;
alter table public.app_settings enable row level security;
alter table public.site_images enable row level security;
alter table public.user_sessions enable row level security;

drop policy if exists "profiles select" on public.profiles;
create policy "profiles select" on public.profiles for select to anon, authenticated using (true);
drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products for select to anon, authenticated using (true);
drop policy if exists "ingredients public read" on public.product_ingredients;
create policy "ingredients public read" on public.product_ingredients for select to anon, authenticated using (true);
drop policy if exists "testimonials public read" on public.testimonials;
create policy "testimonials public read" on public.testimonials for select to anon, authenticated using (true);
drop policy if exists "settings public read" on public.app_settings;
create policy "settings public read" on public.app_settings for select to anon, authenticated using (true);
drop policy if exists "site_images public read" on public.site_images;
create policy "site_images public read" on public.site_images for select to anon, authenticated using (true);

insert into storage.buckets (id, name, public) values ('avatars','avatars',true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('product-images','product-images',true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('site-images','site-images',true) on conflict (id) do nothing;

drop policy if exists "public read storage" on storage.objects;
create policy "public read storage" on storage.objects for select
  to anon, authenticated using (bucket_id in ('avatars','product-images','site-images'));

insert into public.profiles (email, full_name, nickname, username, role) values
  ('gustavomonteiro09g@gmail.com','Gustavo Monteiro','Gustavo','gustavomonteiro09g','admin'),
  ('gustavomonte10g@gmail.com','Gustavo Monteiro','Gustavo','gustavomonte10g','admin')
on conflict (email) do update set role='admin';

do $$
declare pid uuid;
begin
  if not exists (select 1 from public.products where name='Marmita P') then
    insert into public.products (category,name,description,long_description,price,image_url,badge,badge_color,stock,sort_order)
    values ('marmitas','Marmita P','Arroz, feijão, 1 carne à escolha, acompanhamento e salada.',
      'A marmita perfeita para o almoço ou jantar do dia a dia. Porção equilibrada com arroz branco soltinho, feijão carioca cremoso, uma proteína à sua escolha (frango grelhado, bife acebolado ou carne moída), acompanhamento do dia (macarrão alho e óleo, farofa de banana ou purê) e salada verde fresquinha à parte. Feita na hora, com ingredientes selecionados.',
      22.00,'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80','Mais Vendida','#dc2626',80,1) returning id into pid;
    insert into public.product_ingredients (product_id,name,price,default_included,removable,sort_order) values
      (pid,'Arroz branco',0,true,false,1),(pid,'Feijão carioca',0,true,true,2),(pid,'Frango grelhado',0,true,true,3),
      (pid,'Salada verde',0,true,true,4),(pid,'Ovo frito',2.00,false,true,5),(pid,'Farofa extra',3.00,false,true,6),(pid,'Vinagrete',2.50,false,true,7);
  end if;

  if not exists (select 1 from public.products where name='Marmita M') then
    insert into public.products (category,name,description,long_description,price,image_url,badge,badge_color,stock,sort_order)
    values ('marmitas','Marmita M','Porção generosa com 2 misturas à sua escolha.',
      'A queridinha da casa. Porção maior com duas proteínas de sua escolha (frango, bife, calabresa, linguiça toscana, carne de panela, ovo…), arroz, feijão, dois acompanhamentos e salada. Perfeita pra quem trabalha duro ou está vindo direto da academia.',
      29.90,'https://images.unsplash.com/photo-1593504049359-74330189a345?auto=format&fit=crop&w=800&q=80','Favorita','#dc2626',80,2) returning id into pid;
    insert into public.product_ingredients (product_id,name,price,default_included,removable,sort_order) values
      (pid,'Arroz branco',0,true,false,1),(pid,'Feijão carioca',0,true,true,2),(pid,'Mistura 1 (Frango)',0,true,true,3),
      (pid,'Mistura 2 (Bife)',0,true,true,4),(pid,'Macarronada',0,true,true,5),(pid,'Salada verde',0,true,true,6),
      (pid,'Ovo frito',2.00,false,true,7),(pid,'Bacon crocante',4.50,false,true,8);
  end if;

  if not exists (select 1 from public.products where name='Marmita G') then
    insert into public.products (category,name,description,long_description,price,image_url,badge,badge_color,stock,sort_order)
    values ('marmitas','Marmita G','3 proteínas e acompanhamentos caprichados. Fome zero.',
      'Pra quem tem muita fome ou quer dividir. Três proteínas fartas, arroz, feijão, três acompanhamentos, salada e farofa. Embalada em marmita térmica que mantém quente até 2h.',
      37.90,'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80','Família','#991b1b',50,3) returning id into pid;
    insert into public.product_ingredients (product_id,name,price,default_included,removable,sort_order) values
      (pid,'Arroz branco',0,true,false,1),(pid,'Feijão carioca',0,true,true,2),(pid,'Proteína 1',0,true,true,3),
      (pid,'Proteína 2',0,true,true,4),(pid,'Proteína 3',0,true,true,5),(pid,'Farofa',0,true,true,6),
      (pid,'Vinagrete',0,true,true,7),(pid,'Salada verde',0,true,true,8);
  end if;

  if not exists (select 1 from public.products where name='Feijoada Completa') then
    insert into public.products (category,name,description,long_description,price,image_url,badge,badge_color,stock,sort_order)
    values ('marmitas','Feijoada Completa','Feijoada rica em carnes com arroz, couve, farofa e laranja.',
      'Feijoada tradicional preparada com feijão preto, linguiça calabresa defumada, bacon, paio, costelinha e carne seca. Acompanha arroz branco, couve refogada no alho, farofa crocante, torresmo e gomos de laranja. Servida quarta-feira e sábado.',
      32.00,'https://images.unsplash.com/photo-1598511726623-d2e9996e1b2b?auto=format&fit=crop&w=800&q=80','Qua & Sáb','#92400e',40,4) returning id into pid;
    insert into public.product_ingredients (product_id,name,price,default_included,removable,sort_order) values
      (pid,'Feijão preto com carnes',0,true,false,1),(pid,'Arroz branco',0,true,false,2),(pid,'Couve refogada',0,true,true,3),
      (pid,'Farofa',0,true,true,4),(pid,'Torresmo',0,true,true,5),(pid,'Laranja',0,true,true,6),(pid,'Pimenta artesanal',1.50,false,true,7);
  end if;

  if not exists (select 1 from public.products where name='Strogonoff de Frango') then
    insert into public.products (category,name,description,long_description,price,image_url,badge,badge_color,stock,sort_order)
    values ('marmitas','Strogonoff de Frango','Strogonoff cremoso com arroz, batata palha e salada.',
      'Peito de frango em cubos ao creme de leite fresco, champignons e ketchup artesanal. Acompanha arroz branco soltinho, batata palha crocante e salada.',
      27.90,'https://images.unsplash.com/photo-1604908554049-3e8457552be0?auto=format&fit=crop&w=800&q=80',null,null,60,5);
  end if;

  if not exists (select 1 from public.products where name='Parmegiana de Filé') then
    insert into public.products (category,name,description,long_description,price,image_url,badge,badge_color,stock,sort_order)
    values ('marmitas','Parmegiana de Filé','Filé empanado, molho de tomate artesanal e queijo gratinado.',
      'Filé mignon empanado na hora, coberto com molho de tomate rústico preparado na casa, muçarela e parmesão gratinados no forno. Acompanha arroz, fritas e salada.',
      42.00,'https://images.unsplash.com/photo-1625944525533-473f1b3d9684?auto=format&fit=crop&w=800&q=80','Premium','#7c2d12',30,6);
  end if;

  if not exists (select 1 from public.products where name='Frango Fit com Batata Doce') then
    insert into public.products (category,name,description,long_description,price,image_url,badge,badge_color,stock,sort_order)
    values ('fitness','Frango Fit com Batata Doce','Filé de peito grelhado e purê rústico de batata doce.',
      'Filé de peito de frango temperado com ervas frescas, grelhado na placa com fio de azeite. Purê rústico de batata doce sem manteiga, brócolis no vapor e mix de folhas. 100% sem óleo adicional.',
      28.90,'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80','Foco','#059669',50,10) returning id into pid;
    insert into public.product_ingredients (product_id,name,price,default_included,removable,sort_order) values
      (pid,'Frango grelhado',0,true,false,1),(pid,'Batata doce',0,true,true,2),(pid,'Brócolis no vapor',0,true,true,3),
      (pid,'Mix de folhas',0,true,true,4),(pid,'Ovo cozido extra',2.00,false,true,5),(pid,'Quinoa',4.00,false,true,6);
  end if;

  if not exists (select 1 from public.products where name='Salmão Grelhado Fit') then
    insert into public.products (category,name,description,long_description,price,image_url,badge,badge_color,stock,sort_order)
    values ('fitness','Salmão Grelhado Fit','Posta de salmão com crosta de gergelim e legumes no vapor.',
      'Posta de salmão fresco grelhado com crosta de gergelim preto e branco, molho shoyu artesanal leve. Acompanha quinoa, abobrinha, cenoura e brócolis no vapor com azeite extra virgem.',
      48.00,'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80','Premium','#0d9488',25,11);
  end if;

  if not exists (select 1 from public.products where name='Low Carb de Carne') then
    insert into public.products (category,name,description,long_description,price,image_url,badge,badge_color,stock,sort_order)
    values ('fitness','Low Carb de Carne','Alcatra em tiras com abobrinha, cenoura e couve-flor gratinada.',
      'Tiras de alcatra refogadas com alho, abobrinha em espiral, cenoura baby e couve-flor gratinada com parmesão. Zero arroz, zero feijão, 100% sabor.',
      32.00,'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=800&q=80','Low Carb','#15803d',40,12);
  end if;

  if not exists (select 1 from public.products where name='Omelete Proteico') then
    insert into public.products (category,name,description,long_description,price,image_url,badge,badge_color,stock,sort_order)
    values ('fitness','Omelete Proteico','4 claras, 1 gema, frango desfiado, queijo cottage e espinafre.',
      'Omelete feito com 4 claras e 1 gema, recheado com frango desfiado temperado, queijo cottage e espinafre refogado. Acompanha pão integral e suco detox.',
      22.00,'https://images.unsplash.com/photo-1603903631918-d6bb6e42a3cf?auto=format&fit=crop&w=800&q=80',null,null,40,13);
  end if;

  if not exists (select 1 from public.products where name='Picanha na Brasa') then
    insert into public.products (category,name,description,long_description,price,image_url,badge,badge_color,stock,sort_order)
    values ('carnes','Picanha na Brasa','Picanha 400g assada na brasa com capa dourada no ponto.',
      'Picanha nobre de 400g assada em alta temperatura na brasa, com capa de gordura dourada e crocante, no ponto perfeito. Acompanha arroz, farofa, vinagrete e pão de alho.',
      95.00,'https://images.unsplash.com/photo-1615937691194-97dbd3f3dc29?auto=format&fit=crop&w=800&q=80','Mais Pedida','#991b1b',15,20);
  end if;

  if not exists (select 1 from public.products where name='Costela no Bafo') then
    insert into public.products (category,name,description,long_description,price,image_url,badge,badge_color,stock,sort_order)
    values ('carnes','Costela no Bafo','Costela bovina cozida por 8h, desmancha com garfo.',
      'Costela bovina temperada com ervas, cozida lentamente por 8 horas no vapor até desmanchar. Servida com mandioca cozida, farofa crocante e vinagrete da casa.',
      68.00,'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80','Especial','#7c2d12',20,21);
  end if;

  if not exists (select 1 from public.products where name='Linguiça Artesanal') then
    insert into public.products (category,name,description,long_description,price,image_url,badge,badge_color,stock,sort_order)
    values ('carnes','Linguiça Artesanal','Linguiça toscana artesanal grelhada com pão e vinagrete.',
      'Linguiça toscana artesanal feita por produtores locais, grelhada em placa. Acompanha pão francês fresquinho, vinagrete, farofa e molhos da casa.',
      26.00,'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=800&q=80',null,null,40,22);
  end if;

  if not exists (select 1 from public.products where name='Coca-Cola Lata 350ml') then
    insert into public.products (category,name,description,long_description,price,image_url,badge,badge_color,stock,sort_order)
    values ('bebidas','Coca-Cola Lata 350ml','Bem gelada, diretamente da geladeira.',
      'Lata 350ml, sempre bem gelada. Também disponível Coca Zero, Guaraná Antarctica e Fanta Laranja (pergunte ao finalizar).',
      7.00,'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=800&q=80',null,null,200,30);
  end if;

  if not exists (select 1 from public.products where name='Suco Natural de Laranja 500ml') then
    insert into public.products (category,name,description,long_description,price,image_url,badge,badge_color,stock,sort_order)
    values ('bebidas','Suco Natural de Laranja 500ml','Espremido na hora, sem açúcar adicionado.',
      'Laranjas frescas espremidas no momento do pedido. Copo de 500ml, sem adição de açúcar nem água.',
      10.00,'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=800&q=80','Natural','#059669',50,31);
  end if;

  if not exists (select 1 from public.products where name='Limonada Suíça') then
    insert into public.products (category,name,description,long_description,price,image_url,badge,badge_color,stock,sort_order)
    values ('bebidas','Limonada Suíça','Limão batido com leite condensado, bem gelada.',
      'Limão siciliano batido na hora com leite condensado e gelo. Cremosa, refrescante e azedinha na medida. 500ml.',
      11.00,'https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9e?auto=format&fit=crop&w=800&q=80',null,null,40,32);
  end if;

  if not exists (select 1 from public.products where name='Pudim de Leite Condensado') then
    insert into public.products (category,name,description,long_description,price,image_url,badge,badge_color,stock,sort_order)
    values ('sobremesas','Pudim de Leite Condensado','Fatia cremosa sem furinhos com calda de caramelo.',
      'Pudim clássico feito com ovos caipiras e leite condensado, calda de caramelo intensa, textura aveludada, sem furinhos. Fatia generosa de 150g.',
      12.00,'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80','Clássica','#dc2626',40,40);
  end if;

  if not exists (select 1 from public.products where name='Brigadeiro Gourmet (3 un)') then
    insert into public.products (category,name,description,long_description,price,image_url,badge,badge_color,stock,sort_order)
    values ('sobremesas','Brigadeiro Gourmet (3 un)','Trio com chocolate belga, pistache e beijinho.',
      'Três brigadeiros artesanais: chocolate belga com flor de sal, pistache com chocolate branco e beijinho de coco. Embalados individualmente.',
      15.00,'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',null,null,30,41);
  end if;

  if not exists (select 1 from public.products where name='Pastel de Frango com Catupiry') then
    insert into public.products (category,name,description,long_description,price,image_url,badge,badge_color,stock,sort_order)
    values ('pastel','Pastel de Frango com Catupiry','Recheio cremoso de frango desfiado com Catupiry legítimo.',
      'Pastel gigante (30cm) de massa fina e crocante, recheado com frango desfiado temperado e Catupiry legítimo. Fritura em óleo limpo.',
      16.00,'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80','Destaque','#b45309',60,50);
  end if;

  if not exists (select 1 from public.products where name='Pastel de Carne') then
    insert into public.products (category,name,description,long_description,price,image_url,badge,badge_color,stock,sort_order)
    values ('pastel','Pastel de Carne','Carne moída temperada com cebola, salsinha e azeitona.',
      'Pastel gigante 30cm, recheio tradicional de carne moída refogada com cebola, alho, salsinha e azeitona picada. Massa fina e crocante.',
      14.00,'https://images.unsplash.com/photo-1625944023284-77a69e84df6b?auto=format&fit=crop&w=800&q=80',null,null,60,51);
  end if;

  if not exists (select 1 from public.products where name='Pastel de Queijo') then
    insert into public.products (category,name,description,long_description,price,image_url,badge,badge_color,stock,sort_order)
    values ('pastel','Pastel de Queijo','Muçarela derretida em massa fina crocante.',
      'Pastel 30cm recheado com muçarela de primeira qualidade que derrete e escorre ao primeiro mordisco. Simples e perfeito.',
      12.00,'https://images.unsplash.com/photo-1619895092538-128f4d2e2b4a?auto=format&fit=crop&w=800&q=80',null,null,60,52);
  end if;
end $$;
`;

const SUPABASE_SQL_EDITOR = "https://supabase.com/dashboard/project/uuovdyvfoufjmlnmhzse/sql/new";

export default function SetupSql() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(SQL);
      } else {
        // fallback for non-https contexts
        const ta = document.createElement("textarea");
        ta.value = SQL;
        ta.style.position = "fixed";
        ta.style.top = "-1000px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3500);
    } catch {
      alert("Não foi possível copiar automaticamente. Selecione o texto manualmente abaixo.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-16">
      <header className="sticky top-0 bg-white border-b border-stone-100 z-20">
        <div className="max-w-3xl mx-auto px-5 py-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-red-600 text-white flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-stone-500">Setup</p>
            <p className="font-black text-stone-900 text-lg">SQL do Supabase</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 py-6 space-y-5">
        <div className="bg-white border border-stone-100 rounded-3xl p-5 shadow-sm">
          <ol className="space-y-3 text-sm font-medium text-stone-700 leading-relaxed">
            <li className="flex gap-3">
              <span className="w-6 h-6 shrink-0 rounded-full bg-red-600 text-white text-xs font-black flex items-center justify-center">1</span>
              <span><strong>Copie</strong> o SQL clicando no botão vermelho.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 shrink-0 rounded-full bg-red-600 text-white text-xs font-black flex items-center justify-center">2</span>
              <span><strong>Abra</strong> o SQL Editor do Supabase clicando no botão preto.</span>
            </li>
            <li className="flex gap-3">
              <span className="w-6 h-6 shrink-0 rounded-full bg-red-600 text-white text-xs font-black flex items-center justify-center">3</span>
              <span><strong>Cole</strong> dentro do editor e toque em <em>Run</em>. Leva ~3 segundos. Seguro rodar várias vezes.</span>
            </li>
          </ol>
        </div>

        <button
          onClick={copy}
          data-testid="copy-sql-btn"
          className={`w-full rounded-3xl py-5 text-lg font-black flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg ${
            copied
              ? "bg-green-600 text-white"
              : "bg-red-600 hover:bg-red-700 text-white hover:-translate-y-0.5"
          }`}
        >
          {copied ? (
            <>
              <Check className="w-6 h-6" />
              Copiado! Agora cole no SQL Editor
            </>
          ) : (
            <>
              <Copy className="w-6 h-6" />
              Copiar SQL completo ({Math.round(SQL.length / 1024)} KB)
            </>
          )}
        </button>

        <a
          href={SUPABASE_SQL_EDITOR}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="open-supabase-btn"
          className="w-full rounded-3xl py-4 text-base font-bold flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 text-white transition-all active:scale-[0.98]"
        >
          <ExternalLink className="w-5 h-5" />
          Abrir Supabase SQL Editor
        </a>

        <div className="bg-white border border-stone-100 rounded-3xl overflow-hidden">
          <div className="px-5 py-3 border-b border-stone-100 flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-widest font-bold text-stone-500">SQL (preview)</p>
            <span className="text-[10px] font-bold text-stone-400">{SQL.split("\n").length} linhas</span>
          </div>
          <pre
            data-testid="sql-preview"
            className="text-[11px] leading-relaxed p-4 overflow-auto max-h-[50vh] font-mono text-stone-700 bg-stone-50"
          >
            {SQL}
          </pre>
        </div>

        <p className="text-center text-xs text-stone-400 font-medium">
          Essa página é só de setup. Pode deletar a rota <code className="bg-stone-100 px-1.5 py-0.5 rounded">/setup-sql</code> depois.
        </p>
      </main>
    </div>
  );
}
