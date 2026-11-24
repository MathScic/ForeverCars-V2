import { keepCoverBlurOnly } from "@forevercars/shared";
import { getAvailableVehicles } from "@/lib/vehicles";
import { Vehicle } from "@/lib/types/vehicle";
import StockClient from "./StockClient";

export default async function StockPage() {
  const vehicles: Vehicle[] = await getAvailableVehicles();

  return <StockClient initialVehicles={keepCoverBlurOnly(vehicles)} />;
}
