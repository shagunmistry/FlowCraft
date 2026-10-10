-- support: lock down spam. The /api/support route now inserts with the
-- service-role key, so anon/authenticated roles need no direct access.
-- APPLY TOGETHER WITH the route deploy, or the contact form will break.

alter table public.support
  add column if not exists ip_hash text;

create index if not exists support_ip_hash_created_idx
  on public.support (ip_hash, created_at desc);
create index if not exists support_email_created_idx
  on public.support (email, created_at desc);

alter table public.support enable row level security;

-- Remove every existing policy (live policies are not tracked in the repo).
do $$
declare p record;
begin
  for p in select policyname from pg_policies
           where schemaname = 'public' and tablename = 'support'
  loop
    execute format('drop policy %I on public.support', p.policyname);
  end loop;
end $$;

-- NOT VALID: enforce on new rows without failing on existing spam rows.
alter table public.support
  add constraint support_message_len
    check (message is null or char_length(message) between 5 and 5000) not valid,
  add constraint support_name_len
    check (char_length(firstname) <= 100 and char_length(lastname) <= 100) not valid,
  add constraint support_email_fmt
    check (email is null or email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$') not valid,
  add constraint support_rating_range
    check (rating is null or rating between 0 and 5) not valid;

-- Read-only: review suspected spam rows before deleting anything.
-- select id, firstname, lastname, email, message, created_at
--   from public.support
--  where message ~ '^\d{6,}$'
--     or (firstname ~ '^[A-Za-z]{15,}$' and lastname ~ '^[A-Za-z]{15,}$')
--  order by id desc;
--
-- select email, message, count(*) from public.support
--  group by 1, 2 having count(*) > 1 order by 3 desc;
