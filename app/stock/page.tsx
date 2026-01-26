"use client";

import { useState } from "react";
import { vehicles } from "@/lib/data/vehicles";
import { Vehicle } from "@/lib/types/vehicle";
import VehicleCard from "@/components/stock/VehicleCard";
import VehicleFilters, { FilterState } from "@/components/stock/VehicleFilter";
import VehicleDetailPanel from "@/components/stock/VehicleDetailPannel";
import Pagination from "@/components/ui/Pagination";

const VEHICLES_PER_PAGE = 9;

export default function StockPage() {
  const [filters, setFilters] = useState<FilterState>({
    brand: "Tous",
    fuel: "Tous",
    transmission: "Tous",
    maxPrice: 50000,
  });

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const filteredVehicles = vehicles.filter((v) => {
    if (filters.brand !== "Tous" && v.brand !== filters.brand) return false;
    if (filters.fuel !== "Tous" && v.fuel !== filters.fuel) return false;
    if (filters.transmission !== "Tous" && v.transmission !== filters.transmission) return false;
    if (v.price > filters.maxPrice) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredVehicles.length / VEHICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * VEHICLES_PER_PAGE;
  const paginatedVehicles = filteredVehicles.slice(startIndex, startIndex + VEHICLES_PER_PAGE);

  const getVehicleCountText = () => {
    const total = filteredVehicles.length;
    if (total === 0) return "Aucun véhicule";
    if (total === 1) return "1 véhicule disponible";
    if (total > 30) return "+ de 30 véhicules disponibles";
    return `${total} véhicules disponibles`;
  };

  return (
    <>
      <section className="py-12 px-4 bg-brand-black min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="font-orbitron text-4xl md:text-5xl font-bold text-brand-white mb-4">
              Notre Stock
            </h1>
            <p className="font-inter text-brand-gray-light">{getVehicleCountText()}</p>
          </div>

          <VehicleFilters onFilterChange={handleFilterChange} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {paginatedVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onClick={() => setSelectedVehicle(vehicle)}
              />
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <p className="text-center font-inter text-brand-gray-light py-12">
              Aucun véhicule ne correspond à vos critères.
            </p>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>

      <VehicleDetailPanel vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
    </>
  );
}
