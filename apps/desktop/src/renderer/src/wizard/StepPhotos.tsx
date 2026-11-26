import { useRef, useState, type DragEvent } from "react";
import { FolderOpen, ImagePlus, UploadCloud } from "lucide-react";
import type { Photo } from "../../../shared/model";
import { errorText, useStore } from "../data/store";
import Card from "../ui/Card";
import { filesFromDrop, hasFiles } from "./dropFiles";
import PhotoGrid from "./PhotoGrid";
import type { StepProps } from "./Wizard";

// Les photos sont traitées sur ce PC (redressées, 3 tailles, filigrane) puis envoyées une à une ;
// l'ordre et les retraits sont enregistrés tout de suite (la première photo est la couverture).
const pill = "h-11 px-5 inline-flex items-center gap-2 rounded-sm font-display text-[11px] font-semibold uppercase tracking-[0.2em] [font-stretch:112%] transition-colors";

export default function StepPhotos({ vehicle, onChange, errors }: StepProps) {
  const { addPhotos, orderPhotos, notify } = useStore();
  const [over, setOver] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const depth = useRef(0); // compteur : dragenter/dragleave se déclenchent aussi sur les enfants

  const setPhotos = (photos: Photo[]) => {
    onChange({ photos });
    orderPhotos(vehicle.id, photos.map((p) => p.id)).catch((e: unknown) => notify(errorText(e)));
  };
  const add = async (files: File[]) => {
    if (files.length === 0 || progress) return;
    setProgress({ done: 0, total: files.length });
    try {
      const added = await addPhotos(vehicle.id, files, (done) => setProgress({ done, total: files.length }));
      // Envois en parallèle : on remet l'ordre des fichiers (triés par nom) à la fin.
      if (added.length) setPhotos([...vehicle.photos, ...added]);
    } finally {
      setProgress(null);
    }
  };
  const fromInput = (list: FileList | null) => void add(Array.from(list ?? []).filter((f) => f.type.startsWith("image/")));

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
      await add(await filesFromDrop(e.dataTransfer));
    },
  };

  return (
    // Toute la carte accepte le dépôt, pas seulement le cadre pointillé.
    <Card className="relative p-6 space-y-6" {...dragProps} data-testid="photo-dropzone">
      <div className="rounded-md border-2 border-dashed border-line-strong p-8 text-center">
        <ImagePlus size={32} className="mx-auto text-orange" />
        <p className="mt-3 font-semibold">Glissez les photos ou un dossier entier ici</p>
        <p className="text-sm text-silver mt-1">
          Triées par nom de fichier · la première devient la couverture · réordonnez en les faisant glisser
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <label className={`${pill} bg-orange text-carbon hover:bg-orange/90`}>
            <ImagePlus size={16} /> Choisir des photos
            <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => fromInput(e.target.files)} />
          </label>
          <label className={`${pill} border-2 border-orange text-orange hover:bg-orange hover:text-carbon`}>
            <FolderOpen size={16} /> Choisir un dossier
            <input type="file" multiple className="sr-only" onChange={(e) => fromInput(e.target.files)} {...{ webkitdirectory: "" }} />
          </label>
        </div>
      </div>

      {progress && (
        <div role="status" className="grid gap-2">
          <p className="text-sm text-silver">Traitement et envoi des photos : {progress.done} / {progress.total}</p>
          <div className="h-1.5 overflow-hidden rounded-full bg-carbon">
            <div className="h-full bg-orange transition-[width] duration-300" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
          </div>
        </div>
      )}
      {errors.photos && <p className="text-sm text-danger">{errors.photos}</p>}
      <div className={progress ? "pointer-events-none opacity-60" : ""}>
        <PhotoGrid photos={vehicle.photos} onChange={setPhotos} />
      </div>

      {over && (
        <div className="pointer-events-none absolute inset-0 rounded-md border-2 border-orange bg-carbon/85 flex flex-col items-center justify-center gap-3">
          <UploadCloud size={40} className="text-orange" />
          <p className="font-display text-lg font-semibold">Lâchez pour ajouter les photos</p>
        </div>
      )}
    </Card>
  );
}
