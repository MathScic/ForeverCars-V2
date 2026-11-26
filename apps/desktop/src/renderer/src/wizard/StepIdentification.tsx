import Card from "../ui/Card";
import { Field, Input, Select } from "../ui/Field";
import { useStore } from "../data/store";
import type { Body, Fuel, Gearbox } from "../demo/types";
import { BODY_LABELS, FUEL_LABELS, GEARBOX_LABELS } from "../services/equipment";
import PlateField from "./PlateField";
import PlateLookupBox from "./PlateLookupBox";
import type { StepProps } from "./Wizard";

const num = (value: string) => (value === "" ? 0 : Number(value));

export default function StepIdentification({ vehicle: v, onChange, errors }: StepProps) {
  const { mode } = useStore();
  return (
    <Card className="p-6 space-y-6">
      <div className="grid grid-cols-[220px_1fr] gap-5 items-start">
        <Field label="N° de dossier" error={errors.fileNumber} hint="Attribué automatiquement">
          <Input value={v.fileNumber} onChange={(e) => onChange({ fileNumber: e.target.value })} className="font-mono" />
        </Field>
        {/* Démo : recherche par plaque simulée. Réel : plaque saisie à la main (aucun service branché). */}
        {mode === "demo" ? (
          <PlateLookupBox plate={v.plate} error={errors.plate} onPlate={(plate) => onChange({ plate })} onFound={(result) => onChange(result)} />
        ) : (
          <PlateField plate={v.plate} error={errors.plate} onPlate={(plate) => onChange({ plate })} />
        )}
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Field label="Marque" error={errors.brand}>
          <Input value={v.brand} onChange={(e) => onChange({ brand: e.target.value })} placeholder="Toyota" />
        </Field>
        <Field label="Modèle" error={errors.model}>
          <Input value={v.model} onChange={(e) => onChange({ model: e.target.value })} placeholder="Yaris" />
        </Field>
        <Field label="Version / finition">
          <Input value={v.version} onChange={(e) => onChange({ version: e.target.value })} placeholder="Hybride 116h Iconic" />
        </Field>
        <Field label="Couleur">
          <Input value={v.color} onChange={(e) => onChange({ color: e.target.value })} placeholder="Gris Platine" />
        </Field>
        <Field label="Année" error={errors.year}>
          <Input type="number" value={v.year || ""} onChange={(e) => onChange({ year: num(e.target.value) })} />
        </Field>
        <Field label="Kilométrage" error={errors.mileage}>
          <Input type="number" min={0} value={v.mileage || ""} onChange={(e) => onChange({ mileage: num(e.target.value) })} />
        </Field>
        <Field label="Énergie">
          <Select value={v.fuel} onChange={(e) => onChange({ fuel: e.target.value as Fuel })}>
            {Object.entries(FUEL_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Select>
        </Field>
        <Field label="Boîte de vitesses">
          <Select value={v.gearbox} onChange={(e) => onChange({ gearbox: e.target.value as Gearbox })}>
            {Object.entries(GEARBOX_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Select>
        </Field>
        <Field label="Puissance (ch)" error={errors.powerHp}>
          <Input type="number" min={0} value={v.powerHp || ""} onChange={(e) => onChange({ powerHp: num(e.target.value) })} />
        </Field>
        <Field label="Carrosserie" hint="Sert au filtre « type » du site">
          <Select value={v.body ?? ""} onChange={(e) => onChange({ body: (e.target.value || null) as Body | null })}>
            <option value="">À préciser</option>
            {Object.entries(BODY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-5">
          <Field label="Propriétaires">
            <Select value={v.owners} onChange={(e) => onChange({ owners: Number(e.target.value) })}>
              {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n === 1 ? "Première main" : `${n} mains`}</option>)}
            </Select>
          </Field>
          <Field label="Garantie">
            <Select value={v.warrantyMonths} onChange={(e) => onChange({ warrantyMonths: Number(e.target.value) })}>
              {[0, 3, 6, 12, 24].map((n) => <option key={n} value={n}>{n === 0 ? "Sans garantie" : `${n} mois`}</option>)}
            </Select>
          </Field>
        </div>
      </div>
    </Card>
  );
}
