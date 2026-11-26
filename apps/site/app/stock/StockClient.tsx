"use client";

import { useRef, useState, type CSSProperties } from "react";
import { Vehicle } from "@/lib/types/vehicle";
import VehicleCard from "@/components/stock/VehicleCard";
import VehicleFilters, { FilterState } from "@/components/stock/VehicleFilter";
import FilterDrawer from "@/components/stock/FilterDrawer";
import VehicleDetailPanel from "@/components/stock/LazyVehiclePanel";
import Pagination from "@/components/ui/Pagination";
import FadeIn from "@/components/ui/FadeIn";
import { applyFilters, brandKey, countText, filterSummary } from "./stock-filters";

const VEHICLES_PER_PAGE = 9;

interface Props {
  initialVehicles: Vehicle[];
}

export default function StockClient({ initialVehicles }: Props) {
  const maxPriceLimit = Math.ceil(Math.max(...initialVehicles.map((v) => v.price), 50000) / 5000) * 5000;
  const initial: FilterState = { brand: "Tous", fuel: "Tous", transmission: "Tous", maxPrice: maxPriceLimit };

  const [filters, setFilters] = useState<FilterState>(initial);
  const [filtersOpen, setFiltersOpen] = useState(false); // replié par défaut : les voitures d'abord
  const [resetKey, setResetKey] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const listTop = useRef<HTMLDivElement>(null);

  const brands = ["Tous", ...Array.from(new Set(initialVehicles.map(brandKey))).sort()];

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const reset = () => {
    handleFilterChange(initial);
    setResetKey((k) => k + 1); // recrée le panneau de filtres à zéro
  };

  // Changement de page : on remonte au début de la liste (ligne « Page x sur y »), pas en bas.
  const changePage = (page: number) => {
    setCurrentPage(page);
    listTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filteredVehicles = applyFilters(initialVehicles, filters);
  const totalPages = Math.ceil(filteredVehicles.length / VEHICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * VEHICLES_PER_PAGE;
  const paginatedVehicles = filteredVehicles.slice(startIndex, startIndex + VEHICLES_PER_PAGE);

  return (
    <>
      <section className="mx-auto w-[min(100%-32px,1320px)] md:w-[min(100%-48px,1320px)]">
        <div className="flex items-end justify-between gap-10 pb-10 pt-12 md:pb-14 md:pt-24">
          {/* Entrée en CSS pur : le titre s'affiche sans attendre le JavaScript (meilleur LCP) */}
          <div>
            <span className="fc-eyebrow rise-in">Véhicules contrôlés · Loiret</span>
            <h1 className="fc-display focus-in mt-6" style={{ "--delay": "100ms" } as CSSProperties}>Notre Stock</h1>
            <p className="rise-in mt-5 text-base text-silver md:text-lg" style={{ "--delay": "200ms" } as CSSProperties}>{countText(filteredVehicles.length)}</p>
          </div>
          <span aria-hidden className="hidden font-display text-8xl font-light leading-[0.8] text-transparent [-webkit-text-stroke:1px_var(--color-line-strong)] [font-stretch:125%] md:block">
            {filteredVehicles.length}
          </span>
        </div>

        <FilterDrawer open={filtersOpen} onToggle={() => setFiltersOpen((o) => !o)} summary={filterSummary(filters, maxPriceLimit)}>
          <VehicleFilters key={resetKey} onFilterChange={handleFilterChange} brands={brands} maxPriceLimit={maxPriceLimit} />
        </FilterDrawer>
        <div ref={listTop} className="flex scroll-mt-20 flex-wrap items-center justify-between gap-2 pt-7 lg:scroll-mt-24">
          <span className="text-sm text-silver">
            {filteredVehicles.length > 0 && `Page ${currentPage} sur ${totalPages} · ${filteredVehicles.length} véhicule${filteredVehicles.length > 1 ? "s" : ""}`}
          </span>
          <button onClick={reset} className="fc-link-arrow">Réinitialiser</button>
        </div>

        <div className="grid grid-cols-1 gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedVehicles.map((vehicle, i) => {
            // Seule la 1re photo passe en priorité : sur téléphone c'est la seule visible, les autres attendent leur tour.
            const card = <VehicleCard vehicle={vehicle} priority={currentPage === 1 && i === 0} onClick={() => setSelectedVehicle(vehicle)} />;
            // La première rangée est visible tout de suite ; les suivantes apparaissent au défilement.
            return i < 3 ? <div key={vehicle._id} className="h-full">{card}</div> : (
              <FadeIn key={vehicle._id} delay={(i % 3) * 0.09} className="h-full">{card}</FadeIn>
            );
          })}
        </div>

        {filteredVehicles.length === 0 && <p className="py-20 text-center text-silver">Aucun véhicule ne correspond à vos critères.</p>}

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={changePage} />
      </section>

      <VehicleDetailPanel vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
    </>
  );
}
