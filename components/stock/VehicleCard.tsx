import Image from "next/image";
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
    <div onClick={onClick} className="h-full cursor-pointer">
      <div className={`h-full flex flex-col bg-brand-gray-dark rounded-lg overflow-hidden border transition-all duration-300 hover:scale-[1.02] ${
        isReserved
          ? "border-yellow-500/40 hover:border-yellow-500/70"
          : "border-brand-gray-medium/20 hover:border-brand-orange/50"
      }`}>
        {/* Image */}
        <div className="relative h-48 bg-brand-gray-medium">
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
              <div className="bg-yellow-500 text-black font-orbitron font-bold text-sm px-6 py-2 rounded-full shadow-lg -rotate-6">
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
            <span className="inline-block bg-yellow-500 text-black text-xs font-semibold px-2 py-1 rounded mb-2 w-fit">
              Réservé
            </span>
          )}

          <h3 className="font-orbitron text-lg font-semibold text-brand-white">
            {vehicle.brand} {vehicle.model}
          </h3>

          <p className="font-inter text-sm text-brand-gray-light mt-1">
            {vehicle.year} • {vehicle.mileage.toLocaleString()} km • {vehicle.fuel}
          </p>

          <p className={`font-orbitron text-xl font-bold mt-auto pt-3 ${isReserved ? "text-yellow-500" : "text-brand-orange"}`}>
            {vehicle.price.toLocaleString()} €
          </p>
        </div>
      </div>
    </div>
  );
}
