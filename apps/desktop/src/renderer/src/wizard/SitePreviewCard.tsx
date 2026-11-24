import { formatPrice } from "@forevercars/shared";
import type { DemoVehicle } from "../demo/types";

/**
 * Copie fidèle de la carte « Showroom Nocturne » du site (apps/site/components/stock/VehicleCard.tsx) :
 * mêmes classes, mêmes textes ; <img> à la place de next/image. À remplacer par le vrai composant
 * déplacé dans un paquet partagé quand le site lira Supabase (phase 9).
 */
export default function SitePreviewCard({ vehicle }: { vehicle: DemoVehicle }) {
  const cover = vehicle.photos[0];
  const isReserved = vehicle.status === "reserved";
  const name = `${vehicle.brand || "Marque"} ${vehicle.model || "Modèle"}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-md border border-line bg-graphite transition-[border-color,transform] duration-[600ms] ease-[var(--ease-spring)] hover:-translate-y-1 hover:border-orange/45">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-graphite-2">
        {cover ? (
          <img src={cover.url} alt="" className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-spring)] group-hover:scale-105 ${isReserved ? "brightness-75" : ""}`} />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-silver">Image à venir</span>
        )}
        <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(10_10_11/0.55),transparent_45%),radial-gradient(120%_90%_at_50%_40%,transparent_60%,rgb(10_10_11/0.45))]" />
        {vehicle.status !== "sold" && (
          <span className={`absolute left-3.5 top-3.5 z-10 rounded-sm px-2.5 py-1.5 font-display text-[10px] font-semibold uppercase tracking-[0.2em] [font-stretch:112%] ${isReserved ? "bg-ivory text-carbon" : "bg-orange text-carbon"}`}>
            {isReserved ? "Réservé" : "Nouveau"}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <h3 className="fc-model">{name}</h3>
        <p className="flex flex-wrap gap-x-2.5 text-[13px] text-silver">
          <span>{vehicle.year}</span>
          <span aria-hidden className="text-line-strong">·</span>
          <span>{vehicle.mileage.toLocaleString("fr-FR")} km</span>
          <span aria-hidden className="text-line-strong">·</span>
          <span className="capitalize">{vehicle.fuel}</span>
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
          <span className={`fc-price text-[22px] ${isReserved ? "!text-ivory" : ""}`}>{formatPrice(vehicle.price)}</span>
          <span className="fc-label py-3 transition-transform duration-500 group-hover:translate-x-1">Voir la fiche →</span>
        </div>
      </div>
    </article>
  );
}
