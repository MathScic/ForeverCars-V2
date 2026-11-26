import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { formatPrice } from "@forevercars/shared";
import { useStore } from "../data/store";
import VehicleTable from "./dashboard/VehicleTable";
import { ARCHIVE_AFTER_DAYS, splitParc } from "./sold/archive";

// Page Vendus : les ventes de plus de 7 jours, sorties du parc pour le garder lisible.
export default function SoldArchive() {
  const { state, isAdmin } = useStore();
  const [query, setQuery] = useState("");
  const [now] = useState(() => Date.now());
  const { archived } = useMemo(() => splitParc(state.vehicles, now), [state.vehicles, now]);
  const q = query.trim().toLowerCase();
  const listed = archived.filter((v) => !q || `${v.brand} ${v.model} ${v.version} ${v.plate} ${v.fileNumber}`.toLowerCase().includes(q));

  return (
    <div className="@container mx-auto grid max-w-[1400px] gap-10">
      <div>
        <span className="fc-eyebrow">Historique</span>
        <h1 className="fc-h2 mt-5">Vendus</h1>
        <p className="mt-4 text-silver">
          Les véhicules vendus depuis plus de {ARCHIVE_AFTER_DAYS} jours quittent le parc et arrivent ici :{" "}
          {archived.length} vente{archived.length > 1 ? "s" : ""}, {formatPrice(archived.reduce((sum, v) => sum + v.price, 0))} au total.
        </p>
      </div>
      <label className="relative block max-w-md">
        <span className="sr-only">Rechercher une vente</span>
        <Search size={16} aria-hidden className="absolute left-4 top-1/2 -translate-y-1/2 text-silver" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Marque, modèle, n° de dossier…"
          className="h-11 w-full rounded-sm border border-line-strong bg-transparent pl-11 pr-4 text-sm placeholder:text-silver/60 hover:border-silver focus:border-orange focus:outline-none"
        />
      </label>
      <VehicleTable caption="Ventes archivées" vehicles={listed} isAdmin={isAdmin} now={now} daysLabel="Vendu en" />
    </div>
  );
}
