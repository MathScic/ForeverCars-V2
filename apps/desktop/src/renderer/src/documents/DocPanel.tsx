import { useState } from "react";
import { formatMileage, formatPrice } from "@forevercars/shared";
import type { DemoVehicle } from "../demo/types";
import { errorText, useStore } from "../data/store";
import Card from "../ui/Card";
import { DOCS, docProgress, firstMissing } from "./catalog";
import DocRow from "./DocRow";

// Dossier d'un véhicule (maquette backoffice-docs.html) : 4 pièces à fournir, 3 documents de vente.
export default function DocPanel({ vehicle: v }: { vehicle: DemoVehicle }) {
  const { mode, addDocument, removeDocument, openDocument, notify } = useStore();
  const [busy, setBusy] = useState(false);
  const { done, total } = docProgress(v.documents);
  const missing = firstMissing(v.documents);

  const run = async (action: () => Promise<void>) => {
    setBusy(true);
    try {
      await action();
    } catch (e) {
      notify(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="fc-eyebrow">Dossier {v.fileNumber}</span>
          <h2 className="fc-model mt-4 text-xl">
            {v.brand} {v.model}
          </h2>
          <p className="mt-2 text-sm text-silver">
            {v.year} · {formatMileage(v.mileage)} · {formatPrice(v.price)}
          </p>
        </div>
        <span className={`font-display text-xl font-semibold tabular-nums [font-stretch:112%] ${done === total ? "text-success" : ""}`}>
          {done}/{total} pièces
        </span>
      </div>
      {missing && <p className="mt-5 text-sm text-orange">À demander en priorité : {missing.name.toLowerCase()}.</p>}
      {mode === "live" && <p className="mt-2 text-xs text-silver">Rangées dans un espace privé : jamais visibles sur le site.</p>}
      {busy && <p role="status" className="mt-2 text-xs text-silver">Envoi en cours…</p>}
      <ul className="mt-6">
        {DOCS.map((d) => (
          <DocRow
            key={d.id}
            doc={d}
            ready={Boolean(v.documents?.[d.id])}
            live={mode === "live"}
            busy={busy}
            onAdd={(file) => void run(() => addDocument(v.id, d.id, file))}
            onOpen={() => void run(() => openDocument(v.id, d.id))}
            onRemove={() => void run(() => removeDocument(v.id, d.id))}
          />
        ))}
      </ul>
    </Card>
  );
}
