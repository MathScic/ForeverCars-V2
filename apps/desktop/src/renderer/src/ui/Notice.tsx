import { useEffect } from "react";
import { X } from "lucide-react";

// Message en bas à droite (erreur d'enregistrement, photo refusée…) ; disparaît seul après 10 secondes.
export default function Notice({ message, onClose }: { message: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 10_000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;
  return (
    <div role="alert" className="fixed bottom-6 right-6 z-50 flex max-w-md items-start gap-3 rounded-md border border-orange/50 bg-graphite py-3 pl-5 pr-2 text-sm">
      <p className="min-w-0 flex-1 whitespace-pre-line py-2.5">{message}</p>
      <button
        type="button"
        aria-label="Fermer le message"
        onClick={onClose}
        className="inline-grid h-11 w-11 shrink-0 place-items-center rounded-full text-silver transition-colors hover:text-ivory"
      >
        <X size={16} aria-hidden />
      </button>
    </div>
  );
}
