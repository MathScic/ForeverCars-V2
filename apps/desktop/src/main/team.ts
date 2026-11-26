// Écran Équipe : tout passe par l'Edge Function « team », qui vérifie que l'appelant est admin.
// La clé administrateur de Supabase n'est jamais dans l'app.
import { FunctionsHttpError } from "@supabase/supabase-js";
import type { Role, TeamMember } from "../shared/model";
import { friendly } from "./errors";
import { db } from "./supabase/client";

async function call<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await db().functions.invoke("team", { body });
  if (error instanceof FunctionsHttpError) {
    const detail = (await error.context.json().catch(() => null)) as { error?: string } | null;
    throw new Error(detail?.error ?? "Action refusée.");
  }
  if (error) throw friendly(error, "Équipe indisponible");
  return data as T;
}

type Members = { members: TeamMember[] };

export const listTeam = async () => (await call<Members>({ action: "list" })).members;
export const inviteMember = (email: string, name: string, role: Role) =>
  call<{ password: string; members: TeamMember[] }>({ action: "invite", email, name, role });
export const setMemberRole = async (id: string, role: Role) => (await call<Members>({ action: "setRole", id, role })).members;
export const resetMemberPassword = async (id: string) => (await call<{ password: string }>({ action: "resetPassword", id })).password;
export const setMemberAccess = async (id: string, enabled: boolean) =>
  (await call<Members>({ action: "setAccess", id, enabled })).members;
