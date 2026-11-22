import { computeMargin, formatPrice } from "@forevercars/shared";
import { Lock } from "lucide-react";
import { useDemoStore } from "../demo/store";
import Card from "../ui/Card";
import { Field, Input, Textarea } from "../ui/Field";
import EquipmentInput from "./EquipmentInput";
import type { StepProps } from "./Wizard";

const num = (value: string) => (value === "" ? 0 : Number(value));

export default function StepPricing({ vehicle: v, onChange, errors }: StepProps) {
  const { isAdmin } = useDemoStore();
  const margin =
    v.purchasePrice !== undefined
      ? computeMargin({ salePrice: v.price, purchasePrice: v.purchasePrice, repairCost: v.repairCost })
      : null;

  return (
    <div className="grid grid-cols-[1fr_320px] gap-6 items-start">
      <Card className="p-6 space-y-6">
        <Field label="Prix de vente (€)" error={errors.price}>
          <Input type="number" min={0} value={v.price || ""} onChange={(e) => onChange({ price: num(e.target.value) })} />
        </Field>
        <Field label="Équipements" hint="Entrée pour ajouter">
          <EquipmentInput value={v.equipment} onChange={(equipment) => onChange({ equipment })} />
        </Field>
        <Field label="Description" error={errors.description} hint="Le texte affiché sur la fiche du site">
          <Textarea
            rows={6}
            value={v.description}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Première main, entretien complet, distribution faite…"
          />
        </Field>
        <label className="flex items-center gap-3 min-h-11 cursor-pointer">
          <input
            type="checkbox"
            checked={v.isFeatured}
            onChange={(e) => onChange({ isFeatured: e.target.checked })}
            className="h-5 w-5 accent-brand-orange"
          />
          <span className="text-sm">Coup de cœur : mettre en avant sur la page d&apos;accueil du site</span>
        </label>
      </Card>

      {isAdmin ? (
        <Card className="p-6 space-y-5 border-brand-orange/30">
          <p className="flex items-center gap-2 text-xs uppercase tracking-wider text-brand-orange">
            <Lock size={14} /> Interne — admin uniquement
          </p>
          <Field label="Prix d'achat (€)">
            <Input type="number" min={0} value={v.purchasePrice ?? ""} onChange={(e) => onChange({ purchasePrice: num(e.target.value) })} />
          </Field>
          <Field label="Frais de remise en état (€)">
            <Input type="number" min={0} value={v.repairCost ?? ""} onChange={(e) => onChange({ repairCost: num(e.target.value) })} />
          </Field>
          <div className="pt-4 border-t border-brand-gray-medium/20">
            <p className="text-xs uppercase tracking-wider text-brand-gray-light/70">Marge estimée</p>
            <p className={`font-display text-2xl font-bold tabular-nums mt-1 ${margin && margin.amount < 0 ? "text-brand-danger" : "text-brand-success"}`}>
              {margin ? `${formatPrice(margin.amount)} · ${Math.round(margin.rate * 100)} %` : "—"}
            </p>
          </div>
        </Card>
      ) : (
        <Card className="p-6 text-sm text-brand-gray-light/70">
          Les coûts internes et la marge sont réservés à l&apos;admin.
        </Card>
      )}
    </div>
  );
}
