import { Navigate } from "react-router";
import { useStore } from "../data/store";
import LiveMembers from "../team/LiveMembers";
import Members from "../team/Members";
import RolesTable from "../team/RolesTable";

// Équipe (maquette backoffice-equipe.html), réservée à l'admin. Mode réel : comptes, rôles et accès
// gérés par l'Edge Function « team » (la base vérifie elle aussi le rôle). Démo : rien n'est envoyé.
export default function Team() {
  const { isAdmin, mode } = useStore();
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="@container mx-auto grid max-w-[1200px] gap-10">
      <div>
        <span className="fc-eyebrow">Équipe</span>
        <h1 className="fc-h2 mt-5">Qui a accès au back-office</h1>
        <p className="mt-4 text-silver">Seul un admin voit cette page. Chaque personne se connecte avec son propre compte.</p>
      </div>
      {mode === "live" ? <LiveMembers /> : <Members />}
      <div className="grid items-start gap-6 @min-[900px]:grid-cols-2">
        <RolesTable />
      </div>
    </div>
  );
}
