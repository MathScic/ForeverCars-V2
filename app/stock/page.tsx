import { client } from "@/sanity/client";
import { availableVehiclesQuery } from "@/sanity/lib/queries";
import { Vehicle } from "@/lib/types/vehicle";
import StockClient from "./StockClient";

export default async function StockPage() {
  const vehicles: Vehicle[] = await client.fetch(availableVehiclesQuery, {}, { next: { revalidate: 60 } });

  return <StockClient initialVehicles={vehicles} />;
}
