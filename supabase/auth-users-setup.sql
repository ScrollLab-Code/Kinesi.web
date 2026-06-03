/**
 * AUTH USERS SETUP - KINASE
 * Ejecutar en Supabase SQL Editor.
 *
 * Este script sincroniza auth.users con public.users y es tolerante a setups
 * anteriores que hayan creado la columna nombre en vez de name.
 */

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text,
  role text not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users add column if not exists email text;
alter table public.users add column if not exists name text;
alter table public.users add column if not exists role text not null default 'user';
alter table public.users add column if not exists created_at timestamptz not null default now();
alter table public.users add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'users'
      and column_name = 'nombre'
  ) then
    alter table public.users alter column nombre drop not null;
    execute 'update public.users set name = coalesce(name, nullif(nombre, '''')) where name is null';
  end if;
end $$;

alter table public.users enable row level security;

drop policy if exists "Users can read their own profile" on public.users;
create policy "Users can read their own profile"
on public.users
for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.users;
create policy "Users can update their own profile"
on public.users
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  display_name text;
begin
  display_name := coalesce(
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'full_name',
    split_part(new.email, '@', 1)
  );

  insert into public.users (id, email, name)
  values (new.id, new.email, display_name)
  on conflict (id) do update set
    email = excluded.email,
    name = coalesce(excluded.name, public.users.name),
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create index if not exists idx_users_email on public.users(email);
create index if not exists idx_users_created_at on public.users(created_at);

insert into public.users (id, email, name)
select
  id,
  email,
  coalesce(raw_user_meta_data->>'name', raw_user_meta_data->>'full_name', split_part(email, '@', 1))
from auth.users
on conflict (id) do update set
  email = excluded.email,
  name = coalesce(excluded.name, public.users.name),
  updated_at = now();

drop view if exists public.active_users;

create view public.active_users as
select id, email, name, created_at, updated_at
from public.users
where created_at >= now() - interval '90 days';

grant select on public.active_users to anon, authenticated;
grant select, insert, update on public.users to authenticated;
