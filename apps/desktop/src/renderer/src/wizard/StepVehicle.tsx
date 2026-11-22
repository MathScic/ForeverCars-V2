import { Search } from "lucide-react";
import Card from "../ui/Card";
import { Field, Input, Select } from "../ui/Field";
import type { Fuel, Gearbox } from "../demo/types";
import { normalizePlate } from "./draft";
import type { StepProps } from "./Wizard";

const num = (value: string) => (value === "" ? 0 : Number(value));

export default function StepVehicle({ vehicle: v, onChange, errors }: StepProps) {
  return (
    <Card className="p-6 space-y-6">
      <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
        <Field label="Plaque d'immatriculation" error={errors.plate} hint="Format SIV : AA-123-AA">
          <Input
            value={v.plate}
            onChange={(e) => onChange({ plate: e.target.value.toUpperCase() })}
            onBlur={(e) => onChange({ plate: normalizePlate(e.target.value) })}
            placeholder="FX-482-KM"
            className="font-mono"
          />
        </Field>
        {/* Interface PlateLookup : implémentation « saisie manuelle » par défaut (module SIV payant). */}
        <button
          type="button"
          disabled
          title="Module SIV non branché : saisie manuelle"
          className="h-11 px-4 mb-6 inline-flex items-center gap-2 rounded-full border border-brand-gray-medium/40 text-sm text-brand-gray-light/50"
        >
          <Search size={16} /> Recherche SIV (bientôt)
        </button>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Field label="Marque" error={errors.brand}>
          <Input value={v.brand} onChange={(e) => onChange({ brand: e.target.value })} placeholder="Peugeot" />
        </Field>
        <Field label="Modèle" error={errors.model}>
          <Input value={v.model} onChange={(e) => onChange({ model: e.target.value })} placeholder="2008" />
        </Field>
        <div className="col-span-2">
          <Field label="Version / finition">
            <Input value={v.version} onChange={(e) => onChange({ version: e.target.value })} placeholder="1.2 PureTech 130 GT" />
          </Field>
        </div>
        <Field label="Année" error={errors.year}>
          <Input type="number" value={v.year || ""} onChange={(e) => onChange({ year: num(e.target.value) })} />
        </Field>
        <Field label="Kilométrage" error={errors.mileage}>
          <Input type="number" min={0} value={v.mileage || ""} onChange={(e) => onChange({ mileage: num(e.target.value) })} />
        </Field>
        <Field label="Carburant">
          <Select value={v.fuel} onChange={(e) => onChange({ fuel: e.target.value as Fuel })}>
            <option value="essence">Essence</option>
            <option value="diesel">Diesel</option>
            <option value="hybride">Hybride</option>
            <option value="electrique">Électrique</option>
          </Select>
        </Field>
        <Field label="Boîte de vitesses">
          <Select value={v.gearbox} onChange={(e) => onChange({ gearbox: e.target.value as Gearbox })}>
            <option value="manuelle">Manuelle</option>
            <option value="automatique">Automatique</option>
          </Select>
        </Field>
        <Field label="Puissance (ch)" error={errors.powerHp}>
          <Input type="number" min={0} value={v.powerHp || ""} onChange={(e) => onChange({ powerHp: num(e.target.value) })} />
        </Field>
      </div>
    </Card>
  );
}
