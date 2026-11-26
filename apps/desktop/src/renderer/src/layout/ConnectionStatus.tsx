import { useStore } from "../data/store";
import { useOnline } from "./useOnline";

// Pastille : point lumineux + libellé ; orange hors ligne. Le mode hors-ligne complet arrive à l'étape suivante :
// en attendant, l'app branchée prévient que rien ne peut être enregistré sans internet.
export default function ConnectionStatus() {
  const online = useOnline();
  const { mode } = useStore();
  const offline = mode === "demo" ? "Hors ligne — modifications gardées sur ce poste" : "Hors ligne — rien ne peut être enregistré";
  return (
    <span
      role="status"
      className={`inline-flex h-[34px] items-center gap-2 rounded-full border px-3.5 text-xs ${
        online ? "border-success/30 text-success" : "border-orange/40 text-orange"
      }`}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_10px_currentColor]" />
      {online ? "En ligne" : offline}
    </span>
  );
}
