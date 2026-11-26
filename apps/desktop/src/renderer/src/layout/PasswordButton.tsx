import { useState } from "react";
import { KeyRound } from "lucide-react";
import { errorText, useStore } from "../data/store";
import ConfirmDialog from "../ui/ConfirmDialog";
import { Field, Input } from "../ui/Field";

const pill = "inline-flex h-9 items-center gap-1.5 rounded-full px-3 transition-colors hover:bg-graphite hover:text-ivory";

// Choisir son propre mot de passe (après le mot de passe provisoire donné par l'admin).
export default function PasswordButton() {
  const { notify } = useStore();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const close = () => {
    setOpen(false);
    setPassword("");
    setConfirm("");
    setError(null);
  };
  const save = async () => {
    if (password.length < 10) return setError("10 caractères minimum.");
    if (password !== password.trim()) return setError("Pas d'espace au début ni à la fin.");
    if (password !== confirm) return setError("Les deux mots de passe ne sont pas identiques.");
    setBusy(true);
    try {
      await window.api.auth.changePassword(password);
      notify("Mot de passe changé : il servira dès la prochaine connexion.");
      close();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={pill}>
        <KeyRound size={12} aria-hidden /> Mot de passe
      </button>
      {open && (
        <ConfirmDialog title="Choisir mon mot de passe" confirmLabel="Enregistrer" busy={busy} onCancel={close} onConfirm={() => void save()}>
          <Field label="Nouveau mot de passe" hint="10 caractères minimum">
            <Input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <Field label="Le même, une deuxième fois">
            <Input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </Field>
          {error && (
            <p role="alert" className="text-danger">
              {error}
            </p>
          )}
        </ConfirmDialog>
      )}
    </>
  );
}
