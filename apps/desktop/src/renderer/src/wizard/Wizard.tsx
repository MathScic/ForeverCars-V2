import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { nowIso, useDemoStore } from "../demo/store";
import type { DemoVehicle } from "../demo/types";
import { generateDescription } from "../services/description";
import { nextFileNumber } from "../services/fileNumber";
import { emptyVehicle, finalize, STEPS, validateStep, type Errors, type StepIndex } from "./draft";
import Stepper from "./Stepper";
import StepIdentification from "./StepIdentification";
import StepPhotos from "./StepPhotos";
import StepPreview from "./StepPreview";
import StepPricing from "./StepPricing";
import WizardFooter from "./WizardFooter";

export interface StepProps {
  vehicle: DemoVehicle;
  onChange: (patch: Partial<DemoVehicle>) => void;
  errors: Errors;
  onPublish: () => void;
}

const views = [StepIdentification, StepPhotos, StepPricing, StepPreview];

// Tant que la description n'a pas été retouchée à la main, elle suit la fiche.
const withAutoDescription = (v: DemoVehicle): DemoVehicle =>
  v.descriptionIsAuto ? { ...v, description: generateDescription(v) } : v;

// Une clé par véhicule : changer d'URL repart d'un état propre.
export default function WizardRoute() {
  const { id } = useParams();
  return <Wizard key={id ?? "nouveau"} id={id} />;
}

function Wizard({ id }: { id?: string }) {
  const { state, dispatch } = useDemoStore();
  const navigate = useNavigate();
  const existing = state.vehicles.find((v) => v.id === id);
  const [vehicle, setVehicle] = useState<DemoVehicle>(() => {
    if (existing) return existing;
    const now = nowIso();
    const fileNumber = nextFileNumber(state.vehicles.map((v) => v.fileNumber), new Date(now).getFullYear());
    return emptyVehicle(`v-${Date.now()}`, now, fileNumber);
  });
  const [step, setStep] = useState<StepIndex>(0);
  const [errors, setErrors] = useState<Errors>({});
  // Change d'étape et remonte en haut de la page.
  const goTo = (s: StepIndex) => {
    setStep(s);
    document.querySelector("main")?.scrollTo({ top: 0 });
  };

  const onChange = (patch: Partial<DemoVehicle>) => setVehicle((v) => withAutoDescription({ ...v, ...patch }));
  // Brouillon automatique : chaque étape validée est enregistrée.
  const save = () => dispatch({ type: "save", vehicle: finalize(vehicle), now: nowIso() });

  const next = () => {
    const found = validateStep(step, vehicle);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    save();
    goTo(Math.min(3, step + 1) as StepIndex);
  };

  const publish = () => {
    save();
    // Simulation : la vraie logique de publication sera écrite en phase 7.
    dispatch({ type: "publish", id: vehicle.id, now: nowIso() });
    navigate(`/succes/${vehicle.id}`);
  };

  const View = views[step]!;
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          {existing ? `Modifier : ${existing.brand} ${existing.model}` : "Mettre un véhicule en vente"}
        </h1>
        <p className="text-brand-gray-light mt-1">
          Dossier <span className="font-mono text-brand-white">{vehicle.fileNumber}</span> · brouillon
          enregistré à chaque étape, rien ne se perd si vous fermez l&apos;application.
        </p>
      </div>
      <Stepper steps={STEPS} current={step} onSelect={(s) => s < step && goTo(s)} />
      <View vehicle={vehicle} onChange={onChange} errors={errors} onPublish={publish} />
      <WizardFooter
        step={step}
        onBack={() => (step === 0 ? navigate("/") : goTo((step - 1) as StepIndex))}
        onNext={next}
        onSaveDraft={() => {
          save();
          navigate("/");
        }}
      />
    </div>
  );
}
