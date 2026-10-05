-- ============================================================
-- Eco Clean Expert — Schéma initial Supabase (étape 2)
-- ============================================================

-- Document de contenu du site (source de vérité de l'admin)
create table if not exists public.site_content (
  id int primary key default 1,
  doc jsonb not null,
  updated_at timestamptz not null default now(),
  constraint site_content_singleton check (id = 1)
);

-- Tables normalisées (modèle de lecture, utilisées par les futures pages SEO / API)
create table if not exists public.services (
  id bigint primary key,
  icon text not null,
  title text not null,
  description text not null default '',
  price text not null default '',
  image text not null default '',
  active boolean not null default true,
  position int not null default 0
);

create table if not exists public.before_after (
  id bigint primary key,
  title text not null,
  description text not null default '',
  before_image text not null default '',
  after_image text not null default '',
  active boolean not null default true,
  position int not null default 0
);

create table if not exists public.testimonials (
  id bigint primary key,
  name text not null,
  role text not null default '',
  text text not null default '',
  rating int not null default 5,
  photo text not null default '',
  active boolean not null default true,
  position int not null default 0
);

create table if not exists public.zones (
  id bigint primary key,
  name text not null,
  active boolean not null default true,
  position int not null default 0
);

create table if not exists public.faq_items (
  id bigint primary key,
  question text not null,
  answer text not null,
  active boolean not null default true,
  position int not null default 0
);

create table if not exists public.stats (
  id bigint primary key,
  icon text not null default 'trend',
  label text not null,
  value numeric not null default 0,
  suffix text not null default '',
  active boolean not null default true,
  position int not null default 0
);

-- Demandes de devis (formulaire public → lecture admin)
create table if not exists public.requests (
  id bigint generated always as identity primary key,
  name text not null,
  phone text not null,
  email text not null default '',
  service text not null default '',
  commune text not null default '',
  message text not null default '',
  status text not null default 'Nouveau',
  created_at timestamptz not null default now()
);

-- Médiathèque (métadonnées ; les fichiers sont dans le bucket "media")
create table if not exists public.media (
  id bigint primary key,
  name text not null,
  path text not null,
  size int not null default 0,
  created_at timestamptz not null default now()
);

-- Contenus légaux normalisés (mentions / privacy / company)
create table if not exists public.legal_content (
  id text primary key,
  doc jsonb not null,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- RLS
-- ============================================================
alter table public.site_content enable row level security;
alter table public.services enable row level security;
alter table public.before_after enable row level security;
alter table public.testimonials enable row level security;
alter table public.zones enable row level security;
alter table public.faq_items enable row level security;
alter table public.stats enable row level security;
alter table public.requests enable row level security;
alter table public.media enable row level security;
alter table public.legal_content enable row level security;

-- Lecture publique des contenus publiables ; écriture réservée aux admins authentifiés
do $$
declare t text;
begin
  foreach t in array array['site_content','services','before_after','testimonials','zones','faq_items','stats','media','legal_content'] loop
    execute format('create policy %I on public.%I for select using (true)', t || '_read', t);
    execute format('create policy %I on public.%I for all to authenticated using (true) with check (true)', t || '_admin_write', t);
  end loop;
end $$;

-- Demandes : insertion publique (formulaire), lecture/écriture admin uniquement
create policy requests_insert on public.requests for insert with check (true);
create policy requests_admin on public.requests for all to authenticated using (true) with check (true);

-- ============================================================
-- Storage : buckets publics en lecture, écriture authentifiée
-- ============================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true), ('site', 'site', true),
       ('services', 'services', true), ('before-after', 'before-after', true),
       ('testimonials', 'testimonials', true)
on conflict (id) do nothing;

create policy media_public_read on storage.objects for select
  using (bucket_id in ('media','site','services','before-after','testimonials'));
create policy media_admin_write on storage.objects for all to authenticated
  using (bucket_id in ('media','site','services','before-after','testimonials'))
  with check (bucket_id in ('media','site','services','before-after','testimonials'));
