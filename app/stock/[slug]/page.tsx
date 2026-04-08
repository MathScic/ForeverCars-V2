import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { vehicleBySlugQuery, allVehicleSlugsQuery } from "@/sanity/lib/queries";
import { Vehicle } from "@/lib/types/vehicle";
import VehicleDetailPage from "./VehicleDetailPage";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await client.fetch(allVehicleSlugsQuery);
  return slugs.map((s) => ({ slug: s.slug }));
}

export default async function VehicleSlugPage({ params }: Props) {
  const { slug } = await params;
  const vehicle: Vehicle | null = await client.fetch(vehicleBySlugQuery, { slug }, { cache: "no-store" });

  if (!vehicle) notFound();

  return <VehicleDetailPage vehicle={vehicle} />;
}
