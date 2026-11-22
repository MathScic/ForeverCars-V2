import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Plus } from "lucide-react";
import { useDemoStore } from "../demo/store";
import Button from "../ui/Button";
import Card from "../ui/Card";
import ActivityFeed from "./dashboard/ActivityFeed";
import Filters, { type StatusFilter } from "./dashboard/Filters";
import Kpis from "./dashboard/Kpis";
import VehicleRow from "./dashboard/VehicleRow";

export default function Dashboard() {
  const { state, isAdmin } = useDemoStore();
  const navigate = useNavigate();
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");

  const counts = useMemo(() => {
    const c = { all: state.vehicles.length, online: 0, draft: 0, sold: 0 };
    for (const v of state.vehicles) c[v.status] += 1;
    return c;
  }, [state.vehicles]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return state.vehicles
      .filter((v) => status === "all" || v.status === status)
      .filter((v) => !q || `${v.brand} ${v.model} ${v.version} ${v.plate}`.toLowerCase().includes(q))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [state.vehicles, status, query]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Le parc</h1>
          <p className="text-brand-gray-light mt-1">Tout le stock du garage, en un coup d&apos;œil.</p>
        </div>
        <Button size="lg" onClick={() => navigate("/vendre")}>
          <Plus size={18} /> Mettre en vente
        </Button>
      </div>

      <Kpis vehicles={state.vehicles} isAdmin={isAdmin} />

      <div className="grid grid-cols-1 2xl:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="space-y-4">
          <Filters status={status} onStatus={setStatus} query={query} onQuery={setQuery} counts={counts} />
          <Card className="overflow-hidden">
            <table className="w-full">
              <caption className="sr-only">Véhicules du parc</caption>
              <thead className="text-left text-xs uppercase tracking-wider text-brand-gray-light/60">
                <tr>
                  <th className="py-3 pl-5 pr-4 font-medium">Véhicule</th>
                  <th className="px-4 font-medium">Plaque</th>
                  <th className="px-4 font-medium">Année · km</th>
                  <th className="px-4 font-medium text-right">Prix</th>
                  <th className="pr-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((v) => (
                  <VehicleRow key={v.id} vehicle={v} isAdmin={isAdmin} />
                ))}
              </tbody>
            </table>
            {visible.length === 0 && (
              <p className="p-8 text-center text-sm text-brand-gray-light/60">Aucun véhicule ne correspond.</p>
            )}
          </Card>
        </div>
        <ActivityFeed entries={state.activity} />
      </div>
    </div>
  );
}
