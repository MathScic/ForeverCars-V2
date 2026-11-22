import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import Button from "../ui/Button";
import type { StepIndex } from "./draft";

interface Props {
  step: StepIndex;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
}

// À la dernière étape, la publication se fait depuis le bloc « Prêt à publier ».
export default function WizardFooter({ step, onBack, onNext, onSaveDraft }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 pt-6 border-t border-brand-gray-medium/20">
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeft size={16} /> {step === 0 ? "Retour au parc" : "Précédent"}
      </Button>
      {step === 3 ? (
        <Button variant="outline" onClick={onSaveDraft}>
          <Save size={16} /> Garder en brouillon
        </Button>
      ) : (
        <Button size="lg" onClick={onNext}>
          Suivant <ArrowRight size={16} />
        </Button>
      )}
    </div>
  );
}
