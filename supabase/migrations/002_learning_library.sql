-- ATLAS Academic v2: biblioteca, atividades, anotações e arquivos pessoais.
-- Execute no SQL Editor do projeto Supabase do ATLAS depois do schema.sql original.

create table if not exists public.learning_resources (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete cascade,
  title text not null,
  author text not null default '',
  institution text not null default '',
  resource_type text not null check (resource_type in ('pdf','article','book','video','legislation','link')),
  description text not null default '',
  topic text not null default '',
  source_url text,
  storage_path text,
  access_level text not null default 'private' check (access_level in ('private','public')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint resource_has_location check (source_url is not null or storage_path is not null)
);

create table if not exists public.lesson_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_slug text not null,
  title text not null default 'Anotação de estudo',
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_activity_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_slug text not null,
  activity_type text not null check (activity_type in ('quiz','flashcard','case_study','reflection')),
  score numeric(5,2) check (score between 0 and 100),
  response jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now()
);

create table if not exists public.resource_bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resource_id uuid not null references public.learning_resources(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, resource_id)
);

alter table public.learning_resources enable row level security;
alter table public.lesson_notes enable row level security;
alter table public.learning_activity_attempts enable row level security;
alter table public.resource_bookmarks enable row level security;

create policy "resources_read_public_or_own" on public.learning_resources
for select using (access_level = 'public' or auth.uid() = owner_id);
create policy "resources_insert_own" on public.learning_resources
for insert with check (auth.uid() = owner_id and access_level = 'private');
create policy "resources_update_own" on public.learning_resources
for update using (auth.uid() = owner_id) with check (auth.uid() = owner_id and access_level = 'private');
create policy "resources_delete_own" on public.learning_resources
for delete using (auth.uid() = owner_id);

create policy "lesson_notes_own_all" on public.lesson_notes
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "activity_attempts_own_all" on public.learning_activity_attempts
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "resource_bookmarks_own_all" on public.resource_bookmarks
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Bucket privado para PDFs e arquivos pessoais enviados pelo estudante.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('atlas-library', 'atlas-library', false, 52428800,
  array['application/pdf','application/epub+zip','text/plain','image/png','image/jpeg'])
on conflict (id) do nothing;

create policy "atlas_library_read_own" on storage.objects
for select using (bucket_id = 'atlas-library' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "atlas_library_upload_own" on storage.objects
for insert with check (bucket_id = 'atlas-library' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "atlas_library_update_own" on storage.objects
for update using (bucket_id = 'atlas-library' and auth.uid()::text = (storage.foldername(name))[1])
with check (bucket_id = 'atlas-library' and auth.uid()::text = (storage.foldername(name))[1]);
create policy "atlas_library_delete_own" on storage.objects
for delete using (bucket_id = 'atlas-library' and auth.uid()::text = (storage.foldername(name))[1]);
