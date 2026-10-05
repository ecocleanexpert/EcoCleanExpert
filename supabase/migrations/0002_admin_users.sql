-- 0002_admin_users.sql — multi-comptes et rôles
-- Rôles : super_admin (tout + gestion des comptes), admin (tout sauf comptes),
-- editor (contenu uniquement : services, faq, légal, médias, témoignages, zones).

create table if not exists public.admin_users (
  email text primary key,
  role text not null default 'editor' check (role in ('super_admin','admin','editor')),
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Tout utilisateur authentifié peut lire la liste (l'UI doit connaître les rôles)
drop policy if exists admin_users_select on public.admin_users;
create policy admin_users_select on public.admin_users
  for select to authenticated using (true);

-- Seul un super_admin gère les comptes
drop policy if exists admin_users_admin on public.admin_users;
create policy admin_users_admin on public.admin_users
  for all to authenticated
  using (exists (select 1 from public.admin_users u where u.email = auth.jwt() ->> 'email' and u.role = 'super_admin'))
  with check (exists (select 1 from public.admin_users u where u.email = auth.jwt() ->> 'email' and u.role = 'super_admin'));

insert into public.admin_users (email, role)
values ('admin@ecocleanexpert.ci', 'super_admin')
on conflict (email) do nothing;

-- Restreint l'écriture sur le contenu aux membres de admin_users
create or replace function public.is_admin_user()
returns boolean language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.admin_users where email = auth.jwt() ->> 'email') $$;

do $$
declare t text;
begin
  foreach t in array array['site_content','services','before_after','testimonials','zones','faq_items','stats','media','legal_content'] loop
    execute format('drop policy if exists %I on public.%I', t || '_admin_write', t);
    execute format('create policy %I on public.%I for all to authenticated using (public.is_admin_user()) with check (public.is_admin_user())', t || '_admin_write', t);
  end loop;
end $$;

-- Les demandes de devis ne sont gérables que par super_admin / admin (pas editor)
drop policy if exists requests_admin on public.requests;
create policy requests_admin on public.requests
  for all to authenticated
  using (exists (select 1 from public.admin_users u where u.email = auth.jwt() ->> 'email' and u.role in ('super_admin','admin')))
  with check (exists (select 1 from public.admin_users u where u.email = auth.jwt() ->> 'email' and u.role in ('super_admin','admin')));
