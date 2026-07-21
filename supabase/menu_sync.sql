create table if not exists public.shared_menu (
  id text primary key,
  products jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create or replace function public.touch_shared_menu_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists shared_menu_set_updated_at on public.shared_menu;

create trigger shared_menu_set_updated_at
before update on public.shared_menu
for each row
execute function public.touch_shared_menu_updated_at();

alter table public.shared_menu enable row level security;

drop policy if exists "shared_menu_select_public" on public.shared_menu;
create policy "shared_menu_select_public"
on public.shared_menu
for select
to anon, authenticated
using (true);

drop policy if exists "shared_menu_write_public" on public.shared_menu;
create policy "shared_menu_write_public"
on public.shared_menu
for insert
to anon, authenticated
with check (true);

drop policy if exists "shared_menu_update_public" on public.shared_menu;
create policy "shared_menu_update_public"
on public.shared_menu
for update
to anon, authenticated
using (true)
with check (true);
