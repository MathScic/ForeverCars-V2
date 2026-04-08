import Image from "next/image";
import Link from "next/link";
import { Vehicle } from "@/lib/types/vehicle";
import { urlForImage } from "@/sanity/lib/image";

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick: () => void;
}

export default function VehicleCard({ vehicle, onClick }: VehicleCardProps) {
  const imageUrl = vehicle.images?.[0]
    ? urlForImage(vehicle.images[0]).width(800).height(600).quality(90).url()
    : null;

  const isReserved = vehicle.status === "reserved";

  return (
    <div className="h-full">
      <div className={`h-full flex flex-col bg-brand-gray-dark rounded-lg overflow-hidden border transition-all duration-300 hover:scale-[1.02] ${
        isReserved
          ? "border-white/40 hover:border-white/70"
          : "border-brand-gray-medium/20 hover:border-brand-orange/50"
      }`}>
        {/* Image cliquable → ouvre le panneau */}
        <div className="relative h-48 bg-brand-gray-medium cursor-pointer" onClick={onClick}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className={`object-cover object-center ${isReserved ? "brightness-75" : ""}`}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-brand-gray-light">Image à venir</span>
            </div>
          )}

          {/* Bandeau Réservé */}
          {isReserved && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white text-brand-black font-orbitron font-bold text-sm px-6 py-2 rounded-full shadow-lg -rotate-6">
                RÉSERVÉ
              </div>
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="p-4 flex-1 flex flex-col">
          {vehicle.isNew && !isReserved && (
            <span className="inline-block bg-brand-orange text-brand-black text-xs font-semibold px-2 py-1 rounded mb-2 w-fit">
              Nouveau
            </span>
          )}
          {isReserved && (
            <span className="inline-block bg-white text-brand-black text-xs font-semibold px-2 py-1 rounded mb-2 w-fit">
              Réservé
            </span>
          )}

          <h3 className="font-orbitron text-lg font-semibold text-brand-white cursor-pointer" onClick={onClick}>
            {vehicle.brand} {vehicle.model}
          </h3>

          <p className="font-inter text-sm text-brand-gray-light mt-1">
            {vehicle.year} • {vehicle.mileage.toLocaleString()} km • {vehicle.fuel}
          </p>

          <div className="flex items-center justify-between mt-auto pt-3">
            <p className={`font-orbitron text-xl font-bold ${isReserved ? "text-white" : "text-brand-orange"}`}>
              {vehicle.price.toLocaleString()} €
            </p>
            <Link
              href={`/stock/${vehicle.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="font-inter text-xs text-brand-gray-light hover:text-brand-orange underline underline-offset-2 transition-colors duration-200"
            >
              Voir la fiche →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
