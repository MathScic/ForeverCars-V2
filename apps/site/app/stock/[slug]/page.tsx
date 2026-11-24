import { notFound } from "next/navigation";
import { getAllVehicleSlugs, getVehicleBySlug } from "@/lib/vehicles";
import { Vehicle } from "@/lib/types/vehicle";
import VehicleDetailPage from "./VehicleDetailPage";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs: { slug: string }[] = await getAllVehicleSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export default async function VehicleSlugPage({ params }: Props) {
  const { slug } = await params;
  const vehicle: Vehicle | null = await getVehicleBySlug(slug);

  if (!vehicle) notFound();

  return <VehicleDetailPage vehicle={vehicle} />;
}
