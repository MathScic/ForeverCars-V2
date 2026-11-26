// Connexion de l'équipe (Supabase Auth). Le rôle vient de la table profiles, protégée par la RLS.
import type { Profile } from "../shared/model";
import { friendly } from "./errors";
import { db } from "./supabase/client";

let current: Profile | null = null;

async function profileOf(id: string, email: string): Promise<Profile> {
  const { data, error } = await db().from("profiles").select("full_name, role, disabled_at").eq("id", id).maybeSingle();
  if (error) throw friendly(error, "Impossible de lire votre profil");
  // Comptes sur invitation : un compte sans profil n'a accès à rien.
  if (!data) throw new Error("Ce compte n'a pas encore accès au back-office : demandez à l'admin de vous ajouter.");
  if (data.disabled_at) throw new Error("L'accès de ce compte a été retiré par l'admin du garage.");
  return { id, email, name: data.full_name || email, role: data.role };
}

/** La personne déjà connectée sur ce poste (session chiffrée), ou null. */
export async function sessionProfile(): Promise<Profile | null> {
  const { data } = await db().auth.getSession();
  const user = data.session?.user;
  if (!user) return (current = null);
  current = await profileOf(user.id, user.email ?? "");
  return current;
}

export async function signIn(email: string, password: string): Promise<Profile> {
  const { data, error } = await db().auth.signInWithPassword({ email, password });
  if (error || !data.user) {
    if (error?.code === "invalid_credentials") throw new Error("E-mail ou mot de passe incorrect.");
    if (error?.code === "user_banned") throw new Error("L'accès de ce compte a été retiré par l'admin du garage.");
    throw friendly(error, "Connexion impossible");
  }
  try {
    current = await profileOf(data.user.id, data.user.email ?? email);
    return current;
  } catch (e) {
    await db().auth.signOut({ scope: "local" });
    throw e;
  }
}

/** Nouveau mot de passe choisi par la personne connectée (après un mot de passe provisoire). */
export async function changePassword(password: string): Promise<void> {
  const { error } = await db().auth.updateUser({ password });
  if (error?.code === "same_password") throw new Error("Choisissez un mot de passe différent de l'actuel.");
  if (error?.code === "weak_password") throw new Error("Mot de passe trop simple : mélangez lettres, chiffres et signes.");
  if (error) throw friendly(error, "Mot de passe non changé");
}

export async function signOut(): Promise<void> {
  current = null;
  await db().auth.signOut({ scope: "local" });
}

/** Rôle de la personne connectée, connu du process main (on ne se fie jamais au renderer). */
export const isAdmin = () => current?.role === "admin";
