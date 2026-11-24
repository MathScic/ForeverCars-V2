import { useOnline } from "./useOnline";

// Pastille de la maquette : point lumineux + libellé ; orange hors ligne.
export default function ConnectionStatus() {
  const online = useOnline();
  return (
    <span
      role="status"
      className={`inline-flex h-[34px] items-center gap-2 rounded-full border px-3.5 text-xs ${
        online ? "border-success/30 text-success" : "border-orange/40 text-orange"
      }`}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current shadow-[0_0_10px_currentColor]" />
      {online ? "En ligne" : "Hors ligne — modifications gardées sur ce poste"}
    </span>
  );
}
