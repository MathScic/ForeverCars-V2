import { computeMargin, formatPrice } from "@forevercars/shared";
import { Lock, ShieldCheck } from "lucide-react";
import { useDemoStore } from "../../demo/store";
import Card from "../../ui/Card";
import { Field, Input } from "../../ui/Field";
import type { DemoVehicle } from "../../demo/types";

const num = (value: string) => (value === "" ? undefined : Number(value));

interface Props {
  vehicle: DemoVehicle;
  onChange: (patch: Partial<DemoVehicle>) => void;
}

// Coûts internes et résultat net : réservés à l'admin, jamais envoyés au site.
export default function InternalCosts({ vehicle: v, onChange }: Props) {
  const { isAdmin } = useDemoStore();
  if (!isAdmin) {
    return (
      <Card className="p-5 text-sm text-silver flex items-start gap-3">
        <Lock size={16} className="mt-0.5 shrink-0" /> Les coûts internes et la marge sont réservés à l&apos;admin.
      </Card>
    );
  }

  const margin = computeMargin({ salePrice: v.price, purchasePrice: v.purchasePrice ?? 0, repairCost: v.repairCost });
  return (
    <Card className="p-5 space-y-4">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <ShieldCheck size={16} className="text-orange" /> Données internes — jamais publiées
      </p>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Prix d'achat (€)">
          <Input type="number" min={0} placeholder="ex. 14200" value={v.purchasePrice ?? ""} onChange={(e) => onChange({ purchasePrice: num(e.target.value) })} />
        </Field>
        <Field label="Remise en état (€)">
          <Input type="number" min={0} placeholder="ex. 450" value={v.repairCost ?? ""} onChange={(e) => onChange({ repairCost: num(e.target.value) })} />
        </Field>
      </div>
      <div className="flex items-end justify-between pt-3 border-t border-line">
        <div>
          <p className="text-sm text-silver">Marge prévisionnelle</p>
          <p className="text-xs text-silver">prix de vente − achat − remise en état</p>
        </div>
        <p className={`font-display text-2xl font-bold tabular-nums ${margin.amount < 0 ? "text-danger" : "text-success"}`}>
          {formatPrice(margin.amount)}
        </p>
      </div>
    </Card>
  );
}
