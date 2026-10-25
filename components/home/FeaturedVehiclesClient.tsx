"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Vehicle } from "@/lib/types/vehicle";
import { urlForImage } from "@/sanity/lib/image";
import VehicleDetailPanel from "@/components/stock/VehicleDetailPannel";
import FadeIn from "../ui/FadeIn";

interface Props {
  vehicles: Vehicle[];
}

// Nombre minimum de cartes par "moitié" de piste pour que la boucle remplisse les grands écrans
const MIN_ITEMS_PER_TRACK = 8;

function CarouselCard({
  vehicle,
  onClick,
  hidden,
}: {
  vehicle: Vehicle;
  onClick: () => void;
  hidden?: boolean;
}) {
  const imageUrl = vehicle.images?.[0]?.asset?._ref
    ? urlForImage(vehicle.images[0]).width(960).height(600).quality(85).url()
    : null;
  const isReserved = vehicle.status === "reserved";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      aria-label={`Voir la fiche ${vehicle.brand} ${vehicle.model}`}
      className="group relative shrink-0 w-80 md:w-[26rem] aspect-[16/10] rounded-2xl overflow-hidden bg-brand-gray-medium text-left border border-brand-white/5 hover:border-brand-orange/50 focus-visible:outline-2 focus-visible:outline-brand-orange transition-colors duration-300 cursor-pointer"
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes="416px"
          placeholder={vehicle.images?.[0]?.lqip ? "blur" : "empty"}
          blurDataURL={vehicle.images?.[0]?.lqip}
          className={`object-cover transition-transform duration-700 group-hover:scale-105 ${isReserved ? "brightness-75" : ""}`}
        />
      ) : (
        <span className="absolute inset-0 flex items-center justify-center text-brand-gray-light">
          Image à venir
        </span>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/30 to-transparent" />

      {(vehicle.isNew || isReserved) && (
        <span
          className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full ${
            isReserved ? "bg-white text-brand-black" : "bg-brand-orange text-brand-black"
          }`}
        >
          {isReserved ? "Réservé" : "Nouveau"}
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="font-inter text-xs text-brand-gray-light/80">
          {vehicle.year} • {vehicle.mileage.toLocaleString()} km • <span className="capitalize">{vehicle.fuel}</span>
        </p>
        <h3 className="font-orbitron text-lg font-semibold text-brand-white mt-1 truncate">
          {vehicle.brand} {vehicle.model}
        </h3>
        <div className="flex items-center justify-between mt-3">
          <span
            className={`font-orbitron text-xl font-bold ${isReserved ? "text-white" : "text-brand-orange"}`}
          >
            {vehicle.price.toLocaleString()} €
          </span>
          <span className="font-inter text-xs text-brand-white/70 group-hover:text-brand-orange transition-colors duration-300">
            Voir la fiche →
          </span>
        </div>
      </div>
    </button>
  );
}

export default function FeaturedVehiclesClient({ vehicles }: Props) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // On répète la liste pour remplir la piste, puis on la double pour une boucle sans couture
  const repeat = Math.max(1, Math.ceil(MIN_ITEMS_PER_TRACK / vehicles.length));
  const track = Array.from({ length: repeat }, () => vehicles).flat();
  const duration = track.length * 5;

  return (
    <>
      <section className="py-20 bg-brand-gray-dark overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <FadeIn>
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-brand-white text-center mb-4">
              Véhicules en vedette
            </h2>
            <p className="font-inter text-brand-gray-light text-center mb-12">
              Notre sélection du moment
            </p>
          </FadeIn>
        </div>

        <FadeIn delay={0.15}>
          <div className="marquee-mask">
            <div
              className={`marquee-track flex w-max ${selectedVehicle ? "is-paused" : ""}`}
              style={{ "--marquee-duration": `${duration}s` } as React.CSSProperties}
            >
              {[0, 1].map((copy) => (
                <div key={copy} className="flex gap-6 pr-6" aria-hidden={copy === 1}>
                  {track.map((vehicle, index) => (
                    <CarouselCard
                      key={`${copy}-${vehicle._id}-${index}`}
                      vehicle={vehicle}
                      hidden={copy === 1 || index >= vehicles.length}
                      onClick={() => setSelectedVehicle(vehicle)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.3}>
          <div className="text-center mt-12 px-4">
            <Link
              href="/stock"
              className="inline-block font-orbitron text-sm font-semibold px-8 py-3 border-2 border-brand-orange text-brand-orange rounded-full hover:bg-brand-orange hover:text-brand-black transition-all duration-300"
            >
              Voir tout le stock
            </Link>
          </div>
        </FadeIn>
      </section>

      <VehicleDetailPanel vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
    </>
  );
}
