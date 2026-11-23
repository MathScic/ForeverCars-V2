import Link from "next/link";
import { Check, Link2 } from "lucide-react";
import type { Vehicle } from "@/lib/types/vehicle";
import { Arrow, buttonClasses } from "@/components/ui/Button";

interface Props {
  vehicle: Vehicle;
  copied: boolean;
  onInterest: () => void;
  onCopy: () => void;
  /** Affiche le lien vers la page fiche (dans le panneau, pas sur la page elle-même). */
  showPageLink?: boolean;
}

// Contenu commun au panneau latéral et à la page fiche : prix, caractéristiques, actions, texte.
export default function VehicleInfo({ vehicle, copied, onInterest, onCopy, showPageLink = false }: Props) {
  const isReserved = vehicle.status === "reserved";
  const specs: [string, string][] = [
    ["Année", String(vehicle.year)],
    ["Kilométrage", `${vehicle.mileage.toLocaleString("fr-FR")} km`],
    ["Carburant", vehicle.fuel],
    ["Boîte", vehicle.transmission],
    ["Puissance", `${vehicle.power} ch`],
  ];

  return (
    <div className="grid gap-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-3">
          {(isReserved || vehicle.isNew) && (
            <span className={`w-fit rounded-sm px-2.5 py-1.5 font-display text-[10px] font-semibold uppercase tracking-[0.2em] [font-stretch:112%] ${isReserved ? "bg-ivory text-carbon" : "bg-orange text-carbon"}`}>
              {isReserved ? "Réservé" : "Nouveau"}
            </span>
          )}
          <span className="fc-price text-[40px] leading-none">{vehicle.price.toLocaleString("fr-FR")} €</span>
        </div>
        {showPageLink && (
          <Link href={`/stock/${vehicle.slug}`} className="fc-link-arrow">Voir la fiche <span aria-hidden>→</span></Link>
        )}
      </div>

      <dl className="grid grid-cols-2 border-t border-line sm:grid-cols-3">
        {specs.map(([label, value]) => (
          <div key={label} className="border-b border-line py-4 pr-3">
            <dt className="fc-label text-[9px]">{label}</dt>
            <dd className="mt-2.5 font-display text-[17px] font-semibold capitalize [font-stretch:112%]">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-2.5">
        <button type="button" onClick={onInterest} className={buttonClasses("primary", "w-full justify-between")}>
          Je suis intéressé <Arrow />
        </button>
        <button type="button" onClick={onCopy} className={buttonClasses("ghost", "w-full justify-between")} aria-live="polite">
          {copied ? "Lien copié !" : "Copier le lien de cette annonce"}
          {copied ? <Check size={16} className="text-success" /> : <Link2 size={16} />}
        </button>
      </div>

      {vehicle.description && (
        <div>
          <h2 className="fc-eyebrow">Description</h2>
          <p className="mt-4 whitespace-pre-line leading-relaxed">{vehicle.description}</p>
        </div>
      )}

      {vehicle.features?.length > 0 && (
        <div>
          <h2 className="fc-eyebrow">Équipements</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {vehicle.features.map((feature) => (
              <li key={feature} className="rounded-sm border border-line-strong px-3.5 py-2.5 text-[13px] text-silver">{feature}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
