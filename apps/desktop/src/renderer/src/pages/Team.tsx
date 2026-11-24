import { Monitor } from "lucide-react";
import { Navigate } from "react-router";
import { useDemoStore } from "../demo/store";
import Card from "../ui/Card";
import Members from "../team/Members";
import RolesTable from "../team/RolesTable";

// Équipe (maquette backoffice-equipe.html), réservée à l'admin. Les invitations et changements de rôle
// passeront par une Edge Function protégée (phase 6) ; ici, rien n'est envoyé.
export default function Team() {
  const { isAdmin } = useDemoStore();
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="@container mx-auto grid max-w-[1200px] gap-10">
      <div>
        <span className="fc-eyebrow">Équipe</span>
        <h1 className="fc-h2 mt-5">Qui a accès au back-office</h1>
        <p className="mt-4 text-silver">Seul un admin voit cette page. Chaque personne se connecte avec son propre compte.</p>
      </div>
      <Members />
      <div className="grid items-start gap-6 @min-[900px]:grid-cols-2">
        <RolesTable />
        <Card className="grid content-start gap-6 p-7">
          <h2 className="fc-h3">Postes connectés</h2>
          <div className="flex flex-wrap items-center gap-4">
            <Monitor size={20} aria-hidden className="text-silver" />
            <span className="min-w-0 flex-1">
              <span className="block font-semibold">PC du garage — Windows</span>
              <span className="block text-xs text-success">Connecté maintenant</span>
            </span>
          </div>
          <p className="text-xs text-silver">Un poste perdu ou vendu se déconnecte d&apos;ici (avec la connexion Supabase).</p>
        </Card>
      </div>
    </div>
  );
}
