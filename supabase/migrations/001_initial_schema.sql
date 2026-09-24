create type public.user_role as enum ('masyarakat', 'petugas', 'admin');
create type public.report_status as enum ('pending', 'diproses', 'selesai', 'ditolak');

create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, full_name text, role public.user_role not null default 'masyarakat', created_at timestamptz not null default now());
create table public.categories (id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique, created_at timestamptz not null default now());
create table public.reports (id uuid primary key default gen_random_uuid(), user_id uuid not null references public.profiles(id), category_id uuid not null references public.categories(id), title text not null, description text not null, address text not null, image_path text, status public.report_status not null default 'pending', is_public boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now());
create table public.report_responses (id uuid primary key default gen_random_uuid(), report_id uuid not null references public.reports(id) on delete cascade, responder_id uuid not null references public.profiles(id), message text not null, created_at timestamptz not null default now());

create or replace function public.is_admin_or_officer() returns boolean language sql security definer set search_path = public stable as $$ select exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'petugas')); $$;
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$ begin insert into public.profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email)); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security; alter table public.categories enable row level security; alter table public.reports enable row level security; alter table public.report_responses enable row level security;
create policy "profiles own or staff read" on public.profiles for select using (id = auth.uid() or public.is_admin_or_officer());
create policy "staff update profiles" on public.profiles for update using (public.is_admin_or_officer());
create policy "categories public read" on public.categories for select using (true);
create policy "reports public feed" on public.reports for select using (is_public = true or user_id = auth.uid() or public.is_admin_or_officer());
create policy "users create own reports" on public.reports for insert with check (user_id = auth.uid());
create policy "users update own reports" on public.reports for update using (user_id = auth.uid() or public.is_admin_or_officer()) with check (user_id = auth.uid() or public.is_admin_or_officer());
create policy "staff delete reports" on public.reports for delete using (public.is_admin_or_officer());
create policy "responses visible to report viewers" on public.report_responses for select using (exists (select 1 from public.reports where id = report_id and (is_public or user_id = auth.uid() or public.is_admin_or_officer())));
create policy "staff create responses" on public.report_responses for insert with check (public.is_admin_or_officer() and responder_id = auth.uid());

insert into public.categories (name, slug) values ('Infrastruktur', 'infrastruktur'), ('Layanan Publik', 'layanan-publik'), ('Kebersihan', 'kebersihan'), ('Keamanan', 'keamanan') on conflict (slug) do nothing;
insert into storage.buckets (id, name, public) values ('report-attachments', 'report-attachments', false) on conflict (id) do nothing;
create policy "users upload report attachments" on storage.objects for insert to authenticated with check (bucket_id = 'report-attachments' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "users view report attachments" on storage.objects for select to authenticated using (bucket_id = 'report-attachments' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin_or_officer()));