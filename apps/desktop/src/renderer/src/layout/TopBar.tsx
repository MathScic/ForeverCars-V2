import { LogOut, RotateCcw } from "lucide-react";
import { useStore } from "../data/store";
import ConnectionStatus from "./ConnectionStatus";
import PasswordButton from "./PasswordButton";
import RoleSwitch from "./RoleSwitch";

const pill = "inline-flex h-9 items-center gap-1.5 rounded-full px-3 transition-colors hover:bg-graphite hover:text-ivory";

// Barre du haut : qui est connecté (ou mention de la démo) à gauche, état de connexion à droite.
export default function TopBar() {
  const { mode, userName, isAdmin, reset, signOut } = useStore();
  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between gap-4 border-b border-line px-10 text-xs text-silver">
      <div className="flex items-center gap-2">
        {mode === "demo" ? (
          <>
            Démo — données fictives, rien n&apos;est envoyé au site
            <button type="button" onClick={reset} className={`ml-2 ${pill}`}>
              <RotateCcw size={12} aria-hidden /> Réinitialiser
            </button>
          </>
        ) : (
          <span>
            Connecté : <span className="text-ivory">{userName}</span> · {isAdmin ? "admin" : "vendeur"}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <ConnectionStatus />
        {mode === "demo" ? (
          <RoleSwitch />
        ) : (
          <>
            <PasswordButton />
            <button type="button" onClick={() => void signOut?.()} className={pill}>
              <LogOut size={12} aria-hidden /> Se déconnecter
            </button>
          </>
        )}
      </div>
    </header>
  );
}
