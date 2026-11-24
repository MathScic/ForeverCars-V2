import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useDemoStore } from "../demo/store";
import Button, { Arrow } from "../ui/Button";
import ActivityFeed from "./dashboard/ActivityFeed";
import Filters, { type StatusFilter } from "./dashboard/Filters";
import Kpis from "./dashboard/Kpis";
import MonthPanel from "./dashboard/MonthPanel";
import VehicleRow from "./dashboard/VehicleRow";

const th = "fc-label whitespace-nowrap border-b border-line px-3 pb-3.5 text-left";
const month = new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

// Le parc (maquette backoffice.html) : indicateurs, tableau du stock, stats du mois et activité.
export default function Dashboard() {
  const { state, isAdmin } = useDemoStore();
  const navigate = useNavigate();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [now] = useState(() => Date.now());

  const counts = useMemo(() => {
    const c: Record<StatusFilter, number> = { all: state.vehicles.length, online: 0, reserved: 0, draft: 0, sold: 0 };
    for (const v of state.vehicles) c[v.status] += 1;
    return c;
  }, [state.vehicles]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.vehicles
      .filter((v) => status === "all" || v.status === status)
      .filter((v) => !q || `${v.brand} ${v.model} ${v.version} ${v.plate} ${v.fileNumber}`.toLowerCase().includes(q))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [state.vehicles, status, query]);

  return (
    <div className="@container mx-auto grid max-w-[1400px] gap-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="fc-eyebrow">{month}</span>
          <h1 className="fc-h2 mt-5">Le parc</h1>
        </div>
        <Button size="lg" onClick={() => navigate("/vendre")}>
          Mettre en vente <Arrow />
        </Button>
      </div>

      <Kpis vehicles={state.vehicles} isAdmin={isAdmin} />

      {/* Panneaux à droite seulement si la zone de contenu est assez large (barre latérale comprise) ; sinon dessous. */}
      <div className="grid items-start gap-8 @min-[1280px]:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid min-w-0 gap-6">
          <Filters status={status} onStatus={setStatus} query={query} onQuery={setQuery} counts={counts} />
          {/* Fenêtre étroite : le tableau défile dans son cadre au lieu d'élargir la page. */}
          <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">Véhicules du parc</caption>
            <thead>
              <tr>
                <th className={th}>Véhicule</th>
                <th className={`${th} hidden @min-[1000px]:table-cell`}>Dossier</th>
                <th className={th}>En stock</th>
                <th className={`${th} text-right`}>Prix</th>
                <th className={th}>Statut</th>
                <th className={th}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((v) => (
                <VehicleRow key={v.id} vehicle={v} isAdmin={isAdmin} now={now} />
              ))}
            </tbody>
          </table>
          </div>
          {visible.length === 0 && <p className="py-10 text-center text-sm text-silver">Aucun véhicule ne correspond.</p>}
        </div>
        <div className="grid items-start gap-6 @min-[760px]:grid-cols-2 @min-[1280px]:grid-cols-1">
          <MonthPanel vehicles={state.vehicles} isAdmin={isAdmin} />
          <ActivityFeed entries={state.activity} />
        </div>
      </div>
    </div>
  );
}
