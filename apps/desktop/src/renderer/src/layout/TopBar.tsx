import { FlaskConical, RotateCcw } from "lucide-react";
import { resetDemo, useDemoStore } from "../demo/store";
import ConnectionStatus from "./ConnectionStatus";
import RoleSwitch from "./RoleSwitch";

export default function TopBar() {
  const { dispatch } = useDemoStore();
  return (
    <header className="h-16 shrink-0 flex items-center justify-between gap-4 px-8 border-b border-brand-gray-medium/20 bg-brand-black/80 backdrop-blur">
      <div className="flex items-center gap-2 text-xs text-brand-gray-light/80">
        <FlaskConical size={14} className="text-brand-orange" />
        Ébauche — données de démo, rien n'est envoyé au site
        <button
          type="button"
          onClick={() => resetDemo(dispatch)}
          className="ml-2 inline-flex items-center gap-1 h-9 px-3 rounded-full hover:text-brand-white hover:bg-white/5"
        >
          <RotateCcw size={12} /> Réinitialiser
        </button>
      </div>
      <div className="flex items-center gap-3">
        <ConnectionStatus />
        <span className="text-xs text-brand-gray-light/60">Rôle simulé</span>
        <RoleSwitch />
      </div>
    </header>
  );
}
