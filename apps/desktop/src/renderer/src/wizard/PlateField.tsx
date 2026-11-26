import { Field, Input } from "../ui/Field";
import { normalizePlate } from "./draft";

// Mode réel : la plaque se saisit à la main (pas de service d'immatriculation branché).
// La lecture de la carte grise viendra remplir la fiche automatiquement à l'étape suivante.
export default function PlateField({ plate, error, onPlate }: { plate: string; error?: string; onPlate: (plate: string) => void }) {
  return (
    <Field label="Plaque d'immatriculation" error={error} hint="Facultative · format AA-123-AA">
      <Input
        value={plate}
        onChange={(e) => onPlate(e.target.value.toUpperCase())}
        onBlur={() => plate && onPlate(normalizePlate(plate))}
        placeholder="GH-218-KT"
        className="font-mono"
      />
    </Field>
  );
}
