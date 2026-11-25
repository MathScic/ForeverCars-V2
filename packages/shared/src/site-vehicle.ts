// Ligne Supabase → véhicule tel que le site l'affiche. Même forme que l'ancien format Sanity,
// pour que les composants du site ne changent pas pendant la bascule.
import type { Tables } from "./database.types";

/** Une photo : `asset._id` = chemin dans le stockage « vehicle-photos » (1600 px, miniature « -480.webp »). */
export interface SitePhoto {
  asset: { _id: string; metadata?: { lqip?: string; dimensions?: { width: number; height: number } } };
}

export interface SiteVehicle {
  _id: string;
  brand: string;
  model: string;
  slug: string;
  year: number;
  price: number;
  mileage: number;
  fuel: Tables<"vehicles">["fuel"];
  transmission: Tables<"vehicles">["gearbox"];
  type: NonNullable<Tables<"vehicles">["body"]>;
  power: number;
  images: SitePhoto[];
  description: string;
  features: string[];
  isNew: boolean;
  isFeatured: boolean;
  status: "available" | "reserved" | "sold";
  _createdAt: string;
  soldDate?: string;
}

type PhotoRow = Pick<Tables<"vehicle_photos">, "storage_path" | "position" | "width" | "height">;
export type VehicleRow = Pick<
  Tables<"vehicles">,
  | "id" | "slug" | "brand" | "model" | "version" | "year" | "price" | "mileage" | "fuel" | "gearbox" | "body"
  | "power_hp" | "status" | "is_featured" | "published_at" | "sold_at" | "created_at"
> &
  Partial<Pick<Tables<"vehicles">, "description" | "equipment">> & { vehicle_photos?: PhotoRow[] | null };

/** Version légère pour les listes qui n'affichent que la carte (page Vendu) : ni description ni équipements. */
export const SITE_VEHICLE_CARD_SELECT =
  "id,slug,brand,model,version,year,price,mileage,fuel,gearbox,body,power_hp,status,is_featured,published_at,sold_at,created_at,vehicle_photos(storage_path,position,width,height)";

/** Colonnes à demander à Supabase pour construire un `SiteVehicle`. */
export const SITE_VEHICLE_SELECT =
  "id,slug,brand,model,version,year,price,mileage,fuel,gearbox,body,power_hp,description,equipment,status,is_featured,published_at,sold_at,created_at,vehicle_photos(storage_path,position,width,height)";

const STATUS = { online: "available", reserved: "reserved", sold: "sold", draft: "available" } as const;
/** Badge « Nouveau » : en ligne depuis moins de 7 jours (calculé, plus de case à cocher). */
export const NEW_DAYS = 7;

export function toSiteVehicle(r: VehicleRow, now = Date.now()): SiteVehicle {
  const published = r.published_at ?? r.created_at;
  const photos = [...(r.vehicle_photos ?? [])].sort((a, b) => a.position - b.position);
  return {
    _id: r.id,
    brand: r.brand,
    model: [r.model, r.version].filter(Boolean).join(" "),
    slug: r.slug,
    year: r.year,
    price: Number(r.price),
    mileage: r.mileage,
    fuel: r.fuel,
    transmission: r.gearbox,
    type: r.body ?? "berline",
    power: r.power_hp ?? 0,
    images: photos.map((p) => ({
      asset: { _id: p.storage_path, metadata: p.width && p.height ? { dimensions: { width: p.width, height: p.height } } : {} },
    })),
    description: r.description ?? "",
    features: r.equipment ?? [],
    isNew: now - Date.parse(published) < NEW_DAYS * 864e5,
    isFeatured: r.is_featured,
    status: STATUS[r.status],
    _createdAt: published,
    soldDate: r.sold_at?.slice(0, 10),
  };
}
