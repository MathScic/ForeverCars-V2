import { Tag } from "../ui/Badge";
import type { DocType } from "./catalog";

const action =
  "inline-flex h-11 min-w-[110px] items-center justify-center rounded-sm px-4 font-display text-[11px] font-semibold uppercase tracking-[0.2em] [font-stretch:112%] transition-colors duration-300";
const ghost = `${action} cursor-pointer border border-line-strong text-ivory hover:border-ivory has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-orange`;

interface Props {
  doc: DocType;
  ready: boolean;
  live: boolean;
  busy: boolean;
  onAdd: (file: File) => void;
  onOpen: () => void;
  onRemove: () => void;
}

// Une pièce du dossier. Réel : le fichier est rangé dans l'espace privé (ouvrir, remplacer, retirer).
// Les documents de vente se génèrent plus tard ; en attendant, on range la version signée.
export default function DocRow({ doc, ready, live, busy, onAdd, onOpen, onRemove }: Props) {
  const gen = doc.kind === "gen";
  const done = gen ? (live ? "Rangé" : "Généré") : "Reçu";
  const tag = ready ? <Tag tone="success">{done}</Tag> : gen ? <Tag>{live ? "À ranger" : "À générer"}</Tag> : <Tag tone="danger">Manquant</Tag>;
  const fileInput = (label: string) => (
    <label className={`${ghost} ${busy ? "pointer-events-none opacity-40" : ""}`}>
      {label}
      <input type="file" accept="image/*,application/pdf" className="sr-only" disabled={busy}
        onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) onAdd(f); }} />
    </label>
  );

  return (
    <li className="flex flex-wrap items-center gap-3 border-t border-line py-4">
      <span className="min-w-0 flex-1 text-[15px]">
        {doc.name}
        {live && gen && !ready && <span className="block text-xs text-silver">Version signée (la génération automatique arrive ensuite)</span>}
      </span>
      {tag}
      {ready && live && (
        <button type="button" onClick={onOpen} disabled={busy} className={`${action} bg-orange text-carbon hover:bg-orange/90 disabled:opacity-40`}>
          Ouvrir
        </button>
      )}
      {!live && gen ? (
        <button type="button" onClick={() => onAdd(new File([], doc.id))} className={`${action} ${ready ? "border border-line-strong text-ivory hover:border-ivory" : "bg-orange text-carbon hover:bg-orange/90"}`}>
          {ready ? "Regénérer" : "Générer"}
        </button>
      ) : (
        fileInput(ready ? "Remplacer" : "Ajouter")
      )}
      {ready && live && (
        <button type="button" onClick={onRemove} disabled={busy} className="inline-flex h-11 items-center px-2 text-sm text-silver underline-offset-4 hover:text-ivory hover:underline disabled:opacity-40">
          Retirer
        </button>
      )}
    </li>
  );
}
