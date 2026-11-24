import { keepCoverBlurOnly } from "@forevercars/shared";
import { getFeaturedVehicles } from "@/lib/vehicles";
import { Vehicle } from "@/lib/types/vehicle";
import FeaturedVehiclesClient from "./FeaturedVehiclesClient";

export default async function FeaturedVehicles() {
  const vehicles: Vehicle[] = await getFeaturedVehicles();

  if (vehicles.length === 0) return null;

  return <FeaturedVehiclesClient vehicles={keepCoverBlurOnly(vehicles)} />;
}
