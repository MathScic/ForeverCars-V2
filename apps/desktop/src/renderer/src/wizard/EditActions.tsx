import { useState } from "react";
import { useNavigate } from "react-router";
import { EyeOff, Trash2 } from "lucide-react";
import type { Vehicle } from "../../../shared/model";
import { errorText, useStore } from "../data/store";
import Button from "../ui/Button";
import ConfirmDialog from "../ui/ConfirmDialog";

type Choice = "unpublish" | "remove";

// Fiche existante : la retirer du site (elle reste au parc en brouillon) ou la supprimer définitivement (admin).
export default function EditActions({ vehicle }: { vehicle: Vehicle }) {
  const { act, isAdmin, notify } = useStore();
  const navigate = useNavigate();
  const [choice, setChoice] = useState<Choice | null>(null);
  const [busy, setBusy] = useState(false);
  const name = `${vehicle.brand} ${vehicle.model}`;
  const visible = vehicle.status === "online" || vehicle.status === "reserved";
  if (!visible && !isAdmin) return null;

  const run = async (type: Choice) => {
    setBusy(true);
    try {
      await act(vehicle.id, type);
      notify(type === "remove" ? `${name} est supprimé, du parc et du site.` : `${name} est retiré du site (gardé en brouillon).`);
      navigate("/");
    } catch (e) {
      notify(errorText(e));
      setBusy(false);
      setChoice(null);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {visible && (
        <Button variant="ghost" onClick={() => setChoice("unpublish")}>
          <EyeOff size={16} aria-hidden /> Retirer du site
        </Button>
      )}
      {isAdmin && (
        <Button variant="danger" onClick={() => setChoice("remove")}>
          <Trash2 size={16} aria-hidden /> Supprimer
        </Button>
      )}
      {choice && (
        <ConfirmDialog
          title={choice === "remove" ? `Supprimer ${name} ?` : `Retirer ${name} du site ?`}
          confirmLabel={choice === "remove" ? "Supprimer définitivement" : "Retirer du site"}
          danger={choice === "remove"}
          busy={busy}
          onCancel={() => setChoice(null)}
          onConfirm={() => void run(choice)}
        >
          {choice === "remove" ? (
            <p>La fiche et ses photos sont effacées, et le véhicule disparaît du site. Impossible de revenir en arrière.</p>
          ) : (
            <p>Le véhicule disparaît du site mais reste dans le parc en brouillon : vous pourrez le republier.</p>
          )}
        </ConfirmDialog>
      )}
    </div>
  );
}
