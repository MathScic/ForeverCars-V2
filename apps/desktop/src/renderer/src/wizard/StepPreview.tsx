import { Printer } from "lucide-react";
import PublishChecklist from "./preview/PublishChecklist";
import VitrineSheet from "./preview/VitrineSheet";
import SitePreviewCard from "./SitePreviewCard";
import type { StepProps } from "./Wizard";

const caption = "text-xs uppercase tracking-wider text-brand-gray-light/70 mb-3";

export default function StepPreview({ vehicle: v, onPublish }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[1fr_340px] gap-8 items-start">
        <div className="space-y-6">
          <div>
            <p className={caption}>Aperçu sur forevercars.fr</p>
            <div className="max-w-sm">
              <SitePreviewCard vehicle={v} />
            </div>
          </div>
          <PublishChecklist vehicle={v} onPublish={onPublish} />
        </div>
        <div>
          <p className={caption}>Fiche vitrine · A4 pare-brise</p>
          <VitrineSheet vehicle={v} />
          <button
            type="button"
            // Ouvre la boîte d'impression de Windows ; seule la fiche est imprimée (voir styles.css).
            onClick={() => window.print()}
            className="mt-4 w-full h-12 inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand-orange text-brand-orange text-sm font-semibold hover:bg-brand-orange hover:text-brand-black transition-colors"
          >
            <Printer size={16} /> Imprimer la fiche
          </button>
        </div>
      </div>
    </div>
  );
}
