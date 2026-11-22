import { useRef, useState, type DragEvent } from "react";
import { FolderOpen, ImagePlus, UploadCloud } from "lucide-react";
import Card from "../ui/Card";
import type { Photo } from "../demo/types";
import { filesFromDrop, hasFiles } from "./dropFiles";
import PhotoGrid from "./PhotoGrid";
import type { StepProps } from "./Wizard";

// Ébauche : les images restent dans la mémoire de l'app. Le traitement réel
// (rotation EXIF, 1600 px, compression, filigrane) se fera dans le process main (phase 7).
const toPhotos = (files: File[]): Photo[] =>
  files.map((f) => ({ id: crypto.randomUUID(), url: URL.createObjectURL(f), name: f.name }));

const pill = "h-11 px-5 inline-flex items-center gap-2 rounded-full text-sm font-semibold transition-colors";

export default function StepPhotos({ vehicle, onChange, errors }: StepProps) {
  const [over, setOver] = useState(false);
  const depth = useRef(0); // compteur : dragenter/dragleave se déclenchent aussi sur les enfants
  const add = (files: File[]) => files.length > 0 && onChange({ photos: [...vehicle.photos, ...toPhotos(files)] });
  const fromInput = (list: FileList | null) => add(Array.from(list ?? []).filter((f) => f.type.startsWith("image/")));

  const dragProps = {
    onDragEnter: (e: DragEvent) => {
      if (!hasFiles(e.dataTransfer)) return;
      depth.current += 1;
      setOver(true);
    },
    onDragOver: (e: DragEvent) => hasFiles(e.dataTransfer) && e.preventDefault(),
    onDragLeave: () => {
      depth.current = Math.max(0, depth.current - 1);
      if (depth.current === 0) setOver(false);
    },
    onDrop: async (e: DragEvent) => {
      if (!hasFiles(e.dataTransfer)) return;
      e.preventDefault();
      depth.current = 0;
      setOver(false);
      add(await filesFromDrop(e.dataTransfer));
    },
  };

  return (
    // Toute la carte accepte le dépôt, pas seulement le cadre pointillé.
    <Card className="relative p-6 space-y-6" {...dragProps} data-testid="photo-dropzone">
      <div className="rounded-lg border-2 border-dashed border-brand-gray-medium/50 p-8 text-center">
        <ImagePlus size={32} className="mx-auto text-brand-orange" />
        <p className="mt-3 font-semibold">Glissez les photos ou un dossier entier ici</p>
        <p className="text-sm text-brand-gray-light/70 mt-1">
          Triées par nom de fichier · la première devient la couverture · réordonnez en les faisant glisser
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <label className={`${pill} bg-brand-orange text-brand-black hover:bg-brand-orange/90`}>
            <ImagePlus size={16} /> Choisir des photos
            <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => fromInput(e.target.files)} />
          </label>
          <label className={`${pill} border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-brand-black`}>
            <FolderOpen size={16} /> Choisir un dossier
            <input type="file" multiple className="sr-only" onChange={(e) => fromInput(e.target.files)} {...{ webkitdirectory: "" }} />
          </label>
        </div>
      </div>

      {errors.photos && <p className="text-sm text-brand-danger">{errors.photos}</p>}
      <PhotoGrid photos={vehicle.photos} onChange={(photos) => onChange({ photos })} />

      {over && (
        <div className="pointer-events-none absolute inset-0 rounded-lg border-2 border-brand-orange bg-brand-black/85 flex flex-col items-center justify-center gap-3">
          <UploadCloud size={40} className="text-brand-orange" />
          <p className="font-display text-lg font-semibold">Lâchez pour ajouter les photos</p>
        </div>
      )}
    </Card>
  );
}
