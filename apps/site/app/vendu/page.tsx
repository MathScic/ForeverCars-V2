import { client } from "@/sanity/client";
import { soldVehiclesQuery } from "@/sanity/lib/queries";
import { Vehicle } from "@/lib/types/vehicle";
import VenduClient from "./VenduClient";

export default async function VenduPage() {
  const vehicles: Vehicle[] = await client.fetch(soldVehiclesQuery, {}, { cache: "no-store" });

  return <VenduClient vehicles={vehicles} />;
}
