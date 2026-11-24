import Image from "next/image";
import Link from "next/link";
import { Vehicle } from "@/lib/types/vehicle";
import { urlForImage } from "@/lib/photos";

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick: () => void;
  /** Les premières cartes sont visibles tout de suite : chargées en priorité (LCP). */
  priority?: boolean;
}

// Carte « Showroom Nocturne » : clic sur la photo ou le nom = panneau latéral ;
// « Voir la fiche » = page dédiée (liens partagés, Google, QR code).
export default function VehicleCard({ vehicle, onClick, priority = false }: VehicleCardProps) {
  const builder = vehicle.images?.[0] ? urlForImage(vehicle.images[0]) : null;
  const imageUrl = builder ? builder.width(720).height(540).quality(78).url() : null;
  const isReserved = vehicle.status === "reserved";
  const name = `${vehicle.brand} ${vehicle.model}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-md border border-line bg-graphite transition-[border-color,transform] duration-[600ms] ease-[var(--ease-spring)] hover:-translate-y-1 hover:border-orange/45">
      <button type="button" onClick={onClick} aria-label={`Aperçu ${name}`} className="relative aspect-[4/3] w-full overflow-hidden bg-graphite-2">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            priority={priority}
            placeholder={vehicle.images?.[0]?.asset?.metadata?.lqip ? "blur" : "empty"}
            blurDataURL={vehicle.images?.[0]?.asset?.metadata?.lqip}
            className={`object-cover transition-transform duration-[1200ms] ease-[var(--ease-spring)] group-hover:scale-105 ${isReserved ? "brightness-75" : ""}`}
          />
        ) : (
          <span className="absolute inset-0 grid place-items-center text-silver">Image à venir</span>
        )}
        {/* Vignettage : unifie des photos prises en atelier et en extérieur */}
        <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(10_10_11/0.55),transparent_45%),radial-gradient(120%_90%_at_50%_40%,transparent_60%,rgb(10_10_11/0.45))]" />
        {(isReserved || vehicle.isNew) && (
          <span className={`absolute left-3.5 top-3.5 z-10 rounded-sm px-2.5 py-1.5 font-display text-[10px] font-semibold uppercase tracking-[0.2em] [font-stretch:112%] ${isReserved ? "bg-ivory text-carbon" : "bg-orange text-carbon"}`}>
            {isReserved ? "Réservé" : "Nouveau"}
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col gap-2.5 p-5">
        <h2 className="fc-model">
          <button type="button" onClick={onClick} className="text-left">{name}</button>
        </h2>
        <p className="flex flex-wrap gap-x-2.5 text-[13px] text-silver">
          <span>{vehicle.year}</span>
          <span aria-hidden className="text-line-strong">·</span>
          <span>{vehicle.mileage.toLocaleString("fr-FR")} km</span>
          <span aria-hidden className="text-line-strong">·</span>
          <span className="capitalize">{vehicle.fuel}</span>
        </p>
        <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
          <span className={`fc-price text-[22px] ${isReserved ? "!text-ivory" : ""}`}>{vehicle.price.toLocaleString("fr-FR")} €</span>
          <Link href={`/stock/${vehicle.slug}`} className="fc-label py-3 transition-[color,transform] duration-500 hover:text-orange group-hover:translate-x-1">
            Voir la fiche →
          </Link>
        </div>
      </div>
    </article>
  );
}
