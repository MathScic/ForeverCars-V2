import { useState } from "react";
import { ArrowLeft, ArrowRight, GripVertical, Star, X } from "lucide-react";
import type { Photo } from "../demo/types";

interface Props {
  photos: Photo[];
  onChange: (photos: Photo[]) => void;
}

export function move<T>(list: T[], from: number, to: number): T[] {
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item!);
  return copy;
}

const ctrl =
  "h-9 w-9 inline-flex items-center justify-center rounded-full bg-brand-black/75 text-brand-white hover:bg-brand-black";

// La première photo est la couverture. On réordonne en faisant glisser une photo sur une autre.
export default function PhotoGrid({ photos, onChange }: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  if (photos.length === 0) return null;

  const reset = () => {
    setDragIndex(null);
    setOverIndex(null);
  };

  return (
    <ul className="grid grid-cols-4 gap-4" aria-label={`${photos.length} photos`}>
      {photos.map((p, i) => (
        <li
          key={p.id}
          draggable
          onDragStart={(e) => {
            e.dataTransfer.effectAllowed = "move";
            setDragIndex(i);
          }}
          onDragEnter={() => dragIndex !== null && setOverIndex(i)}
          onDragOver={(e) => dragIndex !== null && e.preventDefault()}
          onDragEnd={reset}
          onDrop={(e) => {
            if (dragIndex === null) return; // dépôt de fichiers : géré par la carte parente
            e.preventDefault();
            e.stopPropagation();
            if (dragIndex !== i) onChange(move(photos, dragIndex, i));
            reset();
          }}
          className={`group relative aspect-[4/3] rounded-lg overflow-hidden bg-brand-gray-medium cursor-grab active:cursor-grabbing border-2 transition-[border-color,opacity,transform] duration-150 ${
            overIndex === i && dragIndex !== i ? "border-brand-orange scale-[1.03]" : i === 0 ? "border-brand-orange/70" : "border-transparent"
          } ${dragIndex === i ? "opacity-30" : ""}`}
        >
          <img src={p.url} alt={p.name} className="w-full h-full object-cover pointer-events-none" />
          <span className="absolute top-2 left-2 flex items-center gap-1">
            <span className="h-6 px-1.5 inline-flex items-center rounded bg-brand-black/75 text-xs tabular-nums">
              <GripVertical size={12} className="opacity-60" /> {i + 1}
            </span>
            {i === 0 && (
              <span className="h-6 px-2 inline-flex items-center text-xs font-semibold rounded bg-brand-orange text-brand-black">
                Couverture
              </span>
            )}
          </span>
          <div className="absolute right-2 bottom-2 flex gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
            {/* Flèches : réordonner au clavier */}
            {i > 0 && (
              <button type="button" className={ctrl} aria-label={`Avancer ${p.name}`} title="Avancer" onClick={() => onChange(move(photos, i, i - 1))}>
                <ArrowLeft size={14} />
              </button>
            )}
            {i < photos.length - 1 && (
              <button type="button" className={ctrl} aria-label={`Reculer ${p.name}`} title="Reculer" onClick={() => onChange(move(photos, i, i + 1))}>
                <ArrowRight size={14} />
              </button>
            )}
            {i > 0 && (
              <button type="button" className={ctrl} aria-label={`Mettre ${p.name} en couverture`} title="Mettre en couverture" onClick={() => onChange(move(photos, i, 0))}>
                <Star size={14} />
              </button>
            )}
            <button type="button" className={ctrl} aria-label={`Retirer ${p.name}`} title="Retirer" onClick={() => onChange(photos.filter((x) => x.id !== p.id))}>
              <X size={14} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
