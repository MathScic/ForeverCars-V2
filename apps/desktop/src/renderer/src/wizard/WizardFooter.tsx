import { ArrowLeft, ArrowRight, Save, Send } from "lucide-react";
import Button from "../ui/Button";
import type { StepIndex } from "./draft";

interface Props {
  step: StepIndex;
  isOnline: boolean;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

export default function WizardFooter({ step, isOnline, onBack, onNext, onSaveDraft, onPublish }: Props) {
  const last = step === 3;
  return (
    <div className="flex items-center justify-between gap-4 pt-6 border-t border-brand-gray-medium/20">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft size={16} /> {step === 0 ? "Retour au parc" : "Étape précédente"}
      </Button>
      <div className="flex items-center gap-3">
        {last ? (
          <>
            <Button variant="outline" onClick={onSaveDraft}>
              <Save size={16} /> {isOnline ? "Enregistrer" : "Garder en brouillon"}
            </Button>
            <Button size="lg" onClick={onPublish}>
              <Send size={16} /> {isOnline ? "Mettre à jour sur le site" : "Publier sur le site"}
            </Button>
          </>
        ) : (
          <Button size="lg" onClick={onNext}>
            Continuer <ArrowRight size={16} />
          </Button>
        )}
      </div>
    </div>
  );
}
