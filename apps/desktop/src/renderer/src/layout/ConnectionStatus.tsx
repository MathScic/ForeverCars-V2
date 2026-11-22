import { Wifi, WifiOff } from "lucide-react";
import { useOnline } from "./useOnline";

export default function ConnectionStatus() {
  const online = useOnline();
  return (
    <span
      role="status"
      className={`inline-flex items-center gap-2 h-9 px-3 rounded-full text-xs font-medium border ${
        online
          ? "border-brand-success/30 text-brand-success"
          : "border-brand-orange/40 text-brand-orange"
      }`}
    >
      {online ? <Wifi size={14} /> : <WifiOff size={14} />}
      {online ? "En ligne" : "Hors-ligne — modifications gardées sur ce poste"}
    </span>
  );
}
