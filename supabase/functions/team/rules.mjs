// Règles de l'écran Équipe (code pur, testé dans outils/migration-sanity/test/team-rules.test.mjs).

// Sans caractères faciles à confondre en les dictant ou en les recopiant (0/O, 1/l/I).
const ALPHABET = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** Mot de passe provisoire « Fc-xxxx-xxxx-xxxx » à partir de 12 octets aléatoires. */
export function temporaryPassword(bytes) {
  const c = [...bytes].map((b) => ALPHABET[b % ALPHABET.length]);
  return `Fc-${c.slice(0, 4).join("")}-${c.slice(4, 8).join("")}-${c.slice(8, 12).join("")}`;
}

export function inviteError({ email, name, role }) {
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Adresse e-mail invalide.";
  if (typeof name !== "string" || !name.trim() || name.length > 80) return "Indiquez le prénom et le nom.";
  if (role !== "admin" && role !== "seller") return "Rôle inconnu.";
  return null;
}

const activeAdmins = (members) => members.filter((m) => m.role === "admin" && !m.disabled);

/** Changement de rôle : refusé s'il retire le dernier admin actif. */
export function roleError(members, targetId, role) {
  const target = members.find((m) => m.id === targetId);
  if (!target) return "Membre introuvable.";
  if (role !== "admin" && role !== "seller") return "Rôle inconnu.";
  if (target.role === "admin" && role !== "admin" && activeAdmins(members).length <= 1) return "Il faut garder au moins un admin.";
  return null;
}

/** Retrait d'accès : jamais le sien, jamais celui du dernier admin actif. */
export function accessError(members, callerId, targetId) {
  if (targetId === callerId) return "Vous ne pouvez pas retirer votre propre accès.";
  const target = members.find((m) => m.id === targetId);
  if (!target) return "Membre introuvable.";
  if (target.role === "admin" && activeAdmins(members).filter((m) => m.id !== targetId).length === 0) {
    return "Il faut garder au moins un admin.";
  }
  return null;
}
