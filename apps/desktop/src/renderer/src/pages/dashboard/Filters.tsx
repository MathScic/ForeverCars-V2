import { Search } from "lucide-react";
import type { VehicleStatus } from "../../demo/types";

export type StatusFilter = "all" | VehicleStatus;

const options: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "online", label: "En ligne" },
  { value: "reserved", label: "Réservés" },
  { value: "draft", label: "Brouillons" },
  { value: "sold", label: "Vendus" },
];

interface Props {
  status: StatusFilter;
  onStatus: (s: StatusFilter) => void;
  query: string;
  onQuery: (q: string) => void;
  counts: Record<StatusFilter, number>;
}

// Puces de filtre du site : contour fin, la puce choisie passe en ivoire.
export default function Filters({ status, onStatus, query, onQuery, counts }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par statut">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            aria-pressed={status === o.value}
            onClick={() => onStatus(o.value)}
            className={`h-11 rounded-sm border px-4 text-[13px] font-medium transition-colors duration-300 ${
              status === o.value ? "border-ivory bg-ivory text-carbon" : "border-line-strong text-silver hover:border-silver hover:text-ivory"
            }`}
          >
            {o.label} <span className="ml-1 tabular-nums opacity-70">{counts[o.value]}</span>
          </button>
        ))}
      </div>
      <label className="relative w-full max-w-xs">
        <span className="sr-only">Rechercher</span>
        <Search size={15} aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 text-silver" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Marque, modèle, n° de dossier…"
          className="h-11 w-full rounded-sm border border-line-strong bg-transparent pl-10 pr-4 text-sm transition-colors placeholder:text-silver/60 hover:border-silver focus:border-orange focus:outline-none"
        />
      </label>
    </div>
  );
}
