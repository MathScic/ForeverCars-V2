import { useState, type DragEvent } from "react";
import { FolderOpen, ImagePlus } from "lucide-react";
import Card from "../ui/Card";
import type { Photo } from "../demo/types";
import PhotoGrid from "./PhotoGrid";
import type { StepProps } from "./Wizard";

// Ébauche : les images restent dans la mémoire de l'app. Le traitement réel
// (rotation EXIF, 1600 px, compression, filigrane) se fera dans le process main (phase 7).
function toPhotos(files: FileList | null): Photo[] {
  return Array.from(files ?? [])
    .filter((f) => f.type.startsWith("image/"))
    .sort((a, b) => a.name.localeCompare(b.name, "fr", { numeric: true }))
    .map((f) => ({ id: crypto.randomUUID(), url: URL.createObjectURL(f), name: f.name }));
}

export default function StepPhotos({ vehicle, onChange, errors }: StepProps) {
  const [over, setOver] = useState(false);
  const add = (files: FileList | null) => onChange({ photos: [...vehicle.photos, ...toPhotos(files)] });

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    add(e.dataTransfer.files);
  };

  return (
    <Card className="p-6 space-y-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={`rounded-lg border-2 border-dashed p-10 text-center transition-colors ${
          over ? "border-brand-orange bg-brand-orange/5" : "border-brand-gray-medium/50"
        }`}
      >
        <ImagePlus size={32} className="mx-auto text-brand-orange" />
        <p className="mt-3 font-semibold">Glissez les photos ici</p>
        <p className="text-sm text-brand-gray-light/70 mt-1">ou choisissez des fichiers ou un dossier entier</p>
        <div className="mt-5 flex justify-center gap-3">
          <label className="h-11 px-5 inline-flex items-center gap-2 rounded-full bg-brand-orange text-brand-black text-sm font-semibold cursor-pointer hover:bg-brand-orange/90">
            <ImagePlus size={16} /> Fichiers
            <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => add(e.target.files)} />
          </label>
          <label className="h-11 px-5 inline-flex items-center gap-2 rounded-full border-2 border-brand-orange text-brand-orange text-sm font-semibold cursor-pointer hover:bg-brand-orange hover:text-brand-black">
            <FolderOpen size={16} /> Dossier
            <input
              type="file"
              multiple
              className="sr-only"
              onChange={(e) => add(e.target.files)}
              {...{ webkitdirectory: "" }}
            />
          </label>
        </div>
      </div>

      {errors.photos && <p className="text-sm text-brand-danger">{errors.photos}</p>}
      <PhotoGrid photos={vehicle.photos} onChange={(photos) => onChange({ photos })} />
    </Card>
  );
}
