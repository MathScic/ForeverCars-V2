-- Dossier administratif d'un véhicule (écran Documents) : une pièce par type au plus ;
-- remplacer une pièce = mettre à jour son fichier. Fichiers dans un bucket Storage privé.
create table public.vehicle_documents (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles (id) on delete cascade,
  doc_type public.document_type not null,
  storage_path text not null unique,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Cet index (vehicle_id, doc_type) sert aussi à la clé étrangère vehicle_id.
  constraint vehicle_documents_type_key unique (vehicle_id, doc_type)
);

create index vehicle_documents_created_by_idx on public.vehicle_documents (created_by);

create trigger vehicle_documents_set_updated_at
  before update on public.vehicle_documents
  for each row execute function private.set_updated_at();

alter table public.vehicle_documents enable row level security;

-- Jamais accessible au site.
grant select, insert, update, delete on public.vehicle_documents to authenticated;
grant select, insert, update, delete on public.vehicle_documents to service_role;
