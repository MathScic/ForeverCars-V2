import Image from "next/image";
import { Vehicle } from "@/lib/types/vehicle";

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick: () => void;
}

export default function VehicleCard({ vehicle, onClick }: VehicleCardProps) {
  return (
    <div onClick={onClick} className="h-full cursor-pointer">
      <div className="h-full flex flex-col bg-brand-gray-dark rounded-lg overflow-hidden border border-brand-gray-medium/20 hover:border-brand-orange/50 hover:scale-[1.02] transition-all duration-300">
        {/* Image */}
        <div className="relative h-56 bg-brand-gray-medium">
          {vehicle.images[0] ? (
            <Image
              src={vehicle.images[0]}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className="object-cover object-center"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-brand-gray-light">Image à venir</span>
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="p-4 flex-1 flex flex-col">
          {vehicle.isNew && (
            <span className="inline-block bg-brand-orange text-brand-black text-xs font-semibold px-2 py-1 rounded mb-2 w-fit">
              Nouveau
            </span>
          )}

          <h3 className="font-orbitron text-lg font-semibold text-brand-white">
            {vehicle.brand} {vehicle.model}
          </h3>

          <p className="font-inter text-sm text-brand-gray-light mt-1">
            {vehicle.year} • {vehicle.mileage.toLocaleString()} km • {vehicle.fuel}
          </p>

          <p className="font-orbitron text-xl font-bold text-brand-orange mt-auto pt-3">
            {vehicle.price.toLocaleString()} €
          </p>
        </div>
      </div>
    </div>
  );
}
