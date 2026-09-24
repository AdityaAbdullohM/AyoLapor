-- Script ini hanya untuk user yang sudah terdaftar.
-- Untuk membuat akun admin BARU, gunakan: npm run admin:create
-- SQL Editor tidak memiliki API Auth resmi untuk membuat password user baru.
do $$
declare
  target_email text := 'ganti-dengan-email-user@example.com';
  target_user_id uuid;
begin
  select id into target_user_id
  from auth.users
  where lower(email) = lower(target_email)
  limit 1;

  if target_user_id is null then
    raise exception 'User dengan email % tidak ditemukan di auth.users', target_email;
  end if;

  insert into public.profiles (id, full_name, role)
  select target_user_id, coalesce(raw_user_meta_data ->> 'full_name', email), 'admin'::public.user_role
  from auth.users
  where id = target_user_id
  on conflict (id) do update
    set role = 'admin'::public.user_role;
end;
$$;

-- Verifikasi hasil perubahan.
select
  auth.users.email,
  public.profiles.full_name,
  public.profiles.role
from auth.users
join public.profiles on public.profiles.id = auth.users.id
where lower(auth.users.email) = lower('ganti-dengan-email-user@example.com');