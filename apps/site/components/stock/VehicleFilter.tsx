"use client";

import { useState } from "react";

export interface FilterState {
  brand: string;
  fuel: string;
  transmission: string;
  maxPrice: number;
}

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
  brands?: string[];
  maxPriceLimit?: number;
}

// Libellé affiché → valeur stockée dans Sanity (sans accent : « electrique »).
const fuels: [string, string][] = [["Tous", "Tous"], ["Essence", "essence"], ["Diesel", "diesel"], ["Hybride", "hybride"], ["Électrique", "electrique"]];
const transmissions: [string, string][] = [["Tous", "Tous"], ["Manuelle", "manuelle"], ["Automatique", "automatique"]];
const MIN_PRICE = 5000;

const label = "font-display text-[10px] font-medium uppercase tracking-[0.26em] text-silver [font-stretch:112%]";
const row = "grid items-center gap-3 border-b border-line px-4 py-5 last:border-b-0 md:grid-cols-[170px_1fr] md:gap-6 md:px-7";

function Chips({ group, options, value, onPick }: { group: string; options: [string, string][]; value: string; onPick: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={group}>
      {options.map(([text, v]) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === v}
          onClick={() => onPick(v)}
          className={`h-10 rounded-sm border px-4 text-[13px] font-medium transition-colors duration-300 ${
            value === v ? "border-ivory bg-ivory text-carbon" : "border-line-strong text-silver hover:border-silver hover:text-ivory"
          }`}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

// Filtres sur plusieurs lignes (choix validé) : une ligne par critère, options qui passent à la ligne.
export default function VehicleFilters({ onFilterChange, brands = ["Tous"], maxPriceLimit = 50000 }: FiltersProps) {
  const [filters, setFilters] = useState<FilterState>({ brand: "Tous", fuel: "Tous", transmission: "Tous", maxPrice: maxPriceLimit });

  const handleChange = (key: keyof FilterState, value: string | number) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    onFilterChange(next);
  };

  const fill = ((filters.maxPrice - MIN_PRICE) / (maxPriceLimit - MIN_PRICE)) * 100;

  return (
    <div className="rounded-md border border-line bg-graphite" role="search" aria-label="Filtres">
      <div className={row}>
        <span className={label}>Marque</span>
        <Chips group="Marque" options={brands.map((b) => [b === "Tous" ? "Toutes" : b, b])} value={filters.brand} onPick={(v) => handleChange("brand", v)} />
      </div>
      <div className={`${row} lg:grid-cols-[170px_1fr_120px_1fr]`}>
        <span className={label}>Carburant</span>
        <Chips group="Carburant" options={fuels} value={filters.fuel} onPick={(v) => handleChange("fuel", v)} />
        <span className={label}>Boîte</span>
        <Chips group="Boîte" options={transmissions} value={filters.transmission} onPick={(v) => handleChange("transmission", v)} />
      </div>
      <div className={row}>
        <label htmlFor="budget" className={label}>Budget maximum</label>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <span className="text-xs text-silver">{MIN_PRICE.toLocaleString("fr-FR")} €</span>
          <div className="relative order-3 h-2 basis-full rounded-full bg-carbon md:order-none md:flex-1 md:basis-auto">
            {/* Le remplissage suit la poignée 1:1, sans retard */}
            <div className="absolute inset-y-0 left-0 rounded-full bg-orange" style={{ width: `${fill}%` }} />
            <input
              id="budget"
              type="range"
              min={MIN_PRICE}
              max={maxPriceLimit}
              step={1000}
              value={filters.maxPrice}
              onChange={(e) => handleChange("maxPrice", Number(e.target.value))}
              className="fc-range absolute inset-x-0 top-1/2 h-6 w-full -translate-y-1/2"
            />
          </div>
          <span className="text-xs text-silver">{maxPriceLimit.toLocaleString("fr-FR")} €</span>
          <output htmlFor="budget" className="fc-price ml-auto min-w-[110px] text-right text-lg">
            {filters.maxPrice.toLocaleString("fr-FR")} €
          </output>
        </div>
      </div>
    </div>
  );
}
