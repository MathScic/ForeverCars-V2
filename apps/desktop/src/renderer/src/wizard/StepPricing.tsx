import Card from "../ui/Card";
import Switch from "../ui/Switch";
import DescriptionEditor from "./pricing/DescriptionEditor";
import EquipmentPicker from "./pricing/EquipmentPicker";
import InternalCosts from "./pricing/InternalCosts";
import PriceBlock from "./pricing/PriceBlock";
import type { StepProps } from "./Wizard";

export default function StepPricing({ vehicle: v, onChange, errors }: StepProps) {
  return (
    <Card className="p-6 space-y-8">
      <div className="grid grid-cols-2 gap-6 items-start">
        <PriceBlock vehicle={v} onChange={onChange} errors={errors} />
        <InternalCosts vehicle={v} onChange={onChange} />
      </div>

      <div>
        <p className="text-xs uppercase tracking-wider text-brand-gray-light mb-3">Équipements</p>
        <EquipmentPicker value={v.equipment} onChange={(equipment) => onChange({ equipment })} />
      </div>

      <DescriptionEditor vehicle={v} error={errors.description} onChange={onChange} />

      <div className="grid grid-cols-2 gap-3">
        <Switch
          checked={v.isFeatured}
          onChange={(isFeatured) => onChange({ isFeatured })}
          label="Mettre en avant"
          description="Bandeau « Coup de cœur » en page d'accueil"
        />
        <Switch
          checked={v.exportLeboncoin}
          onChange={(exportLeboncoin) => onChange({ exportLeboncoin })}
          label="Exporter vers Leboncoin"
          description="Fichier d'annonce prêt à importer (publication manuelle)"
        />
        <Switch
          checked={v.exportLaCentrale}
          onChange={(exportLaCentrale) => onChange({ exportLaCentrale })}
          label="Exporter vers La Centrale"
          description="Fichier d'annonce prêt à importer (publication manuelle)"
        />
      </div>
    </Card>
  );
}
