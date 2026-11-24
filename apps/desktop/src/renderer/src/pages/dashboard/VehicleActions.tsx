import { useNavigate } from "react-router";
import { Check, Clock, Heart, Pencil, RotateCcw, Send, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { nowIso, useDemoStore } from "../../demo/store";
import type { DemoVehicle } from "../../demo/types";

type Act = "publish" | "markSold" | "toggleReserved" | "toggleFeatured" | "remove";

// Boutons ronds de la maquette (cible 44 px) : gris, s'éclairent au survol ; rouge pour supprimer.
function ActButton({ label, onClick, danger, pressed, children }: { label: string; onClick: () => void; danger?: boolean; pressed?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      onClick={onClick}
      className={`inline-grid h-11 w-11 place-items-center rounded-full border border-transparent text-silver transition-colors duration-300 ${
        danger ? "hover:border-danger/40 hover:text-danger" : "hover:border-line-strong hover:text-ivory"
      }`}
    >
      {children}
    </button>
  );
}

export default function VehicleActions({ vehicle }: { vehicle: DemoVehicle }) {
  const { dispatch, isAdmin } = useDemoStore();
  const navigate = useNavigate();
  const name = `${vehicle.brand} ${vehicle.model}`;
  const act = (type: Act) => dispatch({ type, id: vehicle.id, now: nowIso() });
  const visible = vehicle.status === "online" || vehicle.status === "reserved";
  const reserved = vehicle.status === "reserved";

  return (
    <div className="flex items-center justify-end whitespace-nowrap">
      <ActButton label={`Modifier ${name}`} onClick={() => navigate(`/vendre/${vehicle.id}`)}>
        <Pencil size={16} />
      </ActButton>
      {vehicle.status === "draft" && (
        <ActButton label={`Publier ${name}`} onClick={() => act("publish")}>
          <Send size={16} />
        </ActButton>
      )}
      {visible && (
        <>
          <ActButton label={vehicle.isFeatured ? `Retirer ${name} des coups de cœur` : `Mettre ${name} en coup de cœur`} pressed={vehicle.isFeatured} onClick={() => act("toggleFeatured")}>
            <Heart size={16} className={vehicle.isFeatured ? "fill-orange text-orange" : ""} />
          </ActButton>
          <ActButton label={reserved ? `Remettre ${name} en ligne` : `Réserver ${name}`} onClick={() => act("toggleReserved")}>
            {reserved ? <RotateCcw size={16} /> : <Clock size={16} />}
          </ActButton>
          <ActButton label={`Marquer ${name} comme vendu`} onClick={() => act("markSold")}>
            <Check size={16} />
          </ActButton>
        </>
      )}
      {isAdmin && (
        <ActButton label={`Supprimer ${name}`} danger onClick={() => window.confirm(`Supprimer définitivement ${name} ?`) && act("remove")}>
          <Trash2 size={16} />
        </ActButton>
      )}
    </div>
  );
}
