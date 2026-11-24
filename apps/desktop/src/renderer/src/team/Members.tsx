import { useState, type FormEvent } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";

type Role = "Admin" | "Vendeur";
interface Member {
  name: string;
  email: string;
  role: Role;
  seen: string;
}

const initial: Member[] = [
  { name: "Clément Scicluna", email: "admin@forevercars.fr", role: "Admin", seen: "En ligne · PC du garage" },
  { name: "Vendeur (démo)", email: "vendeur@forevercars.fr", role: "Vendeur", seen: "Vu il y a 2 h" },
];

const select = "h-11 rounded-sm border border-line-strong bg-transparent px-3 text-sm hover:border-silver focus:border-orange focus:outline-none [&>option]:bg-graphite";
const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

// Membres + invitation (démo : rien n'est envoyé ; les invitations passeront par une Edge Function admin).
export default function Members() {
  const [members, setMembers] = useState(initial);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Vendeur");

  const invite = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setMembers((m) => [...m, { name: email.split("@")[0]!, email, role, seen: "Invitation envoyée" }]);
    setEmail("");
  };

  return (
    <Card className="grid gap-6 p-7">
      <h2 className="fc-h3">Membres</h2>
      <ul>
        {members.map((m, i) => (
          <li key={m.email} className="flex flex-wrap items-center gap-4 border-t border-line py-4 first:border-t-0 first:pt-0">
            <span aria-hidden className={`grid h-11 w-11 place-items-center rounded-full border text-xs font-semibold ${m.role === "Admin" ? "border-orange text-orange" : "border-line-strong text-silver"}`}>
              {initials(m.name)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">{m.name}</span>
              <span className="block text-sm text-silver">{m.email}</span>
            </span>
            <span className="text-xs text-silver">{m.seen}</span>
            <label>
              <span className="sr-only">Rôle de {m.name}</span>
              <select className={select} value={m.role} disabled={i === 0} onChange={(e) => setMembers((all) => all.map((x) => (x.email === m.email ? { ...x, role: e.target.value as Role } : x)))}>
                <option>Admin</option>
                <option>Vendeur</option>
              </select>
            </label>
          </li>
        ))}
      </ul>
      <form onSubmit={invite} className="grid gap-3 border-t border-line pt-6 @min-[700px]:grid-cols-[minmax(0,1fr)_160px_auto] @min-[700px]:items-end">
        <label className="grid gap-2.5">
          <span className="fc-label">Inviter par e-mail</span>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="prenom@forevercars.fr" className={`${select} h-[52px] px-4`} />
        </label>
        <label className="grid gap-2.5">
          <span className="fc-label">Rôle</span>
          <select className={`${select} h-[52px]`} value={role} onChange={(e) => setRole(e.target.value as Role)}>
            <option>Vendeur</option>
            <option>Admin</option>
          </select>
        </label>
        <Button type="submit" size="lg">Envoyer l&apos;invitation</Button>
      </form>
      <p className="text-xs text-silver">La personne reçoit un e-mail pour créer son mot de passe, puis télécharge l&apos;app.</p>
    </Card>
  );
}
