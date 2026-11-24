import { formatMileage, formatPrice } from "@forevercars/shared";
import type { DemoVehicle } from "../demo/types";
import Card from "../ui/Card";
import { Tag } from "../ui/Badge";
import { DOCS, docProgress, firstMissing, type DocType } from "./catalog";

interface Props {
  vehicle: DemoVehicle;
  onSet: (doc: string, done: boolean) => void;
}

const action =
  "inline-flex h-11 min-w-[124px] items-center justify-center rounded-sm px-5 font-display text-[11px] font-semibold uppercase tracking-[0.2em] [font-stretch:112%] transition-colors duration-300";

function DocRow({ doc, ready, onSet }: { doc: DocType; ready: boolean; onSet: Props["onSet"] }) {
  const tag = ready ? <Tag tone="success">{doc.kind === "gen" ? "Généré" : "Reçu"}</Tag> : doc.kind === "gen" ? <Tag>À générer</Tag> : <Tag tone="danger">Manquant</Tag>;
  return (
    <li className="flex flex-wrap items-center gap-4 border-t border-line py-4">
      <span className="min-w-0 flex-1 text-[15px]">{doc.name}</span>
      {tag}
      {doc.kind === "file" ? (
        // Démo : le fichier choisi marque la pièce comme reçue (l'envoi réel arrive avec Supabase Storage).
        <label className={`${action} cursor-pointer border border-line-strong text-ivory hover:border-ivory has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-orange`}>
          {ready ? "Remplacer" : "Ajouter"}
          <input type="file" accept="image/*,application/pdf" className="sr-only" onChange={(e) => e.target.files?.length && onSet(doc.id, true)} />
        </label>
      ) : (
        <button type="button" onClick={() => onSet(doc.id, true)} className={`${action} ${ready ? "border border-line-strong text-ivory hover:border-ivory" : "bg-orange text-carbon hover:bg-orange/90"}`}>
          {ready ? "Regénérer" : "Générer"}
        </button>
      )}
    </li>
  );
}

// Dossier d'un véhicule (maquette backoffice-docs.html) : 4 pièces à fournir, 3 documents générés.
export default function DocPanel({ vehicle: v, onSet }: Props) {
  const { done, total } = docProgress(v.documents);
  const missing = firstMissing(v.documents);
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
      <ul className="mt-6">
        {DOCS.map((d) => (
          <DocRow key={d.id} doc={d} ready={Boolean(v.documents?.[d.id])} onSet={onSet} />
        ))}
      </ul>
    </Card>
  );
}
