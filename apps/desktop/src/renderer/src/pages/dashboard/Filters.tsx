import { Search } from "lucide-react";
import type { VehicleStatus } from "../../demo/types";

export type StatusFilter = "all" | VehicleStatus;

const options: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "online", label: "En ligne" },
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
            className={`h-11 px-4 rounded-full text-sm transition-colors ${
              status === o.value
                ? "bg-brand-orange text-brand-black font-semibold"
                : "bg-brand-black border border-brand-gray-medium/40 text-brand-gray-light hover:border-brand-orange/50"
            }`}
          >
            {o.label} <span className="opacity-60 tabular-nums">{counts[o.value]}</span>
          </button>
        ))}
      </div>
      <label className="relative w-full max-w-sm">
        <span className="sr-only">Rechercher</span>
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray-light/50" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Marque, modèle, plaque…"
          className="w-full h-11 pl-11 pr-4 rounded-full bg-brand-black border border-brand-gray-medium/40 text-sm placeholder:text-brand-gray-light/40 focus:border-brand-orange focus:outline-none"
        />
      </label>
    </div>
  );
}
