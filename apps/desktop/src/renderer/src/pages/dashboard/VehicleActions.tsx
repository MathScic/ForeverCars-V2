import { useNavigate } from "react-router";
import { BadgeCheck, Heart, Pencil, Send, Trash2 } from "lucide-react";
import { nowIso, useDemoStore } from "../../demo/store";
import type { DemoVehicle } from "../../demo/types";

const iconBtn =
  "h-11 w-11 inline-flex items-center justify-center rounded-full text-brand-gray-light hover:text-brand-white hover:bg-white/5 transition-colors";

export default function VehicleActions({ vehicle }: { vehicle: DemoVehicle }) {
  const { dispatch, isAdmin } = useDemoStore();
  const navigate = useNavigate();
  const name = `${vehicle.brand} ${vehicle.model}`;
  const act = (type: "publish" | "markSold" | "toggleFeatured" | "remove") =>
    dispatch({ type, id: vehicle.id, now: nowIso() });

  return (
    <div className="flex items-center justify-end">
      {vehicle.status !== "sold" && (
        <button
          type="button"
          className={iconBtn}
          aria-pressed={vehicle.isFeatured}
          aria-label={vehicle.isFeatured ? `Retirer ${name} des coups de cœur` : `Mettre ${name} en coup de cœur`}
          title="Coup de cœur (mis en avant sur l'accueil)"
          onClick={() => act("toggleFeatured")}
        >
          <Heart size={18} className={vehicle.isFeatured ? "fill-brand-orange text-brand-orange" : ""} />
        </button>
      )}
      <button
        type="button"
        className={iconBtn}
        aria-label={`Modifier ${name}`}
        title="Modifier"
        onClick={() => navigate(`/vendre/${vehicle.id}`)}
      >
        <Pencil size={18} />
      </button>
      {vehicle.status === "draft" && (
        <button type="button" className={iconBtn} aria-label={`Publier ${name}`} title="Publier" onClick={() => act("publish")}>
          <Send size={18} />
        </button>
      )}
      {vehicle.status === "online" && (
        <button
          type="button"
          className={iconBtn}
          aria-label={`Marquer ${name} comme vendu`}
          title="Marquer vendu"
          onClick={() => act("markSold")}
        >
          <BadgeCheck size={18} />
        </button>
      )}
      {isAdmin && (
        <button
          type="button"
          className={`${iconBtn} hover:text-brand-danger`}
          aria-label={`Supprimer ${name}`}
          title="Supprimer (admin)"
          onClick={() => window.confirm(`Supprimer définitivement ${name} ?`) && act("remove")}
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
}
