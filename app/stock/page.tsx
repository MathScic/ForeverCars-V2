import { client } from "@/sanity/client";
import { availableVehiclesQuery } from "@/sanity/lib/queries";
import { Vehicle } from "@/lib/types/vehicle";
import StockClient from "./StockClient";

export default async function StockPage() {
  const vehicles: Vehicle[] = await client.fetch(availableVehiclesQuery, {}, { cache: "no-store" });

  return <StockClient initialVehicles={vehicles} />;
}
