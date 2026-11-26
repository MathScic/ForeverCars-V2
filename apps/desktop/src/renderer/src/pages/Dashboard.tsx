import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useStore } from "../data/store";
import Button, { Arrow } from "../ui/Button";
import ActivityFeed from "./dashboard/ActivityFeed";
import Filters, { type StatusFilter } from "./dashboard/Filters";
import Kpis from "./dashboard/Kpis";
import MonthPanel from "./dashboard/MonthPanel";
import VehicleTable from "./dashboard/VehicleTable";
import { ARCHIVE_AFTER_DAYS, splitParc } from "./sold/archive";

const month = new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

// Le parc (maquette backoffice.html) : indicateurs, tableau du stock, stats du mois et activité.
// Les ventes de plus de 7 jours n'y figurent plus : elles sont dans la page Vendus.
export default function Dashboard() {
  const { state, isAdmin } = useStore();
  const navigate = useNavigate();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");
  const [now] = useState(() => Date.now());
  const { parc, archived } = useMemo(() => splitParc(state.vehicles, now), [state.vehicles, now]);

  const counts = useMemo(() => {
    const c: Record<StatusFilter, number> = { all: parc.length, online: 0, reserved: 0, draft: 0, sold: 0 };
    for (const v of parc) c[v.status] += 1;
    return c;
  }, [parc]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return parc
      .filter((v) => status === "all" || v.status === status)
      .filter((v) => !q || `${v.brand} ${v.model} ${v.version} ${v.plate} ${v.fileNumber}`.toLowerCase().includes(q))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [parc, status, query]);

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
          <VehicleTable caption="Véhicules du parc" vehicles={visible} isAdmin={isAdmin} now={now} />
          {archived.length > 0 && (
            <p className="text-sm text-silver">
              Ventes de plus de {ARCHIVE_AFTER_DAYS} jours :{" "}
              <Link to="/vendus" className="fc-link-arrow text-ivory">
                {archived.length} véhicule{archived.length > 1 ? "s" : ""} dans la page Vendus
              </Link>
            </p>
          )}
        </div>
        <div className="grid items-start gap-6 @min-[760px]:grid-cols-2 @min-[1280px]:grid-cols-1">
          <MonthPanel vehicles={state.vehicles} isAdmin={isAdmin} />
          <ActivityFeed entries={state.activity} />
        </div>
      </div>
    </div>
  );
}
