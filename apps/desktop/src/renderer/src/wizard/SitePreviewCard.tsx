import { formatMileage, formatPrice } from "@forevercars/shared";
import type { DemoVehicle } from "../demo/types";

/**
 * Copie fidèle de la carte véhicule du site (apps/site/components/stock/VehicleCard.tsx,
 * branche main) : mêmes classes, mêmes textes. À remplacer par le vrai composant
 * déplacé dans un paquet partagé (phase 7).
 */
export default function SitePreviewCard({ vehicle }: { vehicle: DemoVehicle }) {
  const cover = vehicle.photos[0];
  const isNew = vehicle.status !== "sold";

  return (
    <div className="h-full flex flex-col bg-brand-gray-dark rounded-lg overflow-hidden border border-brand-gray-medium/20 hover:border-brand-orange/50 transition-all duration-300 hover:scale-[1.02]">
      <div className="relative h-48 bg-brand-gray-medium">
        {cover ? (
          <img src={cover.url} alt={`${vehicle.brand} ${vehicle.model}`} className="absolute inset-0 w-full h-full object-cover object-center" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-brand-gray-light">Image à venir</span>
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        {isNew && (
          <span className="inline-block bg-brand-orange text-brand-black text-xs font-semibold px-2 py-1 rounded mb-2 w-fit">
            Nouveau
          </span>
        )}
        <h3 className="font-display text-lg font-semibold text-brand-white">
          {vehicle.brand || "Marque"} {vehicle.model || "Modèle"}
        </h3>
        <p className="text-sm text-brand-gray-light mt-1">
          {vehicle.year} • {formatMileage(vehicle.mileage)} • {vehicle.fuel}
        </p>
        <div className="flex items-center justify-between mt-auto pt-3">
          <p className="font-display text-xl font-bold text-brand-orange">{formatPrice(vehicle.price)}</p>
          <span className="text-xs text-brand-gray-light underline underline-offset-2">Voir la fiche →</span>
        </div>
      </div>
    </div>
  );
}
