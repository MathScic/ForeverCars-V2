// Journal d'activité (« Vendu : Peugeot 208 ») : chacun écrit en son nom, seul l'admin le lit (RLS).
import type { ActivityEntry } from "../shared/model";
import { isAdmin } from "./auth";
import { friendly } from "./errors";
import { currentUserId, db } from "./supabase/client";

/** N'empêche jamais l'action elle-même : en cas d'échec, l'entrée du journal est simplement perdue. */
export async function logActivity(action: string, vehicleId: string, label: string): Promise<void> {
  const actor = await currentUserId();
  if (!actor) return;
  const { error } = await db().from("activity_log").insert({ actor_id: actor, action, entity: "vehicle", entity_id: vehicleId, payload: { label } });
  if (error) console.warn("Journal d'activité non écrit :", error.message);
}

export async function listActivity(): Promise<ActivityEntry[]> {
  if (!isAdmin()) return [];
  const { data, error } = await db()
    .from("activity_log")
    .select("id, created_at, payload, profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw friendly(error, "Journal d'activité indisponible");
  return data.map((e) => ({
    id: String(e.id),
    at: e.created_at,
    actor: e.profiles?.full_name ?? "—",
    label: typeof e.payload === "object" && e.payload && "label" in e.payload ? String(e.payload.label) : "",
  }));
}
