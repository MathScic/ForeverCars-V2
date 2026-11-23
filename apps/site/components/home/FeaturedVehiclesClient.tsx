"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Vehicle } from "@/lib/types/vehicle";
import { urlForImage } from "@/sanity/lib/image";
import VehicleDetailPanel from "@/components/stock/LazyVehiclePanel";
import FadeIn from "../ui/FadeIn";

interface Props {
  vehicles: Vehicle[];
}

// Nombre minimum de cartes par « moitié » de piste pour que la boucle remplisse les grands écrans
const MIN_ITEMS_PER_TRACK = 8;

function Slide({ vehicle, onClick, hidden }: { vehicle: Vehicle; onClick: () => void; hidden?: boolean }) {
  const builder = vehicle.images?.[0] ? urlForImage(vehicle.images[0]) : null;
  const imageUrl = builder ? builder.width(1000).height(690).quality(80).url() : null;
  const isReserved = vehicle.status === "reserved";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
      aria-label={`Aperçu ${vehicle.brand} ${vehicle.model}`}
      className="group relative aspect-[16/11] w-[82vw] shrink-0 overflow-hidden rounded-md border border-line bg-graphite text-left transition-colors duration-400 hover:border-orange/50 sm:w-[clamp(320px,34vw,500px)]"
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt=""
          fill
          sizes="(min-width: 640px) 34vw, 82vw"
          placeholder={vehicle.images?.[0]?.asset?.metadata?.lqip ? "blur" : "empty"}
          blurDataURL={vehicle.images?.[0]?.asset?.metadata?.lqip}
          className={`object-cover transition-transform duration-[1400ms] ease-[var(--ease-spring)] group-hover:scale-105 ${isReserved ? "brightness-75" : ""}`}
        />
      ) : (
        <span className="absolute inset-0 grid place-items-center text-silver">Image à venir</span>
      )}
      <span className="absolute inset-0 bg-[linear-gradient(to_top,rgb(10_10_11/0.95),rgb(10_10_11/0.15)_55%,transparent)]" />
      {(vehicle.isNew || isReserved) && (
        <span className={`absolute left-4 top-4 z-10 rounded-sm px-2.5 py-1.5 font-display text-[10px] font-semibold uppercase tracking-[0.2em] [font-stretch:112%] ${isReserved ? "bg-ivory text-carbon" : "bg-orange text-carbon"}`}>
          {isReserved ? "Réservé" : "Nouveau"}
        </span>
      )}
      <span className="absolute inset-x-0 bottom-0 z-10 grid gap-2 p-6">
        <span className="text-xs text-silver">
          {vehicle.year} · {vehicle.mileage.toLocaleString("fr-FR")} km · <span className="capitalize">{vehicle.fuel}</span>
        </span>
        <span className="fc-model text-[17px]">{vehicle.brand} {vehicle.model}</span>
        <span className="mt-1.5 flex items-center justify-between">
          <span className="fc-price text-[22px]">{vehicle.price.toLocaleString("fr-FR")} €</span>
          <span className="fc-label transition-colors group-hover:text-orange">Voir la fiche →</span>
        </span>
      </span>
    </button>
  );
}

export default function FeaturedVehiclesClient({ vehicles }: Props) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // On répète la liste pour remplir la piste, puis on la double pour une boucle sans couture
  const repeat = Math.max(1, Math.ceil(MIN_ITEMS_PER_TRACK / vehicles.length));
  const track = Array.from({ length: repeat }, () => vehicles).flat();
  const duration = track.length * 6;

  return (
    <>
      <section className="pt-24 lg:pt-36" aria-labelledby="vedette">
        <div className="mx-auto flex w-[min(100%-32px,1320px)] flex-col items-start gap-4 md:w-[min(100%-48px,1320px)] md:flex-row md:items-end md:justify-between md:gap-10">
          <FadeIn>
            <span className="fc-eyebrow">Notre sélection du moment</span>
            <h2 id="vedette" className="fc-h2 mt-5">Véhicules en vedette</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Link href="/stock" className="fc-link-arrow">Voir tout le stock <span aria-hidden>→</span></Link>
          </FadeIn>
        </div>

        <FadeIn delay={0.15}>
          <div className="marquee-mask mt-14 overflow-hidden">
            <div
              className={`marquee-track flex w-max gap-5 ${selectedVehicle ? "is-paused" : ""}`}
              style={{ "--marquee-duration": `${duration}s` } as CSSProperties}
            >
              {[0, 1].map((copy) =>
                track.map((vehicle, index) => (
                  <Slide
                    key={`${copy}-${vehicle._id}-${index}`}
                    vehicle={vehicle}
                    hidden={copy === 1 || index >= vehicles.length}
                    onClick={() => setSelectedVehicle(vehicle)}
                  />
                )),
              )}
            </div>
          </div>
        </FadeIn>
      </section>

      <VehicleDetailPanel vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
    </>
  );
}
