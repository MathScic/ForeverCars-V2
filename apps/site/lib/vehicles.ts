// Les véhicules du site, lus dans Supabase (remplace les requêtes GROQ de Sanity, mêmes données, mêmes slugs).
import { SITE_VEHICLE_SELECT, toSiteVehicle, type VehicleRow } from "@forevercars/shared";
import type { Vehicle } from "@/lib/types/vehicle";
import { rest } from "@/lib/supabase/rest";

const list = async (filters: string) =>
  (await rest<VehicleRow[]>(`vehicles?select=${SITE_VEHICLE_SELECT}&vehicle_photos.order=position.asc&${filters}`)).map((r) => toSiteVehicle(r));

/** En stock : en ligne et réservés, les plus récents d'abord. */
export const getAvailableVehicles = (): Promise<Vehicle[]> => list("status=in.(online,reserved)&order=published_at.desc");

/** Coups de cœur de l'accueil (12 au plus). */
export const getFeaturedVehicles = (): Promise<Vehicle[]> =>
  list("status=in.(online,reserved)&is_featured=is.true&order=published_at.desc&limit=12");

/** Page « Vendu » : les dernières ventes d'abord. */
export const getSoldVehicles = (): Promise<Vehicle[]> => list("status=eq.sold&order=sold_at.desc.nullslast");

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const [v] = await list(`slug=eq.${encodeURIComponent(slug)}&limit=1`);
  return v ?? null;
}

export async function getAllVehicleSlugs(): Promise<{ slug: string }[]> {
  return rest<{ slug: string }[]>("vehicles?select=slug");
}
