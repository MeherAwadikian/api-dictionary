-- Run this once in: https://supabase.com/dashboard/project/xbcmhxmktmuagkvviuac/sql/new

create table if not exists favorites (
  id          uuid primary key default gen_random_uuid(),
  session_id  text not null,
  api_key     text not null,
  created_at  timestamptz default now(),
  unique (session_id, api_key)
);

create index if not exists favorites_session_idx on favorites (session_id);

alter table favorites enable row level security;

create policy "allow all on own session"
  on favorites for all
  using (true)
  with check (true);
