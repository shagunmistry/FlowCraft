-- feedback: add created_at, user_id, contact_email
alter table public.feedback
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists user_id uuid references auth.users(id) on delete set null,
  add column if not exists contact_email text;

-- backfill: existing `email` column holds Supabase user UUIDs, not emails
update public.feedback
   set user_id = email::uuid
 where user_id is null
   and email ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';

create index if not exists feedback_created_at_idx
  on public.feedback (created_at desc);
create index if not exists feedback_user_id_idx
  on public.feedback (user_id);

-- support: align with what /api/support already writes
alter table public.support
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists support_created_at_idx
  on public.support (created_at desc);
