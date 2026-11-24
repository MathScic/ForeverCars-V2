-- Données internes d'un véhicule (prix d'achat, remise en état) : séparées des véhicules pour
-- qu'aucune lecture du site ne puisse les atteindre. Réservées à l'admin (règle RLS à écrire).
create table public.vehicle_costs (
  vehicle_id uuid primary key references public.vehicles (id) on delete cascade,
  purchase_price numeric(10, 2) check (purchase_price >= 0),
  repair_cost numeric(10, 2) not null default 0 check (repair_cost >= 0),
  updated_at timestamptz not null default now(),
  revision integer not null default 1
);

create trigger vehicle_costs_set_updated_at
  before update on public.vehicle_costs
  for each row execute function private.set_updated_at();
create trigger vehicle_costs_bump_revision
  before update on public.vehicle_costs
  for each row execute function private.bump_revision();

alter table public.vehicle_costs enable row level security;

-- Aucun droit pour anon (le site) : même une erreur de règle RLS ne pourrait rien lui montrer.
grant select, insert, update, delete on public.vehicle_costs to authenticated;
grant select, insert, update, delete on public.vehicle_costs to service_role;
