// Le parc dans Supabase : lecture, enregistrement d'une fiche, actions (publier, vendu, réservé, coup de cœur, supprimer).
// La vraie protection reste la RLS : un vendeur qui force un appel ne lit ni n'écrit les coûts, et ne supprime rien.
import type { Vehicle, VehicleAct } from "../../shared/model";
import { actionLabel, actionPatch, nameOf } from "../../shared/rules";
import type { VehicleInput } from "../../shared/schemas";
import { logActivity } from "../activity";
import { isAdmin } from "../auth";
import { PHOTO_BUCKET, SANITY_SYNC_ACTIVE, SUPABASE_URL } from "../config";
import { friendly } from "../errors";
import { sizedPaths } from "../photos/sizes";
import { db } from "../supabase/client";
import { rowToVehicle, statusRow, VEHICLE_SELECT, vehicleFields, type VehicleRowFull } from "./mapping";

const CONFLICT = "Ce véhicule vient d'être modifié sur un autre poste : la fiche a été rechargée, refaites votre modification.";

export async function listVehicles(): Promise<Vehicle[]> {
  const { data, error } = await db().from("vehicles").select(VEHICLE_SELECT).order("updated_at", { ascending: false });
  if (error) throw friendly(error, "Impossible de charger le parc");
  return (data as unknown as VehicleRowFull[]).map((r) => rowToVehicle(r, SUPABASE_URL));
}

async function getRow(id: string): Promise<VehicleRowFull> {
  const { data, error } = await db().from("vehicles").select(VEHICLE_SELECT).eq("id", id).maybeSingle();
  if (error) throw friendly(error, "Impossible de lire ce véhicule");
  if (!data) throw new Error("Ce véhicule n'existe plus (supprimé sur un autre poste ?).");
  return data as unknown as VehicleRowFull;
}

export const getVehicle = async (id: string) => rowToVehicle(await getRow(id), SUPABASE_URL);

/** Véhicule venu de Sanity ouvert pour être modifié : la base note l'auteur, la synchro Sanity ne l'écrase plus. */
export async function claimVehicle(id: string): Promise<Vehicle> {
  const row = await getRow(id);
  if (row.created_by || row.updated_by) return rowToVehicle(row, SUPABASE_URL);
  const { error } = await db().from("vehicles").update({ updated_at: new Date().toISOString() }).eq("id", id);
  if (error) throw friendly(error, "Impossible d'ouvrir ce véhicule");
  return getVehicle(id);
}

export async function saveVehicle(v: VehicleInput): Promise<Vehicle> {
  const fields = vehicleFields(v);
  if (!v.revision) {
    const { error } = await db().from("vehicles").insert({ ...fields, id: v.id });
    if (error) throw friendly(error, "Enregistrement impossible");
    await logActivity("create", v.id, `Brouillon créé : ${nameOf(v)}`);
  } else {
    // Adresse de la fiche figée une fois publiée : les liens déjà partagés restent bons.
    const update = db().from("vehicles").update(v.publishedAt ? { ...fields, slug: undefined } : fields);
    const { data, error } = await update.eq("id", v.id).eq("revision", v.revision).select("id");
    if (error) throw friendly(error, "Enregistrement impossible");
    if (!data.length) throw new Error(CONFLICT);
    await logActivity("update", v.id, `Modifié : ${nameOf(v)}`);
  }
  if (isAdmin() && (v.purchasePrice !== undefined || v.repairCost !== undefined)) {
    const costs = { vehicle_id: v.id, purchase_price: v.purchasePrice ?? null, repair_cost: v.repairCost ?? 0 };
    const { error } = await db().from("vehicle_costs").upsert(costs);
    if (error) throw friendly(error, "Coûts internes non enregistrés");
  }
  return getVehicle(v.id);
}

export async function actOnVehicle(id: string, act: VehicleAct): Promise<Vehicle | null> {
  const row = await getRow(id);
  const vehicle = rowToVehicle(row, SUPABASE_URL);
  const label = actionLabel(vehicle, act);
  if (act === "remove") {
    if (SANITY_SYNC_ACTIVE && !row.created_by) {
      throw new Error("Ce véhicule vient de Sanity : supprimé ici, il reviendrait tant que Sanity est branché. Utilisez « Retirer du site » sur sa fiche (ou supprimez-le dans le Studio).");
    }
    const { data, error } = await db().from("vehicles").delete().eq("id", id).select("id");
    if (error) throw friendly(error, "Suppression impossible");
    if (!data.length) throw new Error("Votre compte n'a pas le droit de supprimer un véhicule.");
    const files = row.vehicle_photos.flatMap((p) => sizedPaths(p.storage_path));
    if (files.length) await db().storage.from(PHOTO_BUCKET).remove(files);
    await logActivity(act, id, label);
    return null;
  }
  const patch = statusRow(actionPatch(vehicle, act, new Date().toISOString()));
  const { data, error } = await db().from("vehicles").update(patch).eq("id", id).eq("revision", row.revision).select("id");
  if (error) throw friendly(error, "Action impossible");
  if (!data.length) throw new Error(CONFLICT);
  await logActivity(act, id, label);
  return getVehicle(id);
}
