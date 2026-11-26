import { useState } from "react";
import ConfirmDialog from "../ui/ConfirmDialog";

interface Props {
  name: string;
  password: string;
  onClose: () => void;
}

// Mot de passe provisoire : affiché une seule fois. L'admin le transmet (de vive voix, SMS…),
// la personne se connecte puis choisit le sien (bouton « Mot de passe » en haut de l'app).
export default function PasswordReveal({ name, password, onClose }: Props) {
  const [copied, setCopied] = useState<"ok" | "error" | null>(null);
  const copy = async () => {
    try {
      await window.api.app.copy(password); // presse-papiers de Windows (celui de la page est bloqué)
      setCopied("ok");
    } catch {
      setCopied("error");
    }
  };

  return (
    <ConfirmDialog title={`Accès de ${name}`} confirmLabel="C'est noté" onConfirm={onClose} onCancel={onClose}>
      <p>Mot de passe provisoire, affiché une seule fois :</p>
      <p className="select-all rounded-sm border border-line-strong bg-carbon px-4 py-3 font-mono text-lg tracking-wider text-ivory">{password}</p>
      <button type="button" onClick={() => void copy()} className="inline-flex h-11 items-center justify-self-start text-sm text-orange underline-offset-4 hover:underline">
        {copied === "ok" ? "Copié dans le presse-papiers" : "Copier"}
      </button>
      {copied === "error" && <p className="text-danger">Copie impossible : recopiez-le à la main (pas de 0, O, 1, l ni I, pour éviter les confusions).</p>}
      <p>
        Transmettez-le à la personne : elle se connecte avec, puis choisit son propre mot de passe (bouton « Mot de passe » en haut de l&apos;app).
        Seul ce mot de passe-ci fonctionne : les précédents ne marchent plus.
      </p>
    </ConfirmDialog>
  );
}
