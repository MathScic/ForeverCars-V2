import { useEffect, useId, useRef, type ReactNode } from "react";
import Button from "./Button";

interface Props {
  title: string;
  confirmLabel: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children: ReactNode;
}

// Fenêtre de confirmation, affichée dès qu'elle est montée (balise <dialog> : le focus reste dedans,
// Échap annule, « Annuler » a le focus par défaut pour éviter une suppression par erreur).
export default function ConfirmDialog({ title, confirmLabel, danger = false, busy = false, onConfirm, onCancel, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) onCancel();
      }}
      className="m-auto w-[min(92vw,560px)] rounded-md border border-line-strong bg-graphite p-7 text-left text-ivory backdrop:bg-carbon/80"
    >
      <h2 id={titleId} className="fc-h3">
        {title}
      </h2>
      <div className="mt-4 grid gap-2 text-sm leading-relaxed text-silver">{children}</div>
      <div className="mt-8 flex flex-wrap justify-end gap-3">
        <Button variant="ghost" onClick={onCancel} disabled={busy} autoFocus>
          Annuler
        </Button>
        <Button variant={danger ? "danger" : "primary"} onClick={onConfirm} disabled={busy}>
          {busy ? "Un instant…" : confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
