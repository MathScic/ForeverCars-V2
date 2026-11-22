import { formatPrice } from "@forevercars/shared";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import Card from "../../ui/Card";
import type { DemoVehicle } from "../../demo/types";

interface Item {
  ok: boolean;
  label: string;
}

export function checklist(v: DemoVehicle): Item[] {
  const words = v.description.trim() ? v.description.trim().split(/\s+/).length : 0;
  const exports = [v.exportLeboncoin && "Leboncoin", v.exportLaCentrale && "La Centrale"].filter(Boolean);
  return [
    { ok: v.photos.length > 0, label: v.photos.length > 0 ? `${v.photos.length} photo(s), couverture : ${v.photos[0]!.name}` : "Aucune photo" },
    { ok: v.price > 0, label: `Prix affiché : ${formatPrice(v.price)}` },
    { ok: words >= 20, label: `Description : ${words} mots` },
    { ok: v.equipment.length > 0, label: `${v.equipment.length} équipement(s) renseigné(s)` },
    { ok: true, label: v.isFeatured ? "Mis en avant (coup de cœur)" : "Sans mise en avant" },
    { ok: true, label: exports.length ? `Export préparé : ${exports.join(", ")}` : "Pas d'export Leboncoin / La Centrale" },
  ];
}

export default function PublishChecklist({ vehicle, onPublish }: { vehicle: DemoVehicle; onPublish: () => void }) {
  const items = checklist(vehicle);
  const blocking = vehicle.photos.length === 0 || vehicle.price <= 0;

  return (
    <Card className="p-6">
      <h2 className="font-display text-lg font-bold">{blocking ? "Presque prêt" : "Prêt à publier"}</h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-3 text-sm">
            {item.ok ? (
              <CheckCircle2 size={18} className="text-brand-success shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-brand-orange shrink-0" />
            )}
            <span className={item.ok ? "text-brand-gray-light" : "text-brand-orange"}>{item.label}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onPublish}
        disabled={blocking}
        className="mt-6 w-full h-14 inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange text-brand-black font-display font-bold hover:bg-brand-orange/90 active:scale-[0.99] transition disabled:opacity-40"
      >
        <Send size={18} /> {vehicle.status === "online" ? "Mettre à jour l'annonce" : "Publier l'annonce"}
      </button>
    </Card>
  );
}
