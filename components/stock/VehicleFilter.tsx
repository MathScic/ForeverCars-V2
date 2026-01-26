"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface FilterState {
  brand: string;
  fuel: string;
  transmission: string;
  maxPrice: number;
}

interface FiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

const brands = [
  "Tous",
  "Audi",
  "BMW",
  "Citroën",
  "Ford",
  "Hyundai",
  "Kia",
  "Mercedes",
  "Peugeot",
  "Renault",
  "Skoda",
  "Toyota",
  "Volkswagen",
];
const fuels = ["Tous", "Essence", "Diesel", "Hybride", "Électrique"];
const transmissions = ["Tous", "Manuelle", "Automatique"];

export default function VehicleFilters({ onFilterChange }: FiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    brand: "Tous",
    fuel: "Tous",
    transmission: "Tous",
    maxPrice: 50000,
  });
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (key: keyof FilterState, value: string | number) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Fermer le dropdown si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pillClass = (isActive: boolean) =>
    `px-4 py-2 rounded-full font-inter text-sm cursor-pointer transition-all duration-300 ${
      isActive
        ? "bg-brand-orange text-brand-black font-semibold"
        : "bg-brand-black border border-brand-gray-medium/40 text-brand-gray-light hover:border-brand-orange/50"
    }`;

  return (
    <div className="bg-brand-gray-dark p-6 rounded-lg border border-brand-gray-medium/20 mb-8 space-y-6">
      {/* Marque - Custom Dropdown Animé */}
      <div>
        <label className="block font-inter text-xs text-brand-gray-light mb-2 uppercase tracking-wider">
          Marque
        </label>
        <div className="relative w-full sm:w-64" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between bg-brand-black border border-brand-gray-medium/40 rounded-lg px-4 py-2.5 font-inter text-sm text-brand-white focus:border-brand-orange focus:outline-none cursor-pointer"
          >
            {filters.brand}
            <ChevronDown
              className={`w-4 h-4 text-brand-gray-light transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute z-50 top-full left-0 right-0 mt-2 bg-brand-black border border-brand-gray-medium/40 rounded-lg overflow-hidden origin-top"
              >
                {brands.map((brand) => (
                  <li
                    key={brand}
                    onClick={() => {
                      handleChange("brand", brand);
                      setIsOpen(false);
                    }}
                    className={`px-4 py-2.5 font-inter text-sm cursor-pointer transition-colors duration-200 ${
                      filters.brand === brand
                        ? "bg-brand-orange/20 text-brand-orange"
                        : "text-brand-white hover:bg-brand-gray-dark"
                    }`}
                  >
                    {brand}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Carburant - Pills */}
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

      {/* Transmission - Pills */}
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

      {/* Prix - Slider */}
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
            <span className="font-inter text-sm text-brand-gray-light">50 000 €</span>
          </div>
          <div className="relative h-2 bg-brand-black rounded-full">
            <div
              className="absolute h-full bg-brand-orange rounded-full transition-all duration-150"
              style={{ width: `${((filters.maxPrice - 5000) / 45000) * 100}%` }}
            />
            <input
              type="range"
              min="5000"
              max="50000"
              step="1000"
              value={filters.maxPrice}
              onChange={(e) => handleChange("maxPrice", Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
