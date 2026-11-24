-- Journal d'activité (« Mis en ligne : Peugeot 2008 »…) : on y ajoute des lignes, on ne les modifie
-- ni ne les supprime jamais. Lecture réservée à l'admin (règle RLS à écrire).
create table public.activity_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles (id) on delete set null,
  action text not null,
  entity text not null,
  entity_id uuid,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index activity_log_actor_id_idx on public.activity_log (actor_id);
create index activity_log_created_at_idx on public.activity_log (created_at desc);

alter table public.activity_log enable row level security;

-- Pas de droit UPDATE ni DELETE, pour personne, même via l'API : le journal ne peut pas être réécrit.
grant select, insert on public.activity_log to authenticated;
grant select, insert on public.activity_log to service_role;
