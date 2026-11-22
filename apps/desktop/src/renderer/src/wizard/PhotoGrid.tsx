import { useState } from "react";
import { ArrowLeft, ArrowRight, Star, X } from "lucide-react";
import type { Photo } from "../demo/types";

interface Props {
  photos: Photo[];
  onChange: (photos: Photo[]) => void;
}

function move<T>(list: T[], from: number, to: number): T[] {
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item!);
  return copy;
}

const ctrl =
  "h-9 w-9 inline-flex items-center justify-center rounded-full bg-brand-black/70 text-brand-white hover:bg-brand-black disabled:opacity-30";

// La première photo est la couverture. Réordonner par glisser-déposer ou avec les flèches.
export default function PhotoGrid({ photos, onChange }: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  if (photos.length === 0) return null;

  return (
    <ul className="grid grid-cols-4 gap-4">
      {photos.map((p, i) => (
        <li
          key={p.id}
          draggable
          onDragStart={() => setDragIndex(i)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            if (dragIndex !== null && dragIndex !== i) onChange(move(photos, dragIndex, i));
            setDragIndex(null);
          }}
          className={`group relative aspect-[4/3] rounded-lg overflow-hidden bg-brand-gray-medium cursor-grab border-2 ${
            i === 0 ? "border-brand-orange" : "border-transparent"
          } ${dragIndex === i ? "opacity-40" : ""}`}
        >
          <img src={p.url} alt={p.name} className="w-full h-full object-cover pointer-events-none" />
          {i === 0 && (
            <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded bg-brand-orange text-brand-black">
              Couverture
            </span>
          )}
          <div className="absolute inset-x-2 bottom-2 flex justify-between opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
            <div className="flex gap-1">
              <button type="button" className={ctrl} aria-label="Avancer" disabled={i === 0} onClick={() => onChange(move(photos, i, i - 1))}>
                <ArrowLeft size={14} />
              </button>
              <button type="button" className={ctrl} aria-label="Reculer" disabled={i === photos.length - 1} onClick={() => onChange(move(photos, i, i + 1))}>
                <ArrowRight size={14} />
              </button>
            </div>
            <div className="flex gap-1">
              {i > 0 && (
                <button type="button" className={ctrl} aria-label="Définir comme couverture" onClick={() => onChange(move(photos, i, 0))}>
                  <Star size={14} />
                </button>
              )}
              <button type="button" className={ctrl} aria-label={`Retirer ${p.name}`} onClick={() => onChange(photos.filter((x) => x.id !== p.id))}>
                <X size={14} />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
