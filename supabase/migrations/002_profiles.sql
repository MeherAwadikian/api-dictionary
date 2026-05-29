-- Run in: https://supabase.com/dashboard/project/xbcmhxmktmuagkvviuac/sql/new

create table if not exists user_profiles (
  id                   uuid primary key references auth.users(id) on delete cascade,
  email                text not null,
  trial_start          timestamptz default now(),
  paid                 boolean default false,
  payment_tx           text,
  payment_verified_at  timestamptz,
  created_at           timestamptz default now()
);

alter table user_profiles enable row level security;

create policy "user read own profile"
  on user_profiles for select
  using (auth.uid() = id);

create policy "user update own profile"
  on user_profiles for update
  using (auth.uid() = id);

create policy "insert on signup"
  on user_profiles for insert
  with check (true);

-- auto-create profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
