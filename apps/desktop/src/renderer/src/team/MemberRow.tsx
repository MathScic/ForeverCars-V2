import type { Role, TeamMember } from "../../../shared/model";

const select = "h-11 rounded-sm border border-line-strong bg-transparent px-3 text-sm hover:border-silver focus:border-orange focus:outline-none [&>option]:bg-graphite";
const link = "inline-flex h-11 items-center px-2 text-sm text-silver underline-offset-4 transition-colors hover:text-ivory hover:underline disabled:opacity-40";
const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";
const seen = (m: TeamMember) =>
  m.disabled ? "Accès retiré" : m.lastSignIn ? `Dernière connexion : ${new Date(m.lastSignIn).toLocaleDateString("fr-FR")}` : "Jamais connecté";

interface Props {
  member: TeamMember;
  isMe: boolean;
  busy: boolean;
  onRole: (role: Role) => void;
  onResetPassword: () => void;
  onAccess: (enabled: boolean) => void;
}

// Un membre : rôle modifiable, nouveau mot de passe provisoire, retrait ou rétablissement de l'accès.
export default function MemberRow({ member: m, isMe, busy, onRole, onResetPassword, onAccess }: Props) {
  return (
    <li className={`flex flex-wrap items-center gap-4 border-t border-line py-4 first:border-t-0 first:pt-0 ${m.disabled ? "opacity-60" : ""}`}>
      <span aria-hidden className={`grid h-11 w-11 place-items-center rounded-full border text-xs font-semibold ${m.role === "admin" ? "border-orange text-orange" : "border-line-strong text-silver"}`}>
        {initials(m.name)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-semibold">
          {m.name || m.email} {isMe && <span className="text-xs font-normal text-silver">(vous)</span>}
        </span>
        <span className="block truncate text-sm text-silver">{m.email}</span>
        <span className="block text-xs text-silver">{seen(m)}</span>
      </span>
      <label>
        <span className="sr-only">Rôle de {m.name}</span>
        <select className={select} value={m.role} disabled={busy || m.disabled} onChange={(e) => onRole(e.target.value as Role)}>
          <option value="admin">Admin</option>
          <option value="seller">Vendeur</option>
        </select>
      </label>
      {!isMe && (
        <span className="flex flex-wrap">
          {!m.disabled && (
            <button type="button" className={link} disabled={busy} onClick={onResetPassword}>
              Nouveau mot de passe
            </button>
          )}
          <button type="button" className={link} disabled={busy} onClick={() => onAccess(m.disabled)}>
            {m.disabled ? "Rétablir l'accès" : "Retirer l'accès"}
          </button>
        </span>
      )}
    </li>
  );
}
