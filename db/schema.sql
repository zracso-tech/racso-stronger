-- ============================================================
-- RACSO Stronger — Schema Supabase
-- ============================================================
-- Ejecutar este script en el SQL Editor de Supabase, en orden.
-- Requiere que ya exista un usuario en Auth (creado desde el
-- dashboard: Authentication > Users > Add user > email/password).
-- ============================================================

-- 1. Borrar tabla anterior (datos del programa de 8 semanas) ----
drop table if exists public.entrenos cascade;
drop table if exists public.cardio cascade;
drop table if exists public.crossfit cascade;

-- 2. Tabla entrenos: una fila por (ejercicio, fecha) -----------
create table public.entrenos (
  id          bigserial primary key,
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  fecha       date not null default current_date,
  dia         text not null check (dia in ('L','M','X','J','V')),
  ejercicio_id text not null,
  peso        numeric,
  nota        text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index entrenos_user_fecha_idx on public.entrenos (user_id, fecha desc);
create index entrenos_user_ej_idx    on public.entrenos (user_id, ejercicio_id, fecha desc);

-- 3. Tabla cardio: una fila por sesión (puede haber varias/día) -
create table public.cardio (
  id          bigserial primary key,
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  fecha       date not null default current_date,
  tipo        text not null check (tipo in ('bici','cinta_andar','cinta_correr')),
  minutos     int,
  km          numeric,
  kcal        int,
  nota        text,
  created_at  timestamptz not null default now()
);

create index cardio_user_fecha_idx on public.cardio (user_id, fecha desc);

-- 4. Tabla crossfit: máximo 1 por día ---------------------------
create table public.crossfit (
  id          bigserial primary key,
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  fecha       date not null default current_date,
  nota        text,
  created_at  timestamptz not null default now(),
  unique (user_id, fecha)
);

create index crossfit_user_fecha_idx on public.crossfit (user_id, fecha desc);

-- 5. Trigger para mantener updated_at en entrenos ---------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger entrenos_touch_updated_at
  before update on public.entrenos
  for each row
  execute function public.touch_updated_at();

-- ============================================================
-- 6. Row Level Security
-- ============================================================
alter table public.entrenos enable row level security;
alter table public.cardio   enable row level security;
alter table public.crossfit enable row level security;

-- entrenos: cada usuario solo accede a sus filas
create policy "entrenos_own_select" on public.entrenos
  for select using (auth.uid() = user_id);
create policy "entrenos_own_insert" on public.entrenos
  for insert with check (auth.uid() = user_id);
create policy "entrenos_own_update" on public.entrenos
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "entrenos_own_delete" on public.entrenos
  for delete using (auth.uid() = user_id);

-- cardio
create policy "cardio_own_select" on public.cardio
  for select using (auth.uid() = user_id);
create policy "cardio_own_insert" on public.cardio
  for insert with check (auth.uid() = user_id);
create policy "cardio_own_update" on public.cardio
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "cardio_own_delete" on public.cardio
  for delete using (auth.uid() = user_id);

-- crossfit
create policy "crossfit_own_select" on public.crossfit
  for select using (auth.uid() = user_id);
create policy "crossfit_own_insert" on public.crossfit
  for insert with check (auth.uid() = user_id);
create policy "crossfit_own_update" on public.crossfit
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "crossfit_own_delete" on public.crossfit
  for delete using (auth.uid() = user_id);
