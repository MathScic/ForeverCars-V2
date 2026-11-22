import { Navigate } from "react-router";
import { useDemoStore } from "../demo/store";
import Card from "../ui/Card";

const members = [
  { name: "Clément Scicluna", email: "admin@forevercars.fr", role: "Admin" },
  { name: "Vendeur (démo)", email: "vendeur@forevercars.fr", role: "Vendeur" },
];

// Écran réservé à l'admin. Les invitations passeront par une Edge Function (phase 6).
export default function Team() {
  const { isAdmin } = useDemoStore();
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Équipe</h1>
        <p className="text-brand-gray-light mt-1">Qui a accès au back-office, et avec quels droits.</p>
      </div>
      <Card className="divide-y divide-brand-gray-medium/20">
        {members.map((m) => (
          <div key={m.email} className="flex items-center justify-between p-5">
            <div>
              <p className="font-semibold">{m.name}</p>
              <p className="text-sm text-brand-gray-light/70">{m.email}</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full border border-brand-orange/50 text-brand-orange">
              {m.role}
            </span>
          </div>
        ))}
      </Card>
      <p className="text-sm text-brand-gray-light/60">
        Inviter un employé et changer son rôle arrivera avec la connexion Supabase (phase 6).
      </p>
    </div>
  );
}
