// Lignes Supabase ↔ véhicule de l'app. Code pur (testé), sans accès réseau.
import type { Tables, TablesUpdate } from "@forevercars/shared";
import { docIdOf } from "../../shared/documents";
import type { Vehicle } from "../../shared/model";
import type { StatusPatch } from "../../shared/rules";
import type { VehicleInput } from "../../shared/schemas";

/** Colonnes lues pour le parc : la fiche, ses photos, ses pièces et ses coûts (vides pour un vendeur : la RLS les cache). */
export const VEHICLE_SELECT =
  "*, vehicle_photos(id, storage_path, position), vehicle_costs(purchase_price, repair_cost), vehicle_documents(doc_type)";

export type VehicleRowFull = Tables<"vehicles"> & {
  vehicle_photos: Pick<Tables<"vehicle_photos">, "id" | "storage_path" | "position">[];
  vehicle_costs: Pick<Tables<"vehicle_costs">, "purchase_price" | "repair_cost"> | null;
  vehicle_documents: Pick<Tables<"vehicle_documents">, "doc_type">[];
};

/** Adresse publique d'une photo : chemin de base = 1600 px, « -800 » et « -480 » pour les autres tailles. */
export const photoUrl = (base: string, path: string, suffix = "-800") =>
  `${base}/storage/v1/object/public/vehicle-photos/${suffix ? path.replace(/\.webp$/, `${suffix}.webp`) : path}`;

export function rowToVehicle(r: VehicleRowFull, base: string): Vehicle {
  const costs = r.vehicle_costs;
  return {
    id: r.id, fileNumber: r.file_number, slug: r.slug, plate: r.plate ?? "",
    brand: r.brand, model: r.model, version: r.version, year: r.year, fuel: r.fuel, gearbox: r.gearbox, body: r.body,
    powerHp: r.power_hp ?? 0, mileage: r.mileage, color: r.color, owners: r.owners ?? 1, warrantyMonths: r.warranty_months,
    price: Number(r.price), description: r.description, descriptionIsAuto: r.description_is_auto, equipment: r.equipment,
    status: r.status, isFeatured: r.is_featured, exportLeboncoin: false, exportLaCentrale: false,
    photos: [...r.vehicle_photos]
      .sort((a, b) => a.position - b.position)
      .map((p) => ({ id: p.id, url: photoUrl(base, p.storage_path), name: p.storage_path.split("/").pop() ?? p.storage_path })),
    // Pièces du dossier déjà rangées (« cg » → true…), pour l'écran Documents.
    documents: Object.fromEntries((r.vehicle_documents ?? []).flatMap((d) => (docIdOf(d.doc_type) ? [[docIdOf(d.doc_type)!, true]] : []))),
    purchasePrice: costs?.purchase_price != null ? Number(costs.purchase_price) : undefined,
    repairCost: costs ? Number(costs.repair_cost) : undefined,
    createdAt: r.created_at, updatedAt: r.updated_at, soldAt: r.sold_at ?? undefined,
    publishedAt: r.published_at, revision: r.revision,
  };
}

/** Champs de la fiche que « Enregistrer » peut écrire (le statut ne change que par une action du parc). */
export function vehicleFields(v: VehicleInput) {
  return {
    file_number: v.fileNumber.trim(), slug: v.slug, plate: v.plate.trim() || null,
    brand: v.brand.trim(), model: v.model.trim(), version: v.version.trim(), year: v.year, fuel: v.fuel, gearbox: v.gearbox,
    body: v.body ?? null, power_hp: v.powerHp > 0 ? v.powerHp : null, mileage: v.mileage, color: v.color.trim(),
    owners: v.owners, warranty_months: v.warrantyMonths, price: v.price, description: v.description,
    description_is_auto: v.descriptionIsAuto, equipment: v.equipment, is_featured: v.isFeatured,
  } satisfies TablesUpdate<"vehicles">;
}

/** Changement de statut → colonnes à écrire (seulement celles qui changent). */
export function statusRow(p: StatusPatch): TablesUpdate<"vehicles"> {
  return {
    ...(p.status !== undefined && { status: p.status }),
    ...(p.isFeatured !== undefined && { is_featured: p.isFeatured }),
    ...(p.publishedAt !== undefined && { published_at: p.publishedAt }),
    ...(p.soldAt !== undefined && { sold_at: p.soldAt }),
  };
}
