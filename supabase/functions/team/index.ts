// Équipe : réservé à l'admin du garage (vérifié ici, avec le jeton de la personne qui appelle).
// La clé administrateur de Supabase reste sur le serveur : l'app n'y a jamais accès.
//   { action: "list" }                              → membres (nom, e-mail, rôle, dernière connexion)
//   { action: "invite", email, name, role }         → compte créé + mot de passe provisoire (affiché une fois)
//   { action: "setRole", id, role }                 → change le rôle
//   { action: "resetPassword", id }                 → nouveau mot de passe provisoire
//   { action: "setAccess", id, enabled }            → retire ou rétablit l'accès (compte bloqué, rien n'est effacé)
import { createClient } from "npm:@supabase/supabase-js@2.49.4";
import { accessError, inviteError, roleError, temporaryPassword } from "./rules.mjs";

const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const reply = (body: unknown, status = 200) => Response.json(body, { status });
const newPassword = () => temporaryPassword(crypto.getRandomValues(new Uint8Array(12)));
const must = <T>({ data, error }: { data: T; error: unknown }) => { if (error) throw error; return data; };

/** Identifiant de l'appelant s'il est admin actif, sinon null. */
async function callerAdmin(req: Request): Promise<string | null> {
  const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data } = await admin.auth.getUser(token);
  if (!data.user) return null;
  const { data: p } = await admin.from("profiles").select("role, disabled_at").eq("id", data.user.id).maybeSingle();
  return p?.role === "admin" && !p.disabled_at ? data.user.id : null;
}

async function members() {
  const profiles = must(await admin.from("profiles").select("id, full_name, role, disabled_at, created_at").order("created_at")) ?? [];
  const users = must(await admin.auth.admin.listUsers({ perPage: 200 })).users;
  const byId = new Map(users.map((u) => [u.id, u]));
  return profiles.map((p) => ({
    id: p.id, name: p.full_name, role: p.role, disabled: !!p.disabled_at, createdAt: p.created_at,
    email: byId.get(p.id)?.email ?? "", lastSignIn: byId.get(p.id)?.last_sign_in_at ?? null,
  }));
}

async function log(actor: string, action: string, id: string, label: string) {
  await admin.from("activity_log").insert({ actor_id: actor, action, entity: "profile", entity_id: id, payload: { label } });
}

Deno.serve(async (req) => {
  const me = await callerAdmin(req);
  if (!me) return reply({ error: "Réservé à l'admin du garage." }, 403);
  const body = await req.json().catch(() => ({}));
  try {
    const all = await members();
    const target = all.find((m) => m.id === body.id);
    switch (body.action) {
      case "list":
        return reply({ members: all });
      case "invite": {
        const err = inviteError(body);
        if (err) return reply({ error: err }, 400);
        const password = newPassword();
        const email = String(body.email).trim().toLowerCase();
        const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
        if (error || !data.user) return reply({ error: /already|registered|exists/i.test(error?.message ?? "") ? "Un compte existe déjà avec cet e-mail." : `Compte non créé (${error?.message})` }, 400);
        const { error: e2 } = await admin.from("profiles").insert({ id: data.user.id, full_name: String(body.name).trim(), role: body.role });
        if (e2) { await admin.auth.admin.deleteUser(data.user.id); throw e2; }
        await log(me, "invite", data.user.id, `Accès créé : ${String(body.name).trim()}`);
        return reply({ password, members: await members() });
      }
      case "setRole": {
        const err = roleError(all, body.id, body.role);
        if (err) return reply({ error: err }, 400);
        must(await admin.from("profiles").update({ role: body.role }).eq("id", body.id));
        await log(me, "role", body.id, `Rôle de ${target?.name} : ${body.role === "admin" ? "admin" : "vendeur"}`);
        return reply({ members: await members() });
      }
      case "resetPassword": {
        if (!target) return reply({ error: "Membre introuvable." }, 404);
        const password = newPassword();
        must(await admin.auth.admin.updateUserById(body.id, { password }));
        await log(me, "password", body.id, `Nouveau mot de passe provisoire : ${target.name} (l'ancien ne marche plus)`);
        return reply({ password });
      }
      case "setAccess": {
        const err = body.enabled ? (target ? null : "Membre introuvable.") : accessError(all, me, body.id);
        if (err) return reply({ error: err }, 400);
        // Compte bloqué (plus de connexion) et profil désactivé (la RLS ne lui donne plus rien).
        must(await admin.auth.admin.updateUserById(body.id, { ban_duration: body.enabled ? "none" : "876000h" }));
        must(await admin.from("profiles").update({ disabled_at: body.enabled ? null : new Date().toISOString() }).eq("id", body.id));
        await log(me, "access", body.id, `${body.enabled ? "Accès rétabli" : "Accès retiré"} : ${target?.name}`);
        return reply({ members: await members() });
      }
      default:
        return reply({ error: "Action inconnue." }, 400);
    }
  } catch (e) {
    return reply({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});
