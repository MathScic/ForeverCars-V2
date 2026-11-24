import { RotateCcw } from "lucide-react";
import { resetDemo, useDemoStore } from "../demo/store";
import ConnectionStatus from "./ConnectionStatus";
import RoleSwitch from "./RoleSwitch";

// Barre du haut de la maquette : mention de l'ébauche à gauche, état de connexion à droite.
export default function TopBar() {
  const { dispatch } = useDemoStore();
  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between gap-4 border-b border-line px-10 text-xs text-silver">
      <div className="flex items-center gap-2">
        Ébauche — données de démo, rien n&apos;est envoyé au site
        <button
          type="button"
          onClick={() => resetDemo(dispatch)}
          className="ml-2 inline-flex h-9 items-center gap-1.5 rounded-full px-3 transition-colors hover:bg-graphite hover:text-ivory"
        >
          <RotateCcw size={12} aria-hidden /> Réinitialiser
        </button>
      </div>
      <div className="flex items-center gap-3">
        <ConnectionStatus />
        <RoleSwitch />
      </div>
    </header>
  );
}
