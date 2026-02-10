"use client";

import { useState } from "react";
import { Vehicle } from "@/lib/types/vehicle";
import VehicleCard from "@/components/stock/VehicleCard";
import VehicleDetailPanel from "@/components/stock/VehicleDetailPannel";
import Link from "next/link";
import FadeIn from "../ui/FadeIn";

interface Props {
  vehicles: Vehicle[];
}

export default function FeaturedVehiclesClient({ vehicles }: Props) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  return (
    <>
      <section className="py-20 px-4 bg-brand-gray-dark">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-brand-white text-center mb-4">
              Véhicules en vedette
            </h2>
            <p className="font-inter text-brand-gray-light text-center mb-12">
              Notre sélection du moment
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {vehicles.map((vehicle, index) => (
              <FadeIn key={vehicle._id} delay={index * 0.15} className="h-full">
                <VehicleCard
                  vehicle={vehicle}
                  onClick={() => setSelectedVehicle(vehicle)}
                />
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.3}>
            <div className="text-center mt-12">
              <Link
                href="/stock"
                className="inline-block font-orbitron text-sm font-semibold px-8 py-3 border-2 border-brand-orange text-brand-orange rounded-full hover:bg-brand-orange hover:text-brand-black transition-all duration-300"
              >
                Voir tout le stock
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <VehicleDetailPanel
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
      />
    </>
  );
}
