-- ATLAS Academy — schema inicial
-- Execute em um projeto Supabase NOVO.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  accent text not null default 'slate',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects(id) on delete cascade,
  title text not null,
  description text not null default '',
  level text not null default 'Iniciante',
  estimated_minutes integer not null default 30,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  content_md text not null default '',
  sort_order integer not null default 0,
  estimated_minutes integer not null default 30,
  created_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  status text not null default 'not_started'
    check (status in ('not_started','in_progress','completed')),
  mastery_score numeric(5,2) check (mastery_score between 0 and 100),
  last_studied_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid references public.subjects(id) on delete set null,
  started_at timestamptz not null default now(),
  duration_minutes integer not null default 0 check (duration_minutes >= 0),
  reflection text not null default ''
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  title text not null,
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.study_sessions enable row level security;
alter table public.notes enable row level security;

create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "subjects_read" on public.subjects
for select using (true);
create policy "courses_read_published" on public.courses
for select using (published = true);
create policy "lessons_read_published" on public.lessons
for select using (
  exists (
    select 1 from public.courses c
    where c.id = course_id and c.published = true
  )
);

create policy "progress_own_all" on public.lesson_progress
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "sessions_own_all" on public.study_sessions
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "notes_own_all" on public.notes
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

insert into public.subjects (slug, title, description, accent, sort_order)
values
('politica-geopolitica', 'Política e geopolítica', 'Instituições, poder, relações internacionais e análise de cenários.', 'blue', 1),
('direito', 'Direito', 'Fundamentos jurídicos, Estado, direitos e raciocínio normativo.', 'gold', 2),
('tecnologia', 'Tecnologia', 'Computação, sistemas, inteligência artificial e segurança.', 'teal', 3),
('humanidades', 'História, cultura e filosofia', 'Ideias, sociedades, movimentos históricos e pensamento.', 'violet', 4),
('ciencias-exatas', 'Física e matemática', 'Modelos, lógica, quantificação e compreensão da natureza.', 'slate', 5),
('sistemas-interativos', 'Games e sistemas interativos', 'Design de sistemas, mecânicas, simulação e narrativa interativa.', 'rose', 6)
on conflict (slug) do nothing;
