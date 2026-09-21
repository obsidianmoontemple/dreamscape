-- =====================================================================
-- Dream Walker's Atlas — Supabase schema, version 1
-- Paste the whole file into the SQL Editor and run it once.
-- It is safe to run again; everything is created only if missing.
--
-- The rules this schema enforces, in the database itself:
--   * nothing is reachable from a web page unless granted below
--   * every table has row-level security on
--   * a dreamer sees only their own rows
--   * the admin sees messages, orders, accounts and research summaries —
--     and never a dream: synced dreamscapes are stored encrypted, and the
--     admin has no access to that table at all
--   * research summaries carry no account: they cannot be traced back
--     to the dreamer who sent them
-- =====================================================================


-- ---------------------------------------------------------------------
-- 1. Who administers. Nobody reads this table through the API;
--    it is consulted only by is_admin().
-- ---------------------------------------------------------------------
create table if not exists public.admins (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  added_at timestamptz not null default now()
);
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = ''
as $$ select exists(select 1 from public.admins a where a.user_id = auth.uid()) $$;

revoke execute on function public.is_admin() from public, anon;
grant  execute on function public.is_admin() to authenticated;


-- ---------------------------------------------------------------------
-- 2. Profiles. One per account, made automatically at sign-up.
--    A dreamer may change their own consents and display name.
--    Plans are set only by the admin, through admin_set_plan().
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  created_at       timestamptz not null default now(),
  display_name     text check (char_length(display_name) <= 80),
  plan             text not null default 'free',
  plan_until       timestamptz,
  research_consent boolean not null default false,
  research_since   timestamptz,
  shared_consent   boolean not null default false
);
alter table public.profiles enable row level security;

drop policy if exists "own profile: read" on public.profiles;
create policy "own profile: read" on public.profiles
  for select to authenticated using (id = (select auth.uid()));

drop policy if exists "own profile: change" on public.profiles;
create policy "own profile: change" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));

drop policy if exists "admin: read profiles" on public.profiles;
create policy "admin: read profiles" on public.profiles
  for select to authenticated using ((select public.is_admin()));

grant select on public.profiles to authenticated;
grant update (display_name, research_consent, research_since, shared_consent) on public.profiles to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end $$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- anyone who signed up before this ran still gets a profile
insert into public.profiles (id) select id from auth.users on conflict (id) do nothing;


-- ---------------------------------------------------------------------
-- 3. The vault. A dreamer's whole dreamscape, encrypted on their own
--    device before upload. The key never leaves the device. There is
--    deliberately no admin policy here: the admin page cannot read it.
-- ---------------------------------------------------------------------
create table if not exists public.vault (
  user_id    uuid primary key references auth.users(id) on delete cascade default auth.uid(),
  updated_at timestamptz not null default now(),
  version    integer not null default 1,
  cipher     text not null,
  iv         text not null,
  salt       text not null,
  bytes      integer
);
alter table public.vault enable row level security;

drop policy if exists "own vault" on public.vault;
create policy "own vault" on public.vault
  for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

grant select, insert, update, delete on public.vault to authenticated;


-- ---------------------------------------------------------------------
-- 4. Messages: Ask a Dream Walker, and support.
--    A dreamer writes and can withdraw their own; only the admin replies.
--    The dreamer chooses what goes in "attachments" — the dream itself,
--    book passages, their dreamer record — and sees it before sending.
-- ---------------------------------------------------------------------
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade default auth.uid(),
  kind        text not null check (kind in ('dreamwalker','support')),
  subject     text check (char_length(subject) <= 200),
  body        text not null check (char_length(body) between 1 and 20000),
  attachments jsonb not null default '{}'::jsonb check (pg_column_size(attachments) <= 200000),
  status      text not null default 'new' check (status in ('new','read','replied','closed')),
  reply       text check (char_length(reply) <= 20000),
  replied_at  timestamptz,
  created_at  timestamptz not null default now()
);
alter table public.messages enable row level security;

drop policy if exists "own messages: send" on public.messages;
create policy "own messages: send" on public.messages
  for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists "own messages: read" on public.messages;
create policy "own messages: read" on public.messages
  for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "own messages: withdraw" on public.messages;
create policy "own messages: withdraw" on public.messages
  for delete to authenticated using (user_id = (select auth.uid()));
drop policy if exists "admin: read messages" on public.messages;
create policy "admin: read messages" on public.messages
  for select to authenticated using ((select public.is_admin()));
drop policy if exists "admin: answer messages" on public.messages;
create policy "admin: answer messages" on public.messages
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

grant select, delete on public.messages to authenticated;
grant insert (kind, subject, body, attachments) on public.messages to authenticated;
grant update (status, reply, replied_at) on public.messages to authenticated;

create index if not exists messages_by_status on public.messages (status, created_at desc);
create index if not exists messages_by_user   on public.messages (user_id, created_at desc);


-- ---------------------------------------------------------------------
-- 5. Orders: the printed Atlas and anything else that ships.
--    Payment happens on the Temple site; payment_ref records it.
-- ---------------------------------------------------------------------
create table if not exists public.orders (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete set null default auth.uid(),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  item         text not null check (char_length(item) <= 120),
  status       text not null default 'requested'
               check (status in ('requested','paid','printing','shipped','delivered','cancelled')),
  payment_ref  text check (char_length(payment_ref) <= 200),
  ship_name    text check (char_length(ship_name) <= 200),
  ship_address jsonb,
  tracking     text check (char_length(tracking) <= 200),
  notes        text check (char_length(notes) <= 4000)
);
alter table public.orders enable row level security;

drop policy if exists "own orders: place" on public.orders;
create policy "own orders: place" on public.orders
  for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists "own orders: read" on public.orders;
create policy "own orders: read" on public.orders
  for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists "admin: read orders" on public.orders;
create policy "admin: read orders" on public.orders
  for select to authenticated using ((select public.is_admin()));
drop policy if exists "admin: manage orders" on public.orders;
create policy "admin: manage orders" on public.orders
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

grant select on public.orders to authenticated;
grant insert (item, ship_name, ship_address) on public.orders to authenticated;
grant update (status, payment_ref, tracking, notes, updated_at) on public.orders to authenticated;

create index if not exists orders_by_status on public.orders (status, created_at desc);


-- ---------------------------------------------------------------------
-- 6. App settings, the same for every dreamer, set by the admin.
--    Readable by anyone, including the app before sign-in.
-- ---------------------------------------------------------------------
create table if not exists public.app_config (
  key        text primary key check (key ~ '^[a-z_]{1,60}$'),
  value      jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.app_config enable row level security;

drop policy if exists "anyone: read settings" on public.app_config;
create policy "anyone: read settings" on public.app_config
  for select to anon, authenticated using (true);
drop policy if exists "admin: write settings" on public.app_config;
create policy "admin: write settings" on public.app_config
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

grant select on public.app_config to anon, authenticated;
grant insert, update, delete on public.app_config to authenticated;

insert into public.app_config (key, value) values
  ('miller_released',   '[]'::jsonb),
  ('announcement',      'null'::jsonb),
  ('dreamwalker_open',  'true'::jsonb),
  ('plans',             '["free","member"]'::jsonb),
  ('research_threshold','5'::jsonb)
on conflict (key) do nothing;


-- ---------------------------------------------------------------------
-- 7. Research summaries. No account is stored: research_id is a random
--    value chosen on the dreamer's own device. The server stamps the
--    time it arrived, which is what makes a later match credible.
--    Only submit_research() can add rows, and only from a dreamer who has
--    agreed; only fields on the whitelist are accepted.
-- ---------------------------------------------------------------------
create table if not exists public.research_summaries (
  id          bigint generated always as identity primary key,
  research_id uuid not null,
  received_at timestamptz not null default now(),
  night_of    date,
  events      text[] not null default '{}',
  forms       text[] not null default '{}',
  feelings    text[] not null default '{}',
  lucidity    smallint not null default 0 check (lucidity between 0 and 4),
  region      text
);
alter table public.research_summaries enable row level security;

drop policy if exists "admin: read research" on public.research_summaries;
create policy "admin: read research" on public.research_summaries
  for select to authenticated using ((select public.is_admin()));
grant select on public.research_summaries to authenticated;

create index if not exists research_by_time on public.research_summaries (received_at desc);

create or replace function public.submit_research(
  p_research_id uuid, p_night_of date, p_events text[], p_forms text[], p_feelings text[], p_lucidity smallint)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  allowed text[] := array['fire','flood','collapse','crash','storm','earthquake','explosion',
                          'illness','death','conflict','falling','pursuit','darkness','crowd'];
begin
  if auth.uid() is null then raise exception 'sign in first'; end if;
  if not exists (select 1 from public.profiles p where p.id = auth.uid() and p.research_consent) then
    raise exception 'research sharing is not turned on for this account';
  end if;
  if not (coalesce(p_events,'{}') <@ allowed) then raise exception 'unknown event type'; end if;
  if cardinality(coalesce(p_forms,'{}')) > 60 or cardinality(coalesce(p_feelings,'{}')) > 12 then
    raise exception 'too many items';
  end if;
  if exists (select 1 from unnest(coalesce(p_forms,'{}')) f where f !~ '^[a-z]{1,30}$')
     or exists (select 1 from unnest(coalesce(p_feelings,'{}')) f where f !~ '^[a-z ]{1,30}$') then
    raise exception 'only simple words are accepted';
  end if;
  if p_night_of is not null and (p_night_of > current_date + 1 or p_night_of < current_date - 3650) then
    raise exception 'implausible date';
  end if;
  insert into public.research_summaries (research_id, night_of, events, forms, feelings, lucidity)
  values (p_research_id, p_night_of, coalesce(p_events,'{}'), coalesce(p_forms,'{}'),
          coalesce(p_feelings,'{}'), greatest(0, least(4, coalesce(p_lucidity,0))));
end $$;
revoke execute on function public.submit_research(uuid,date,text[],text[],text[],smallint) from public, anon;
grant  execute on function public.submit_research(uuid,date,text[],text[],text[],smallint) to authenticated;

-- a dreamer who turns research off can take back everything they sent;
-- only their own device knows their research_id
create or replace function public.withdraw_research(p_research_id uuid)
returns integer
language plpgsql security definer set search_path = ''
as $$
declare n integer;
begin
  if auth.uid() is null then raise exception 'sign in first'; end if;
  delete from public.research_summaries where research_id = p_research_id;
  get diagnostics n = row_count;
  return n;
end $$;
revoke execute on function public.withdraw_research(uuid) from public, anon;
grant  execute on function public.withdraw_research(uuid) to authenticated;


-- ---------------------------------------------------------------------
-- 8. Admin functions. Each checks is_admin() itself.
-- ---------------------------------------------------------------------

-- the dreamers list: accounts and plans only, never dreams
create or replace function public.admin_list_dreamers()
returns table (id uuid, email text, created_at timestamptz, last_sign_in_at timestamptz,
               plan text, plan_until timestamptz, research_consent boolean)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.is_admin() then raise exception 'not an admin'; end if;
  return query
    select u.id, u.email::text, u.created_at, u.last_sign_in_at,
           coalesce(p.plan,'free'), p.plan_until, coalesce(p.research_consent,false)
    from auth.users u left join public.profiles p on p.id = u.id
    order by u.created_at desc;
end $$;
revoke execute on function public.admin_list_dreamers() from public, anon;
grant  execute on function public.admin_list_dreamers() to authenticated;

create or replace function public.admin_set_plan(p_user uuid, p_plan text, p_until timestamptz)
returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.is_admin() then raise exception 'not an admin'; end if;
  if p_plan is null or p_plan !~ '^[a-z_]{1,30}$' then raise exception 'bad plan name'; end if;
  update public.profiles set plan = p_plan, plan_until = p_until where id = p_user;
end $$;
revoke execute on function public.admin_set_plan(uuid,text,timestamptz) from public, anon;
grant  execute on function public.admin_set_plan(uuid,text,timestamptz) to authenticated;

-- the email of whoever sent a message, so a reply can reach them
create or replace function public.admin_message_sender(p_message uuid)
returns text
language plpgsql stable security definer set search_path = ''
as $$
declare e text;
begin
  if not public.is_admin() then raise exception 'not an admin'; end if;
  select u.email into e from public.messages m join auth.users u on u.id = m.user_id where m.id = p_message;
  return e;
end $$;
revoke execute on function public.admin_message_sender(uuid) from public, anon;
grant  execute on function public.admin_message_sender(uuid) to authenticated;


-- ---------------------------------------------------------------------
-- 9. Last step, by hand, once: make yourself the admin.
--    Put your own sign-in email in place of the example and run just
--    this line on its own (select it, then Run selected).
-- ---------------------------------------------------------------------
-- insert into public.admins (user_id) select id from auth.users where email = 'you@example.com';
