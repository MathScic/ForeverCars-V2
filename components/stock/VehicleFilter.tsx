"use client";

import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

const fuels = ["Tous", "Essence", "Diesel", "Hybride", "Électrique"];
const transmissions = ["Tous", "Manuelle", "Automatique"];

export default function VehicleFilters({ onFilterChange, brands = ["Tous"], maxPriceLimit = 50000 }: FiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    brand: "Tous",
    fuel: "Tous",
    transmission: "Tous",
    maxPrice: maxPriceLimit,
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (key: keyof FilterState, value: string | number) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const pillClass = (isActive: boolean) =>
    `px-4 py-2 rounded-full font-inter text-sm cursor-pointer transition-all duration-300 ${
      isActive
        ? "bg-brand-orange text-brand-black font-semibold"
        : "bg-brand-black border border-brand-gray-medium/40 text-brand-gray-light hover:border-brand-orange/50"
    }`;

  const activeFiltersCount = [
    filters.brand !== "Tous",
    filters.fuel !== "Tous",
    filters.transmission !== "Tous",
    filters.maxPrice < maxPriceLimit,
  ].filter(Boolean).length;

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between bg-brand-gray-dark p-4 rounded-lg border border-brand-gray-medium/20 hover:border-brand-orange/30 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-5 h-5 text-brand-orange" />
          <span className="font-inter text-sm text-brand-white">Filtres</span>
          {activeFiltersCount > 0 && (
            <span className="bg-brand-orange text-brand-black text-xs font-semibold px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-brand-gray-light transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-brand-gray-dark p-6 rounded-b-lg border border-t-0 border-brand-gray-medium/20 space-y-6">
              {/* Marque */}
              <div>
                <label className="block font-inter text-xs text-brand-gray-light mb-2 uppercase tracking-wider">
                  Marque
                </label>
                <div className="flex flex-wrap gap-2">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => handleChange("brand", brand)}
                      className={pillClass(filters.brand === brand)}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Carburant */}
              <div>
                <label className="block font-inter text-xs text-brand-gray-light mb-2 uppercase tracking-wider">
                  Carburant
                </label>
                <div className="flex flex-wrap gap-2">
                  {fuels.map((fuel) => (
                    <button
                      key={fuel}
                      onClick={() => handleChange("fuel", fuel === "Tous" ? "Tous" : fuel.toLowerCase())}
                      className={pillClass(
                        filters.fuel === (fuel === "Tous" ? "Tous" : fuel.toLowerCase()),
                      )}
                    >
                      {fuel}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transmission */}
              <div>
                <label className="block font-inter text-xs text-brand-gray-light mb-2 uppercase tracking-wider">
                  Boîte de vitesse
                </label>
                <div className="flex flex-wrap gap-2">
                  {transmissions.map((t) => (
                    <button
                      key={t}
                      onClick={() => handleChange("transmission", t === "Tous" ? "Tous" : t.toLowerCase())}
                      className={pillClass(
                        filters.transmission === (t === "Tous" ? "Tous" : t.toLowerCase()),
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prix */}
              <div>
                <label className="block font-inter text-xs text-brand-gray-light mb-2 uppercase tracking-wider">
                  Budget maximum
                </label>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-inter text-sm text-brand-gray-light">5 000 €</span>
                    <span className="font-orbitron text-lg font-bold text-brand-orange">
                      {filters.maxPrice.toLocaleString()} €
                    </span>
                    <span className="font-inter text-sm text-brand-gray-light">{maxPriceLimit.toLocaleString()} €</span>
                  </div>
                  <div className="relative h-2 bg-brand-black rounded-full">
                    <div
                      className="absolute h-full bg-brand-orange rounded-full transition-all duration-150"
                      style={{ width: `${((filters.maxPrice - 5000) / (maxPriceLimit - 5000)) * 100}%` }}
                    />
                    <input
                      type="range"
                      min="5000"
                      max={maxPriceLimit}
                      step="1000"
                      value={filters.maxPrice}
                      onChange={(e) => handleChange("maxPrice", Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
