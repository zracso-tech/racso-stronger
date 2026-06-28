-- Añadir "correr" (al aire libre) a los tipos de cardio permitidos
alter table public.cardio drop constraint if exists cardio_tipo_check;
alter table public.cardio add constraint cardio_tipo_check
  check (tipo in ('bici','cinta_andar','cinta_correr','correr'));
