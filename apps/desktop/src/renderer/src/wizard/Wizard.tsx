import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { nowIso, useDemoStore } from "../demo/store";
import type { DemoVehicle } from "../demo/types";
import { emptyVehicle, finalize, STEPS, validateStep, type Errors, type StepIndex } from "./draft";
import Stepper from "./Stepper";
import StepPhotos from "./StepPhotos";
import StepPreview from "./StepPreview";
import StepPricing from "./StepPricing";
import StepVehicle from "./StepVehicle";
import WizardFooter from "./WizardFooter";

export interface StepProps {
  vehicle: DemoVehicle;
  onChange: (patch: Partial<DemoVehicle>) => void;
  errors: Errors;
}

const views = [StepVehicle, StepPhotos, StepPricing, StepPreview];

// Une clé par véhicule : changer d'URL repart d'un état propre.
export default function WizardRoute() {
  const { id } = useParams();
  return <Wizard key={id ?? "nouveau"} id={id} />;
}

function Wizard({ id }: { id?: string }) {
  const { state, dispatch } = useDemoStore();
  const navigate = useNavigate();
  const existing = state.vehicles.find((v) => v.id === id);
  const [vehicle, setVehicle] = useState<DemoVehicle>(() => existing ?? emptyVehicle(`v-${Date.now()}`, nowIso()));
  const [step, setStep] = useState<StepIndex>(0);
  const [errors, setErrors] = useState<Errors>({});

  const onChange = (patch: Partial<DemoVehicle>) => setVehicle((v) => ({ ...v, ...patch }));
  // Brouillon automatique : chaque étape validée est enregistrée.
  const save = () => dispatch({ type: "save", vehicle: finalize(vehicle), now: nowIso() });

  const next = () => {
    const found = validateStep(step, vehicle);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    save();
    setStep((s) => Math.min(3, s + 1) as StepIndex);
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
          Le brouillon est enregistré à chaque étape : rien ne se perd si vous fermez l&apos;application.
        </p>
      </div>
      <Stepper steps={STEPS} current={step} onSelect={(s) => s < step && setStep(s)} />
      <View vehicle={vehicle} onChange={onChange} errors={errors} />
      <WizardFooter
        step={step}
        isOnline={vehicle.status === "online"}
        onBack={() => (step === 0 ? navigate("/") : setStep((s) => (s - 1) as StepIndex))}
        onNext={next}
        onSaveDraft={() => {
          save();
          navigate("/");
        }}
        onPublish={publish}
      />
    </div>
  );
}
