"use client";

import { useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import FadeIn from "@/components/ui/FadeIn";
import Button, { Arrow } from "@/components/ui/Button";
import { Vehicle } from "@/lib/types/vehicle";
import { urlForImage } from "@/lib/photos";
import VehicleDetailPanel from "@/components/stock/LazyVehiclePanel";
import Pagination from "@/components/ui/Pagination";

const VEHICLES_PER_PAGE = 6;
const wrap = "mx-auto w-[min(100%-32px,1320px)] md:w-[min(100%-48px,1320px)]";
const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as CSSProperties;

interface Props {
  vehicles: Vehicle[];
}

const soldOn = (v: Vehicle) =>
  v.soldDate ? new Date(v.soldDate).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : "récemment";

export default function VenduClient({ vehicles }: Props) {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const gridTop = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(vehicles.length / VEHICLES_PER_PAGE);
  const startIndex = (currentPage - 1) * VEHICLES_PER_PAGE;
  const paginatedVehicles = vehicles.slice(startIndex, startIndex + VEHICLES_PER_PAGE);
  const changePage = (page: number) => {
    setCurrentPage(page);
    gridTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const stats: [string, string][] = [[`${vehicles.length}+`, "Véhicules vendus"], ["100%", "Clients satisfaits"], ["45", "Loiret & environs"]];

  return (
    <>
      <section className={`${wrap} border-b border-line pb-12 pt-12 md:pb-16 md:pt-24`}>
        <span className="fc-eyebrow rise-in">Ventes</span>
        <h1 className="fc-display focus-in mt-6" style={delay(100)}>
          Nos <span className="text-orange">Ventes</span>
        </h1>
        <p className="rise-in mt-6 max-w-[46ch] text-base text-silver md:text-lg" style={delay(200)}>
          Découvrez les véhicules que nous avons vendus. Chaque client satisfait est notre meilleure publicité.
        </p>
      </section>

      <FadeIn className={`${wrap} grid border-b border-line md:grid-cols-3`}>
        {stats.map(([value, label], i) => (
          <div key={label} className={`border-line py-6 md:py-9 ${i > 0 ? "border-t md:border-l md:border-t-0 md:pl-8" : ""}`}>
            <strong className="block font-display text-5xl font-semibold leading-none text-orange [font-stretch:125%] [text-shadow:0_0_18px_rgb(255_140_66/0.45)]">{value}</strong>
            <span className="mt-3 block text-sm text-silver">{label}</span>
          </div>
        ))}
      </FadeIn>

      <section ref={gridTop} className={`${wrap} scroll-mt-28 pt-14`}>
        {vehicles.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedVehicles.map((vehicle, i) => {
              const url = vehicle.images?.[0] ? urlForImage(vehicle.images[0])?.width(720).height(540).quality(75).url() : null;
              return (
                <FadeIn key={vehicle._id} delay={(i % 3) * 0.09}>
                  <button type="button" onClick={() => setSelectedVehicle(vehicle)} className="group w-full overflow-hidden rounded-md border border-line bg-graphite text-left">
                    <span className="relative block aspect-[4/3] overflow-hidden">
                      {url ? (
                        <Image src={url} alt={`${vehicle.brand} ${vehicle.model}`} fill sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="object-cover [filter:grayscale(0.55)_brightness(0.82)] transition-[filter,transform] duration-700 ease-[var(--ease-spring)] group-hover:scale-[1.04] group-hover:[filter:none]" />
                      ) : (
                        <span className="grid h-full place-items-center text-silver">Photo à venir</span>
                      )}
                      <span className="absolute left-3.5 top-3.5 rounded-sm bg-ivory px-2.5 py-1.5 font-display text-[10px] font-semibold uppercase tracking-[0.2em] text-carbon [font-stretch:112%]">Vendu</span>
                    </span>
                    <span className="grid gap-2 p-5">
                      <span className="fc-model">{vehicle.brand} {vehicle.model}</span>
                      <span className="text-[13px] text-silver">{vehicle.year} · Vendu en {soldOn(vehicle)}</span>
                    </span>
                  </button>
                </FadeIn>
              );
            })}
          </div>
        ) : (
          <p className="py-16 text-center text-silver">Les véhicules vendus apparaîtront ici prochainement.</p>
        )}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={changePage} />
      </section>

      <FadeIn className={`${wrap} mt-24 grid items-end gap-8 rounded-md border border-line bg-graphite p-8 md:grid-cols-[1fr_auto] md:p-[72px] lg:mt-36`}>
        <div>
          <span className="fc-eyebrow">Vendre avec ForeverCars</span>
          <h2 className="fc-h2 mt-5">Votre véhicule pourrait être le prochain</h2>
          <p className="mt-5 max-w-[52ch] text-silver">
            Vous souhaitez vendre votre véhicule rapidement et au meilleur prix ? Confiez-nous votre vente, on s&apos;occupe de tout.
          </p>
        </div>
        <Button href="/contact?sujet=vente" className="justify-between">Nous contacter <Arrow /></Button>
      </FadeIn>

      <VehicleDetailPanel vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />
    </>
  );
}
