import type { DemoVehicle } from "../demo/types";
import { docProgress } from "./catalog";

interface Props {
  vehicles: DemoVehicle[];
  selectedId?: string;
  onSelect: (id: string) => void;
  query: string;
  onQuery: (q: string) => void;
}

// Colonne de gauche de la maquette : recherche + véhicules avec l'avancement du dossier (2/7).
export default function DocVehicleList({ vehicles, selectedId, onSelect, query, onQuery }: Props) {
  return (
    <div className="overflow-hidden rounded-md border border-line">
      <label className="block border-b border-line">
        <span className="sr-only">Rechercher un véhicule</span>
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Rechercher un véhicule…"
          className="h-12 w-full bg-transparent px-4 text-sm placeholder:text-silver/60 focus:outline-none focus-visible:bg-graphite"
        />
      </label>
      <ul className="max-h-[640px] overflow-y-auto">
        {vehicles.map((v) => {
          const { done, total } = docProgress(v.documents);
          const active = v.id === selectedId;
          return (
            <li key={v.id}>
              <button
                type="button"
                aria-current={active ? "true" : undefined}
                onClick={() => onSelect(v.id)}
                className={`flex w-full items-center gap-3 border-b border-l-2 border-b-line px-3 py-3 text-left transition-colors ${active ? "border-l-orange bg-graphite" : "border-l-transparent hover:bg-graphite"}`}
              >
                <span className="aspect-[4/3] w-14 shrink-0 overflow-hidden rounded-sm bg-graphite-2">
                  {v.photos[0] && <img src={v.photos[0].url} alt="" className="h-full w-full object-cover" />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="fc-model block truncate text-[11px]">
                    {v.brand} {v.model}
                  </span>
                  <span className="mt-1 block font-mono text-[11px] text-silver">{v.fileNumber}</span>
                </span>
                <span className={`text-xs tabular-nums ${done === total ? "text-success" : "text-silver"}`}>
                  {done}/{total}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {vehicles.length === 0 && <p className="p-6 text-center text-sm text-silver">Aucun véhicule.</p>}
    </div>
  );
}
