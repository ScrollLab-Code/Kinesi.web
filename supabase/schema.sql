create table if not exists public.leads (
  id bigint generated always as identity primary key,
  name text not null,
  lastname text not null,
  email text not null,
  phone text not null,
  career text not null,
  result text,
  answers text,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

drop policy if exists "Anyone can create leads" on public.leads;
create policy "Anyone can create leads"
on public.leads
for insert
to anon, authenticated
with check (true);

create table if not exists public.community_posts (
  id bigint generated always as identity primary key,
  title text not null,
  body text not null,
  tag text not null default 'Recursos',
  author text not null default 'Nuevo estudiante',
  votes integer not null default 1,
  comments integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.community_posts enable row level security;

drop policy if exists "Anyone can read community posts" on public.community_posts;
create policy "Anyone can read community posts"
on public.community_posts
for select
to anon, authenticated
using (true);

drop policy if exists "Anyone can create community posts" on public.community_posts;
create policy "Anyone can create community posts"
on public.community_posts
for insert
to anon, authenticated
with check (true);

drop policy if exists "Anyone can update community votes" on public.community_posts;
create policy "Anyone can update community votes"
on public.community_posts
for update
to anon, authenticated
using (true)
with check (true);

insert into public.community_posts (title, body, tag, author, votes, comments)
select *
from (
  values
    (
      'No llego con Anatomia, como priorizo?',
      'Tengo parcial en 8 dias y estoy entre locomotor y neuro. Busco orden para no estudiar todo al mismo nivel.',
      'Medicina',
      'SofiMed',
      42,
      18
    ),
    (
      'Plantilla para preparar finales orales',
      'Comparto una estructura que me sirvio: mapa de bolillas, preguntas frecuentes y practica con timer.',
      'Recursos',
      'Fran',
      31,
      9
    ),
    (
      'Como estudiar matematica sin copiar ejercicios?',
      'Me sale mirar la resolucion y siento que entiendo, pero despues no puedo resolver solo.',
      'Ingenieria',
      'Lautaro',
      27,
      14
    )
) as seed(title, body, tag, author, votes, comments)
where not exists (
  select 1 from public.community_posts
);
