import { client } from "@/sanity/client";
import { featuredVehiclesQuery } from "@/sanity/lib/queries";
import { Vehicle } from "@/lib/types/vehicle";
import FeaturedVehiclesClient from "./FeaturedVehiclesClient";

export default async function FeaturedVehicles() {
  const vehicles: Vehicle[] = await client.fetch(featuredVehiclesQuery, {}, { cache: "no-store" });

  if (vehicles.length === 0) return null;

  return <FeaturedVehiclesClient vehicles={vehicles} />;
}
