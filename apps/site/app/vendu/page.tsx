import { keepCoverBlurOnly } from "@forevercars/shared";
import { getSoldVehicles } from "@/lib/vehicles";
import { Vehicle } from "@/lib/types/vehicle";
import VenduClient from "./VenduClient";

export default async function VenduPage() {
  const vehicles: Vehicle[] = await getSoldVehicles();

  return <VenduClient vehicles={keepCoverBlurOnly(vehicles)} />;
}
