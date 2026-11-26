import { useNavigate, useParams } from "react-router";
import type { Vehicle } from "../../../shared/model";
import { STEPS, type Errors, type StepIndex } from "./draft";
import EditActions from "./EditActions";
import Stepper from "./Stepper";
import StepIdentification from "./StepIdentification";
import StepPhotos from "./StepPhotos";
import StepPreview from "./StepPreview";
import StepPricing from "./StepPricing";
import { useWizard } from "./useWizard";
import WizardFooter from "./WizardFooter";

export interface StepProps {
  vehicle: Vehicle;
  onChange: (patch: Partial<Vehicle>) => void;
  errors: Errors;
  onPublish: () => void;
}

const views = [StepIdentification, StepPhotos, StepPricing, StepPreview];

// Une clé par véhicule : changer d'URL repart d'un état propre.
export default function WizardRoute() {
  const { id } = useParams();
  return <Wizard key={id ?? "nouveau"} id={id} />;
}

function Wizard({ id }: { id?: string }) {
  const navigate = useNavigate();
  const w = useWizard(id);
  if (w.loadError) return <p role="alert" className="text-orange">{w.loadError}</p>;
  if (!w.vehicle) return <p role="status" className="text-silver">Ouverture de la fiche…</p>;

  const View = views[w.step]!;
  return (
    <div className="mx-auto grid max-w-5xl gap-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="fc-eyebrow">Dossier {w.vehicle.fileNumber}</span>
          <h1 className="fc-h2 mt-5">{id ? `Modifier : ${w.vehicle.brand} ${w.vehicle.model}` : "Mettre un véhicule en vente"}</h1>
          <p className="mt-4 text-silver">Brouillon enregistré à chaque étape : rien ne se perd si vous fermez l&apos;application.</p>
        </div>
        {id && <EditActions vehicle={w.vehicle} />}
      </div>
      <Stepper steps={STEPS} current={w.step} onSelect={(s) => s < w.step && w.goTo(s)} />
      <View vehicle={w.vehicle} onChange={w.onChange} errors={w.errors} onPublish={() => void w.publish()} />
      {w.saveError && (
        <p role="alert" className="text-sm text-danger">
          {w.saveError}
        </p>
      )}
      <WizardFooter
        step={w.step}
        busy={w.busy}
        onBack={() => (w.step === 0 ? navigate("/") : w.goTo((w.step - 1) as StepIndex))}
        onNext={() => void w.next()}
        onSaveDraft={() => void w.saveDraft()}
      />
    </div>
  );
}
